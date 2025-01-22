interface QuoteSectionProps {
  quote: string;
  author: string;
  role: string;
}

export function QuoteSection({ quote, author, role }: QuoteSectionProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl font-medium text-gray-900 mb-8">
            "{quote}"
          </blockquote>
          <div className="text-gray-600">
            <span className="font-semibold">— {author}</span>
            <span className="mx-2">·</span>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </section>
  );
}