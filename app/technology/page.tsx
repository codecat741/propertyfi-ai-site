"use client";

import { motion } from "framer-motion";
import { LineChart, Cpu, Zap, Building2, Activity, Gauge, Target, Users, Wrench } from "lucide-react";
import { QuoteSection } from "@/components/quote-section";
import { CTASection } from "@/components/cta-section";
import Image from "next/image";

export default function TechnologyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Previous sections remain unchanged */}
      
      <QuoteSection 
        quote="Our technology turns property data into actionable opportunities, helping service providers grow their business without the technical overhead."
        author="Cory Decker"
        role="Co-founder & Chief Executive Officer"
      />

      <CTASection 
        title="Ready to Grow Your Service Business?"
        buttonText="Get Started"
        buttonHref="/contact"
      />
    </main>
  );
}