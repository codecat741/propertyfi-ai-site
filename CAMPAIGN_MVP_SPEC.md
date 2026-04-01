# PropertyFi DFY Campaign System — MVP Integration Spec

## Context

PropertyFi needs a "Done For You" campaign system for roofing contractors. A roofer selects a territory, and PropertyFi automatically runs targeted SMS + direct mail campaigns on a recurring loop. This beats Reworked.ai ($1.79/opportunity, CSV-only, no execution) by offering better roof data + automated delivery.

The existing codebase is two static Next.js apps (`output: 'export'`) with zero backend. The campaign system is a **separate serverless service**, not bolted onto the existing apps.

**Partner stack (all pay-per-use, no contracts):**
- BatchData — skip tracing ($0.08-$0.12/record)
- Telnyx — SMS via toll-free ($0.004/msg)
- Lob — direct mail ($0.63/postcard incl. postage)
- Blacklist Alliance — DNC scrub ($0.005/record)

---

## Phase 1: Manual Pilot (Zero Code, Days 1-4)

Goal: Run one campaign for Jimmy's roofer using partner dashboards + spreadsheets.

### Day 1 — Setup (parallel)
- [ ] Sign up for BatchData, Telnyx, Lob, Blacklist Alliance (get API keys)
- [ ] Provision one toll-free number via Telnyx Mission Control ($2/mo)
- [ ] Submit toll-free verification (business name, use case, sample message, opt-out language) — approval 1-5 business days, but can send while unverified at reduced throughput

### Day 2 — Data Prep
- [ ] Export PropertyFi roof analysis for target zip codes → `pilot_properties.csv` (500 properties, worst roofs first)
- [ ] Columns: `property_id, address, city, state, zip, owner_first, owner_last, mailing_address, roof_score`
- [ ] Upload to BatchData for skip tracing → get phone_mobile, email, income appended
- [ ] Cost: ~$60 for 500 records
- [ ] Export enriched list, split into: has_phone (~350) vs no_phone (~150)

### Day 3 — Compliance + Send
- [ ] Submit phone list to Blacklist Alliance DNC scrub → remove flagged numbers (~$2.50)
- [ ] Clean SMS list: ~300 contacts. DNC-flagged + no-phone contacts: ~200 → mail list
- [ ] Send SMS via Telnyx API (Postman/curl, 50/batch):
  ```
  Hi {owner_first}, this is {roofer_company}. Based on a recent property 
  review, your roof at {short_address} may need attention. Free inspection 
  this month — reply YES or call {roofer_phone}. Reply STOP to opt out.
  ```
- [ ] Send postcards via Lob dashboard (CSV upload) for mail list
- [ ] Set up free RequestBin/Pipedream endpoint to capture Telnyx inbound replies

### Day 4-10 — Track Results
- [ ] Log responses in Google Sheet: property_id, channel, sent_date, response, disposition
- [ ] Dispositions: interested, not_interested, wrong_number, opted_out, no_response
- [ ] Calculate conversion rate at day 7
- [ ] Compare: PFI-targeted vs what Reworked.ai claims (25-35% higher response)

**Phase 1 cost: ~$129 for 500 properties.** Revenue at PFI pricing: ~$400. Margin: ~68%.

---

## Phase 2: One API Endpoint (Days 5-14)

### Tech Stack
- **Supabase** — Postgres + Edge Functions + pg_cron (free tier, no contract)
- Separate project from the static Next.js apps (which are `output: 'export'`)
- Pricing logic mirrors `pricing-calculator/lib/pricing-config.ts` channel tiers

### Database Schema (6 tables, Supabase Postgres)

```sql
-- Roofer clients
CREATE TABLE roofers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT, address_city TEXT, address_state TEXT, address_zip TEXT,
  landing_page_url TEXT,
  telnyx_toll_free_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign runs
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roofer_id UUID NOT NULL REFERENCES roofers(id),
  campaign_name TEXT,
  zip_codes TEXT[] NOT NULL,
  channels TEXT[] NOT NULL,       -- ['sms','mail']
  max_properties INT NOT NULL,
  min_roof_score INT,
  status TEXT NOT NULL DEFAULT 'queued', -- queued/processing/completed/failed
  is_recurring BOOLEAN DEFAULT FALSE,
  -- Aggregates
  properties_found INT, properties_enriched INT, dnc_removed INT,
  sms_sent INT, mail_sent INT,
  -- Cost tracking
  cogs_enrichment NUMERIC(10,4) DEFAULT 0,
  cogs_dnc_scrub NUMERIC(10,4) DEFAULT 0,
  cogs_sms NUMERIC(10,4) DEFAULT 0,
  cogs_mail NUMERIC(10,4) DEFAULT 0,
  cogs_total NUMERIC(10,4) DEFAULT 0,
  revenue_total NUMERIC(10,4) DEFAULT 0,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enriched property owners (dedup key: address+zip)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT,
  address TEXT NOT NULL, city TEXT, state TEXT, zip TEXT NOT NULL,
  owner_first TEXT, owner_last TEXT, mailing_address TEXT,
  phone_mobile TEXT, phone_landline TEXT, email TEXT,
  roof_score INT,
  is_dnc BOOLEAN DEFAULT FALSE,
  is_litigator BOOLEAN DEFAULT FALSE,
  enriched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(address, zip)
);

-- Every SMS or postcard sent
CREATE TABLE sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  channel TEXT NOT NULL,  -- 'sms' or 'mail'
  telnyx_message_id TEXT, sms_status TEXT,
  lob_postcard_id TEXT, mail_status TEXT, expected_delivery DATE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  cost_cogs NUMERIC(8,4), cost_price NUMERIC(8,4)
);

-- Inbound replies
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  send_id UUID REFERENCES sends(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  channel TEXT NOT NULL,
  response_text TEXT,
  disposition TEXT, -- interested/not_interested/opted_out/wrong_number
  responded_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS templates
CREATE TABLE sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoint: `POST /functions/v1/run-campaign`

**Request:**
```json
{
  "zip_codes": ["75001", "75002"],
  "channels": ["sms", "mail"],
  "max_properties": 500,
  "roofer_id": "uuid",
  "min_roof_score": 40,
  "is_recurring": true
}
```

**Orchestration sequence (~300 lines):**
```
1. QUERY    → PropertyFi DB: top N properties by roof_score in zip_codes
              Exclude contacts already sent to in last 30 days
              Join with Precisely owner data
2. ENRICH   → POST BatchData /property/skip-trace (batch 100/call)
              Extract phone_mobile, email, estimated_income → store in contacts
3. DNC SCRUB → POST Blacklist Alliance /lookup
              Flag is_dnc/is_litigator → route: clean=SMS, flagged=mail-only
              ⚠ If DNC service down → HALT (never send SMS without scrub)
4. SEND SMS → POST Telnyx /v2/messages (2-3 msg/sec throttle)
              Use pre-provisioned toll-free number
              Store telnyx_message_id per send
5. SEND MAIL → POST Lob /v1/postcards (batch up to 100)
              Use pre-created template with merge vars
              Store lob_postcard_id per send
6. RECORD   → Update campaign aggregates + cost breakdown
7. SCHEDULE → If recurring: set next_run_at = NOW() + 7 days
```

### Webhook Handlers (2 lightweight functions)

**`POST /functions/v1/telnyx-webhook`** (~80 lines)
- Receives: message.sent, message.delivered, message.failed, message.received
- On inbound reply: parse text → "YES"=interested, "STOP"=opted_out → insert response, alert roofer

**`POST /functions/v1/lob-webhook`** (~40 lines)
- Receives: postcard.in_transit, postcard.delivered, postcard.returned
- Update sends table with status + delivered_at

### Scheduling (pg_cron)
```sql
-- Every Monday 9 AM ET: check for recurring campaigns
SELECT cron.schedule('process-recurring', '0 9 * * 1',
  $$SELECT net.http_post(...)$$
);
```
Dedup: exclude contacts sent to within 30 days or disposition = opted_out/not_interested.

### SMS Templates
```
INITIAL:
"Hi {{owner_first}}, this is {{roofer_company}}. Based on a recent property 
review, your roof at {{short_address}} may need attention. Free inspection 
this month — reply YES or call {{roofer_phone}}. Reply STOP to opt out."

FOLLOW_UP (7 days, non-responders):
"Hi {{owner_first}}, following up on a free roof inspection for 
{{short_address}}. Storm season is approaching — catching issues early 
saves thousands. Reply YES or call {{roofer_phone}}. STOP to opt out."
```

### Error Handling
- All partner calls: retry on 429/5xx with exponential backoff (1s, 2s, 4s), max 3 retries
- DNC scrub failure: **hard stop** (compliance risk — never send SMS without scrub)
- Individual send failures: mark as failed, continue batch
- Campaign states: queued → processing → completed | partial_failure | failed

### Cost Tracking
Every campaign records COGS breakdown in the campaigns table. Revenue uses PFI_CHANNELS tiers from pricing-config.ts. Simple margin query:
```sql
SELECT campaign_name, revenue_total, cogs_total,
       (revenue_total - cogs_total) / revenue_total * 100 AS margin_pct
FROM campaigns ORDER BY created_at DESC;
```

---

## Phase 3: Self-Service (Future, Not Built Now)

- Territory selector UI (Mapbox polygon draw or zip code entry)
- Campaign dashboard (read from Supabase tables)
- Roofer onboarding (Stripe checkout + Telnyx 10DLC brand registration per client)
- Per-roofer branded local numbers (10DLC upgrade from toll-free)
- Response tracking with real-time roofer notifications
- A/B testing framework for message templates

---

## Implementation Timeline

| Task | Time | Dependency |
|------|------|-----------|
| Sign up for all partner accounts + API keys | Day 1 | None |
| Provision Telnyx toll-free + submit verification | Day 1 | None |
| Run Phase 1 manual pilot (500 properties) | Days 2-4 | Telnyx verification |
| Create Supabase project + run schema migration | Day 5 | None |
| Build `run-campaign` function | Days 5-7 | Schema + API keys |
| Build Telnyx + Lob webhook handlers | Day 7 | run-campaign |
| Create Lob postcard templates (2 variants) | Day 6 | Lob account |
| Set up pg_cron for recurring campaigns | Day 8 | run-campaign |
| Test end-to-end with 50 properties | Day 8 | All above |
| First automated campaign (500 properties) | Day 9 | E2E test |

**Pilot running end of week 1. Automated system end of week 2.**

---

## Key Risks

| Risk | Mitigation |
|------|-----------|
| Toll-free verification delayed | Submit Day 1; mail-only fallback ready |
| BatchData phone hit rate < 50% | Mail fills the gap for phoneless contacts |
| DNC scrub removes > 30% | Expected; mail channel absorbs volume |
| Spam complaints suspend toll-free | Target only bad roofs, always include STOP, keep complaint < 1% |
| Supabase function timeout (60s) | Process in batches of 100; background job for 500+ |

---

## Partner API Reference

| Partner | Base URL | Auth | Key Endpoint |
|---------|---------|------|-------------|
| BatchData | `api.batchdata.com/api/v1` | Bearer token | `POST /property/skip-trace` |
| Telnyx | `api.telnyx.com/v2` | Bearer token | `POST /messages`, `POST /number_orders` |
| Lob | `api.lob.com/v1` | Basic auth | `POST /postcards`, `POST /templates` |
| Blacklist Alliance | `api.blacklistalliance.com/standard/api/v1` | API key in body | `POST /lookup` |

---

## Files to Create (Phase 2)

New Supabase project (separate from existing Next.js apps):
```
propertyfi-campaigns/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    -- 6 tables above
├── supabase/functions/
│   ├── run-campaign/index.ts         -- ~300 lines, main orchestration
│   ├── telnyx-webhook/index.ts       -- ~80 lines, SMS events
│   └── lob-webhook/index.ts          -- ~40 lines, mail events
├── lib/
│   └── pricing.ts                    -- Mirror of pricing-config.ts channel tiers
└── README.md
```

**Existing files referenced:**
- `pricing-calculator/lib/pricing-config.ts` — PFI_CHANNELS tiers for revenue calculation
- `pricing-calculator/lib/pricing-utils.ts` — getPfiVolumeTier for volume discount logic

## Verification

1. **Phase 1**: Manually send 10 test SMS via Telnyx API → verify delivery + inbound reply capture
2. **Phase 1**: Send 5 test postcards via Lob → verify delivery tracking
3. **Phase 2**: Run `POST /functions/v1/run-campaign` with 50 properties in test mode → verify full pipeline
4. **Phase 2**: Trigger Telnyx webhook with test payload → verify response recorded in DB
5. **Phase 2**: Trigger Lob webhook with test payload → verify delivery status updated
6. **Phase 2**: Run recurring campaign cron → verify dedup excludes previously contacted
