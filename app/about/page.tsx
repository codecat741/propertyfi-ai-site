"use client";

import { QuoteSection } from "@/components/quote-section";
import { CTASection } from "@/components/cta-section";
import { Building2, Target, Lightbulb, Activity, LineChart, Cpu, Users2, Gauge, Shield } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Canvas */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#151849]" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Blueprint Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="blueprint" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 0 50 L 100 50 M 50 0 L 50 100" className="stroke-[#00FFD1]/20" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint)" />
          </svg>

          {/* Animated Connection Lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-[#00FFD1]/30 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border border-[#00FFD1]/30 rounded-full animate-pulse [animation-delay:1s]" />
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-[#00FFD1]/30 rounded-full animate-pulse [animation-delay:2s]" />
          </div>
        </div>

        {/* Content section */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
              Transforming Property Services Through AI Innovation
            </h1>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              From turnkey lead generation to custom enterprise solutions, we're revolutionizing how property service providers leverage AI for growth and efficiency.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-[#00FFD1]" />
                </div>
                <h3 className="text-white font-semibold mb-2">Lead Generation</h3>
                <p className="text-white/70">Ready-to-use qualified leads delivered directly to your inbox</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mx-auto mb-4">
                  <Cpu className="h-8 w-8 text-[#FF00E5]" />
                </div>
                <h3 className="text-white font-semibold mb-2">Custom AI Solutions</h3>
                <p className="text-white/70">Tailored AI integration for enterprise-scale operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-64 mb-12 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80"
                alt="Residential property analysis"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
              {/* AI Analysis Overlay */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#00FFD1] rounded-lg animate-pulse">
                  <div className="absolute -top-6 left-2 bg-[#00FFD1] text-[#151849] px-2 py-1 text-sm rounded">
                    3-Tab Shingle
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-[#FF00E5] rounded-lg animate-pulse [animation-delay:1s]">
                  <div className="absolute -top-6 left-2 bg-[#FF00E5] text-white px-2 py-1 text-sm rounded">
                    Hail Damage
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-16">
              PropertyFi was founded with a vision to revolutionize the property services industry through advanced AI technology. By combining cutting-edge machine learning with comprehensive property data analysis, we've created a platform that not only delivers highly qualified leads but also provides custom AI solutions that help businesses identify opportunities and grow more efficiently than ever before.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Vision */}
              <div className="relative">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                    alt="Aerial property analysis"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-16 h-16 text-[#00FFD1] animate-pulse" />
                  </div>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To revolutionize how property service providers leverage AI technology for business growth, whether through our turnkey lead generation or custom enterprise solutions.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="relative">
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?auto=format&fit=crop&q=80"
                    alt="Property analysis dashboard"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="w-16 h-16 text-[#00FFD1] animate-pulse" />
                  </div>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To empower property service providers with AI-driven insights and solutions that increase win rates, reduce costs, and accelerate business growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PropertyFi Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why PropertyFi?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-6">
                <Activity className="h-8 w-8 text-[#00FFD1]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Industry-Specific AI</h3>
              <p className="text-gray-600">Purpose-built for roofing, restoration, and property services.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#00A3FF]/20 flex items-center justify-center mb-6">
                <LineChart className="h-8 w-8 text-[#00A3FF]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Proven Results</h3>
              <p className="text-gray-600">86% accuracy in identifying qualified opportunities.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-[#FF00E5]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Advanced Technology</h3>
              <p className="text-gray-600">State-of-the-art AI and machine learning for precise analysis.</p>
            </div>
          </div>
        </div>
      </section>

      <QuoteSection 
        quote="Our AI technology is transforming how businesses identify and capture opportunities in the property services market."
        author="Brian Decker"
        role="Co-founder & Chief Growth Officer"
      />

      <CTASection 
        title="Ready to Transform Your Business?"
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </main>
  );
}