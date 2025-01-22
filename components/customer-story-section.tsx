"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CustomerStorySection() {
  const benefits = [
    "Increase in developer productivity",
    "Increase in site reliability",
    "Quality on par with extremely high standards"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="grid md:grid-cols-2 gap-8 p-0 overflow-hidden">
          {/* Left side - Dark blue section */}
          <div className="bg-[#151849] p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-12">
              <span className="text-white font-bold text-xl">PropertyFi</span>
              <span className="text-[#00FFD1] text-2xl">/</span>
              <span className="text-white font-bold text-xl">MAMMUT®</span>
            </div>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-[#00FFD1]" />
                  </div>
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <Badge 
              variant="secondary" 
              className="mb-6 w-fit bg-blue-50 text-blue-700 hover:bg-blue-50"
            >
              Customer Story
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Mammut means quality - in brand and in technology
            </h3>
            <p className="text-gray-600 mb-8">
              Mammut came to PropertyFi because they needed a performant, interoperable
              Composable Web Platform that could deliver a best-in-class digital brand
              experience for their customers. They needed a partner that could keep their
              site reliable and performant during peak retail season and unexpected traffic
              spikes.
            </p>
            <Button variant="link" className="w-fit p-0 h-auto text-blue-600 hover:text-blue-700">
              View the story <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Ready to try section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to try PropertyFi?
          </h2>
          <Button 
            size="lg"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-8"
          >
            Request demo
          </Button>
        </div>
      </div>
    </section>
  );
}