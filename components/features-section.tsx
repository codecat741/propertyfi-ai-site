import { FeatureCard } from "@/components/feature-card";

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            badge={{ text: "Smart Detection", variant: "blue" }}
            title="AI-Powered Analysis"
            description="Instantly analyze roofs, turf, and restoration targets with precision. Our ML algorithms deliver accurate measurements, damage assessments, and property insights in one unified dashboard."
            learnMoreText="Explore detection capabilities"
          />
          
          <FeatureCard
            badge={{ text: "Lead Generation", variant: "cyan" }}
            title="Targeted Opportunities"
            description="Generate high-quality leads with one click. Filter by property type, damage severity, or disaster zones to identify prime prospects and scale your outreach effectively."
            learnMoreText="Discover lead features"
          />
          
          <FeatureCard
            badge={{ text: "Real-Time Intel", variant: "yellow" }}
            title="Live Monitoring"
            description="Stay ahead with instant alerts for severe weather events and property changes. Access premium imagery from Nearmap and Vexcel to make data-driven decisions faster."
            learnMoreText="See monitoring tools"
          />
        </div>
      </div>
    </section>
  );
}