import { HeroSection } from "@/components/hero-section";
import { ValuePropositionSection } from "@/components/value-proposition-section";
import { CTASection } from "@/components/cta-section";
import { QuoteSection } from "@/components/quote-section";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <ValuePropositionSection />
      <QuoteSection 
        quote="We're transforming how property service providers find and win new business. Our AI doesn't just analyze data—it delivers qualified leads that convert."
        author="Cory Decker"
        role="Co-founder & Chief Executive Officer"
      />
      <CTASection 
        title="Ready to Transform Your Lead Generation?"
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </main>
  );
}