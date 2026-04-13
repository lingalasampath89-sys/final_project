import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, LifeBuoy, FileQuestion } from "lucide-react";

const faqs = [
  { q: "How does the XML Inference Engine handle massive files (10GB+)?", a: "SmartAI chunks the file using a streaming SAX parser. Inference is distributed across nodes, merging resulting schema models continuously." },
  { q: "Can I self-host the Neural Node?", a: "Yes, Enterprise customers receive a Dockerized version of our proprietary model weights to process sensitive schemas securely locally." },
  { q: "What happens if inference fails?", a: "If confidence scores drop below 80%, the engine triggers a human-in-the-loop review queue within your Workspace dashboard." },
  { q: "Are API credentials rate-limited?", a: "Free nodes operate at 10 requests/minute. Pro nodes are uncapped with priority queueing." },
];

const Support = () => {
  return (
    <div className="container py-16 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
          <LifeBuoy className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Support & Help Center</h1>
        <p className="text-muted-foreground text-lg">
          Experiencing anomalies in schema inference or node connectivity? Our engineering team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 border border-border rounded-2xl bg-card text-center hover:border-primary/50 transition-colors">
          <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2">Live Technical Chat</h3>
          <p className="text-muted-foreground text-sm mb-6">Connect with a support engineer directly from the platform.</p>
          <Button className="w-full">Start Chat</Button>
        </div>
        <div className="p-8 border border-border rounded-2xl bg-card text-center hover:border-primary/50 transition-colors">
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2">Email Support</h3>
          <p className="text-muted-foreground text-sm mb-6">Send us a detailed report. Typical response time is under 2 hours.</p>
          <Button variant="outline" className="w-full">support@smartai.example</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FileQuestion className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 border border-border rounded-xl bg-card/30">
              <h4 className="font-bold text-lg mb-2 text-foreground">{faq.q}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
