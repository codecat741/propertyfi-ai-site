"use client";

import { Building2, LineChart, Scan, Target, Wrench, Shield } from "lucide-react";
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
                Our AI combines high-resolution aerial and ground imagery with insurance provider data to identify high-probability leads for property service providers.
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

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-[#00FFD1] mb-4">47%</div>
              <h3 className="text-xl font-bold mb-2">Higher Close Rate</h3>
              <p className="text-gray-600">
                Our AI-qualified leads convert at nearly double the industry average
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-[#00A3FF] mb-4">3.2x</div>
              <h3 className="text-xl font-bold mb-2">ROI Improvement</h3>
              <p className="text-gray-600">
                Average return on marketing spend with AI-driven targeting
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-[#FF00E5] mb-4">86%</div>
              <h3 className="text-xl font-bold mb-2">Accuracy Rate</h3>
              <p className="text-gray-600">
                In identifying property opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}