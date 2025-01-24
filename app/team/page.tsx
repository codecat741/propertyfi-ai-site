"use client";

import { QuoteSection } from "@/components/quote-section";
import { CTASection } from "@/components/cta-section";
import { Users, Target, LineChart, Brain } from "lucide-react";
import Image from "next/image";

export default function TeamPage() {
  const leaders = [
    {
      name: "Cory Decker",
      role: "Co-founder & CEO",
      description: "A visionary leader driving innovation with 15+ years building scalable software solutions and pioneering AI applications.",
      image: "/images/team/cory-decker.jpeg"
    },
    {
      name: "Brian Decker",
      role: "Co-founder & Chief Growth Officer",
      description: "A strategic growth leader with 20+ years driving revenue across finance and real estate sectors, specializing in transformative sales leadership.",
      image: "/images/team/brian-decker.webp"
    },
    {
      name: "Scott Couto",
      role: "Co-founder & Marketing Consultant",
      description: "Growth leader with deep expertise in direct marketing and sales strategy with 20+ years in lead generation.",
      image: "/images/team/scott-couto.jpeg"
    }
  ];

  const advisors = [
    {
      name: "Drew Logan",
      role: "Strategy Consultant",
      description: "Entrepreneur and strategist dedicated to accelerating business success.",
      image: "/images/team/drew-logan.webp"
    }
  ];

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
              <pattern
                id="blueprint"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 50 L 100 50 M 50 0 L 50 100"
                  className="stroke-[#00FFD1]/20"
                  strokeWidth="0.5"
                  fill="none"
                />
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
              Leaders in Property Intelligence Innovation
            </h1>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Meet the visionary team behind PropertyFi.ai. Our combined expertise in AI, technology, and property services fuels solutions that deliver real-world impact.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-16 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {leaders.map((leader) => (
                <div key={leader.name} className="group">
                  <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#151849] mb-2">{leader.name}</h3>
                    <p className="text-lg font-medium text-[#151849]/80 mb-4">{leader.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{leader.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-[#00FFD1]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Innovation First</h3>
                <p className="text-gray-600">
                  Pushing boundaries to create cutting-edge solutions that transform industries.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#00A3FF]/20 flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-[#00A3FF]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Expert Knowledge</h3>
                <p className="text-gray-600">
                  Deep industry expertise combined with advanced technological capabilities.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-6">
                  <LineChart className="h-8 w-8 text-[#FF00E5]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Proven Results</h3>
                <p className="text-gray-600">
                  Delivering measurable impact and driving growth for our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-16 text-center">Strategic Advisors</h2>
            <div className="grid md:grid-cols-1 gap-12 max-w-xs mx-auto">
              {advisors.map((advisor) => (
                <div key={advisor.name} className="group">
                  <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={advisor.image}
                      alt={advisor.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#151849] mb-2">{advisor.name}</h3>
                    <p className="text-lg font-medium text-[#151849]/80 mb-4">{advisor.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{advisor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteSection
        quote="We are a team of innovators committed to driving industry change through AI-powered insights."
        author="Cory Decker"
        role="Co-founder & Chief Executive Officer"
      />

      <CTASection
        title="Join Us in Shaping the Future"
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </main>
  );
}