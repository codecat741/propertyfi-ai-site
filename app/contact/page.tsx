"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuoteSection } from "@/components/quote-section";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Users } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    otherIndustry: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the email content
      const emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Industry: ${formData.industry === 'other' ? formData.otherIndustry : formData.industry}
Message:
${formData.message}
      `.trim();

      // Open the user's email client with pre-filled content
      const mailtoLink = `mailto:sales@propertyfi.ai?subject=New Contact Form Submission&body=${encodeURIComponent(emailContent)}`;
      window.location.href = mailtoLink;

      toast({
        title: "Email client opened",
        description: "Please send the email to complete your submission.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        industry: "",
        otherIndustry: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem opening your email client. Please try again or email us directly at sales@propertyfi.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
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
              Let's Build Something Amazing Together
            </h1>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Ready to unlock new opportunities with AI-driven insights? Let's collaborate and transform your business.
            </p>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00FFD1]/20 flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-[#00FFD1]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Sales Inquiries</h3>
                  <a href="mailto:sales@propertyfi.ai" className="text-white/80 hover:text-[#00FFD1] transition-colors">
                    sales@propertyfi.ai
                  </a>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00A3FF]/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-[#00A3FF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Support</h3>
                  <a href="mailto:support@propertyfi.ai" className="text-white/80 hover:text-[#00A3FF] transition-colors">
                    support@propertyfi.ai
                  </a>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FF00E5]/20 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-[#FF00E5]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Want to Work With Us?</h3>
                  <a href="mailto:join@propertyfi.ai" className="text-white/80 hover:text-[#FF00E5] transition-colors">
                    join@propertyfi.ai
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value, otherIndustry: value !== "other" ? "" : formData.otherIndustry })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roofing">Roofing</SelectItem>
                        <SelectItem value="restoration">Restoration</SelectItem>
                        <SelectItem value="artificial-turf">Artificial Turf</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.industry === "other" && (
                    <div>
                      <Label htmlFor="otherIndustry">Please specify your industry</Label>
                      <Input
                        id="otherIndustry"
                        value={formData.otherIndustry}
                        onChange={(e) => setFormData({ ...formData, otherIndustry: e.target.value })}
                        required
                        className="mt-1"
                        placeholder="Enter your industry"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[150px] mt-1"
                    placeholder="Tell us about your business and how PropertyFi can help streamline your operations, generate leads, or solve other property-related challenges"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-[#151849] font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Opening Email Client..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <QuoteSection 
        quote="Revolutionizing property technology starts with listening. Open communication with our partners and clients drives smarter, more effective solutions."
        author="Drew Logan"
        role="Strategy Advisor"
      />
    </main>
  );
}