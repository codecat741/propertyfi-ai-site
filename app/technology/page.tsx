"use client";

import { motion } from "framer-motion";
import { LineChart, Cpu, Zap, Building2, Activity, Gauge, Target, Users, Wrench } from "lucide-react";
import { QuoteSection } from "@/components/quote-section";
import { CTASection } from "@/components/cta-section";
import Image from "next/image";

export default function TechnologyPage() {
  return (
    <main className="flex flex-col min-h-screen">
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
              Advanced AI Technology for Every Business
            </h1>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Whether you're a small contractor or a large corporation, our AI solutions scale to your needs—from turnkey lead generation to custom integrations.
            </p>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-[#00FFD1]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Lead Generation Service</h3>
                  <p className="text-white/80">Perfect for businesses of any size—get qualified leads delivered directly to your inbox.</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-4">
                    <Cpu className="h-8 w-8 text-[#FF00E5]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Custom AI Solutions</h3>
                  <p className="text-white/80">Tailored AI integration that scales with your business needs—from small teams to large operations.</p>
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
              Core Technology Features
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Computer Vision */}
              <div className="space-y-6">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/tech/modern-roof-analysis.jpeg"
                    alt="AI vision analysis"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-[#00FFD1] rounded-lg opacity-50 animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-[#00FFD1] rounded-lg opacity-50 animate-pulse [animation-delay:1s]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Advanced Computer Vision</h3>
                <p className="text-gray-600">
                  Our AI processes high-resolution imagery to detect property features, conditions, and opportunities with exceptional accuracy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Multi-angle analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Feature detection</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Damage assessment</span>
                  </li>
                </ul>
              </div>

              {/* Machine Learning */}
              <div className="space-y-6">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/tech/property-analysis.jpg"
                    alt="Machine learning visualization"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LineChart className="h-24 w-24 text-[#00FFD1] animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Predictive Analytics</h3>
                <p className="text-gray-600">
                  Machine learning models analyze multiple data sources to predict property service needs and opportunities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Pattern recognition</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Risk assessment</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Opportunity scoring</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Options */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Choose Your Implementation
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-[#00FFD1]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lead Generation Service</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Pre-qualified leads delivered to your inbox</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>48-hour turnaround time</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>No technical setup needed</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                    <span>Detailed property reports included</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600">
                  Perfect for businesses of all sizes looking for qualified leads without any technical overhead.
                </p>
              </div>
              
              <div className="p-8 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-6">
                  <Cpu className="h-8 w-8 text-[#FF00E5]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Custom AI Solutions</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                    <span>Flexible API integration options</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                    <span>Tailored to your workflow</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                    <span>Real-time analysis capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                    <span>Dedicated support team</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600">
                  Scalable solutions that grow with your business—from small teams to large operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteSection 
        quote="Our technology adapts to businesses of all sizes, delivering powerful AI capabilities without the technical complexity."
        author="Cory Decker"
        role="CEO"
      />

      <CTASection 
        title="Ready to Transform Your Business?"
        buttonText="Get Started"
        buttonHref="/contact"
      />
    </main>
  );
}