export function StatsSection() {
  const stats = [
    { value: "35M+", label: "Properties analyzed" },
    { value: "5M+", label: "Real estate agents" },
    { value: "99.99%", label: "Uptime SLA" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}