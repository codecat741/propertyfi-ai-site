import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  badge: {
    text: string;
    variant: "blue" | "cyan" | "yellow";
  };
  title: string;
  description: string;
  learnMoreText: string;
}

export function FeatureCard({ badge, title, description, learnMoreText }: FeatureCardProps) {
  return (
    <Card className="p-8 hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <Badge className={`feature-badge-${badge.variant}`}>{badge.text}</Badge>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button variant="link" className="p-0 h-auto font-semibold">
        {learnMoreText} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}