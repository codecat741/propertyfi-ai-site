import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTASectionProps {
  title: string;
  buttonText: string;
  buttonHref: string;
}

export function CTASection({ title, buttonText, buttonHref }: CTASectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">{title}</h2>
        <Link href={buttonHref}>
          <Button 
            size="lg"
            className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-[#151849] font-semibold px-8"
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
}