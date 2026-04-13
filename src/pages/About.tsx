import { Code2, Zap, Shield, Users, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-16 animate-fade-in relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 text-muted-foreground hover:text-emerald-400 gap-1 font-bold"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About SmartAI</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          SmartAI is a powerful XML inference and analysis platform designed for developers and data engineers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          { icon: Code2, title: "Built for Developers", desc: "VS Code-like syntax highlighting, keyboard shortcuts, and a clean workspace interface." },
          { icon: Zap, title: "Instant Processing", desc: "Real-time XML parsing and inference with no server round-trips for core features." },
          { icon: Shield, title: "Secure & Private", desc: "Your XML data stays in your browser. We only store metadata when you're signed in." },
          { icon: Users, title: "Open & Extensible", desc: "Support for XSD, hierarchy, validation, reports, and more output formats." },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="pt-6 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default About;
