"use client";

import { Building2, LineChart, Scan, Target, Wrench, Shield, Cpu, Zap } from "lucide-react";
import Image from "next/image";

export function ValuePropositionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Real World Application Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/tech/property-analysis.jpg"
                alt="AI analyzing property"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#151849]/60 to-transparent" />
              {/* AI Analysis Overlay */}
              <div className="absolute inset-0 p-6">
                <div className="border-2 border-[#00FFD1] rounded-lg w-32 h-32 absolute top-1/4 left-1/4 animate-pulse">
                  <div className="absolute -top-6 left-2 bg-[#00FFD1] text-[#151849] px-2 py-1 text-sm rounded">
                    Roof Age: 15yr
                  </div>
                </div>
                <div className="border-2 border-[#FF00E5] rounded-lg w-24 h-24 absolute bottom-1/3 right-1/4 animate-pulse [animation-delay:1s]">
                  <div className="absolute -top-6 left-2 bg-[#FF00E5] text-white px-2 py-1 text-sm rounded">
                    Storm Damage
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Real-Time Property Analysis</h2>
              <p className="text-gray-600 mb-8">
                Our AI combines high-resolution aerial and ground imagery with insurance provider data to deliver actionable insights for property service providers.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Target className="h-6 w-6 text-[#00FFD1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Roofing Contractors</h3>
                    <p className="text-gray-600">Identify aging roofs and storm damage with 86% accuracy</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#00A3FF]/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Wrench className="h-6 w-6 text-[#00A3FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Remodeling & Restoration</h3>
                    <p className="text-gray-600">Target properties needing renovation or restoration work</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-[#FF00E5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Government Services</h3>
                    <p className="text-gray-600">Support emergency response and infrastructure planning</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#FFD100]/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Building2 className="h-6 w-6 text-[#FFD100]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Property Services</h3>
                    <p className="text-gray-600">Identify maintenance and improvement opportunities</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Partnership Logos */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Powered By
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-gray-400 font-semibold">Nearmap</div>
            <div className="text-gray-400 font-semibold">Vexcel</div>
            <div className="text-gray-400 font-semibold">CoreLogic</div>
            <div className="text-gray-400 font-semibold">Verisk</div>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Two Ways to Leverage Our Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Both solutions require zero technical setup—start getting insights immediately.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Lead Generation Service */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-[#00FFD1]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lead Generation Service</h3>
              <p className="text-gray-600 mb-8">
                Ready-to-use lead generation service that delivers qualified prospects directly to your inbox.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                  <span>Pre-qualified leads</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                  <span>48-hour delivery</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#00FFD1] mr-2" />
                  <span>Start receiving leads today</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-[#00FFD1]">47%</div>
                  <p className="text-sm text-gray-600">Higher Close Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00FFD1]">3.2x</div>
                  <p className="text-sm text-gray-600">ROI Improvement</p>
                </div>
              </div>
            </div>

            {/* Custom AI Solutions */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-6">
                <Cpu className="h-8 w-8 text-[#FF00E5]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Custom AI Solutions</h3>
              <p className="text-gray-600 mb-8">
                Enterprise-grade AI solutions that work with your existing systems—no development team needed.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                  <span>Seamless integration</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                  <span>Dedicated AI models</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-[#FF00E5] mr-2" />
                  <span>Zero technical overhead</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-[#FF00E5]">86%</div>
                  <p className="text-sm text-gray-600">AI Accuracy</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FF00E5]">2.4M+</div>
                  <p className="text-sm text-gray-600">Properties Analyzed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}