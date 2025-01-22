"use client";

import { motion } from "framer-motion";
import { LineChart, Cpu, Zap, Building2, Activity, Gauge, Target, Users, Wrench } from "lucide-react";
import { QuoteSection } from "@/components/quote-section";
import { CTASection } from "@/components/cta-section";
import Image from "next/image";

export default function TechnologyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section remains the same */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Canvas */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#151849]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Animated Connection Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-70">
            <line x1="25%" y1="25%" x2="50%" y2="33%" className="stroke-[#00FFD1]/20" strokeWidth="1">
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="33%" x2="66%" y2="50%" className="stroke-[#00FFD1]/20" strokeWidth="1">
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="4s" begin="1s" repeatCount="indefinite" />
            </line>
            <line x1="66%" y1="50%" x2="50%" y2="66%" className="stroke-[#00FFD1]/20" strokeWidth="1">
              <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="4s" begin="2s" repeatCount="indefinite" />
            </line>
          </svg>

          {/* Tech Icons */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#00FFD1]" />
            </div>
            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Gauge className="w-6 h-6 text-[#00FFD1]" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#00FFD1]" />
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
              Purpose-Built for Property Services
            </h1>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Transform your property service business with AI-powered lead generation and insights—no technical expertise required.
            </p>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-[#00FFD1]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Ready-to-Use Leads</h3>
                  <p className="text-white/80">Identify and target ideal properties with detailed insights.</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00A3FF]/20 flex items-center justify-center mb-4">
                    <Wrench className="h-8 w-8 text-[#00A3FF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Zero Tech Setup</h3>
                  <p className="text-white/80">Immediate implementation with no development team needed.</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-[#FF00E5]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Industry Expertise</h3>
                  <p className="text-white/80">Purpose-built solutions with deep domain knowledge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Tech Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Key Tech Features
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Ready-to-Use Lead Generation */}
              <div className="space-y-6">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="images/tech/modern-roof-analysis.jpeg"
                    alt="Lead generation visualization"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-[#00FFD1] rounded-lg opacity-50 animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-[#00FFD1] rounded-lg opacity-50 animate-pulse [animation-delay:1s]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Ready-to-Use Lead Generation</h3>
                <p className="text-gray-600">
                  Instantly identify and target ideal properties with detailed insights to grow your customer base.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Identify service opportunities</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Target ideal properties</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Get detailed property insights</span>
                  </li>
                </ul>
              </div>

              {/* Zero Technical Requirements */}
              <div className="space-y-6">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                    alt="Simple implementation visualization"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LineChart className="h-24 w-24 text-[#00FFD1] animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Zero Technical Requirements</h3>
                <p className="text-gray-600">
                  Get started immediately with no development team or API integration needed.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>No development team needed</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Immediate implementation</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Automated delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Built for Property Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <Building2 className="h-12 w-12 text-[#00FFD1] mb-4" />
                <h3 className="text-xl font-bold mb-4">Purpose-Built Solutions</h3>
                <p className="text-gray-600">
                  Specifically designed for property service professionals and contractors.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <Cpu className="h-12 w-12 text-[#00FFD1] mb-4" />
                <h3 className="text-xl font-bold mb-4">Deep Domain Knowledge</h3>
                <p className="text-gray-600">
                  Built with extensive industry expertise and understanding.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <LineChart className="h-12 w-12 text-[#00FFD1] mb-4" />
                <h3 className="text-xl font-bold mb-4">Industry-Specific Targeting</h3>
                <p className="text-gray-600">
                  Tailored lead generation for your specific service area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteSection 
        quote="Our technology turns property data into actionable opportunities, helping service providers grow their business without the technical overhead."
        author="Cory Decker"
        role="Chief Technology Officer"
      />

      <CTASection 
        title="Ready to Grow Your Service Business?"
        buttonText="Get Started"
        buttonHref="/contact"
      />
    </main>
  );
}