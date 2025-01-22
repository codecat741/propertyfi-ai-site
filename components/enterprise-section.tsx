export function EnterpriseSection() {
  const enterprises = ['CBRE', 'Zillow', 'Redfin', 'Century 21', 'RE/MAX'];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Enterprises run on PropertyFi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center justify-items-center opacity-60">
          {enterprises.map((logo) => (
            <div key={logo} className="h-8">
              <span className="text-xl font-bold">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}