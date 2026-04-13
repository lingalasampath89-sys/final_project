import React from "react";
import { Wrench, FileJson, BrainCircuit, LayoutTemplate, Network, History, ShieldAlert, RefreshCw, CloudCog, Building2 } from "lucide-react";

const services = [
  {
    icon: <Network className="w-10 h-10 text-indigo-400" />,
    title: "Semantic Similarity & Embedding Layer",
    subtitle: "(Intelligent Tag Mapping)",
    description: "Go beyond literal matches. Our NLP layer understands that 'name', 'full_name', and 'custName' mean the same thing, making XML schema inference incredibly intelligent and context-aware.",
  },
  {
    icon: <History className="w-10 h-10 text-orange-400" />,
    title: "Schema Evolution & Versioning",
    subtitle: "(Backward Compatibility Handling)",
    description: "Real-world XML structures change constantly (v1 → v2 → v3). Our system handles schema evolution natively, ensuring new payload formats never break your old parsers.",
  },
  {
    icon: <ShieldAlert className="w-10 h-10 text-red-400" />,
    title: "Confidence Scoring & Validation",
    subtitle: "(AI Fallback Security)",
    description: "ML predictions aren't always 100%. Our platform calculates strict confidence scores. If the ML certainty is low, the system intelligently defaults to safe fallback rules to prevent corruptions.",
  },
  {
    icon: <Wrench className="w-10 h-10 text-blue-400" />,
    title: "Multi-Class Error Repair Engine",
    subtitle: "(Categorized Resolution)",
    description: "We don't just blindly repair. The engine deeply Classifies the error first (Syntax Error vs Structure Error vs Missing Data) and applies the exact required heuristic correction strategy.",
  },
  {
    icon: <RefreshCw className="w-10 h-10 text-emerald-400" />,
    title: "Active Feedback Learning Loop",
    subtitle: "(Continuous ML Improvement)",
    description: "One-time training isn't enough. Our engine incorporates a continuous learning loop. As new XML formats arrive, the system dynamically updates its weights to improve parsing accuracy over time.",
  },
  {
    icon: <BrainCircuit className="w-10 h-10 text-purple-400" />,
    title: "Smart Data-Gap Predictor",
    subtitle: "(Enrichment Service)",
    description: "Keep supply chains and data pipelines flowing. Our Machine Learning engine intelligently predicts and fills missing hierarchy data fields to prevent downstream transaction failures.",
  }
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-24 pb-32 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-16 max-w-4xl mx-auto mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
          Enterprise XML Intelligence APIs
        </h1>
        <p className="text-lg text-muted-foreground">
          Empower your websites and pipelines with our state-of-the-art Neural XML Intelligence Lab. 
          We solve the most complex data evolution, validation, and parsing problems at scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div 
            key={index}
            className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 group"
          >
            <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-1 text-foreground leading-tight">{service.title}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">{service.subtitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Business Models Section */}
      <div className="mt-32 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block p-1 px-4 mb-4 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-bold uppercase tracking-widest">
            B2B Monetization Framework
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
            Enterprise Engagement Models
          </h2>
          <p className="text-muted-foreground w-full max-w-2xl mx-auto">
            Whether you process thousands of API calls per second or need an isolated offline air-gapped system, we have a strategic monetization model designed for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-500/20 p-8 rounded-[32px] relative overflow-hidden group">
            <CloudCog className="absolute top-0 right-0 h-32 w-32 -mt-4 text-indigo-500/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black text-white mb-2 relative z-10 italic">API-as-a-Service</h3>
            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-6">Pay-Per-Call Ecosystem</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">Designed for dynamic cloud applications. Route broken legacy XML files to our secure cloud endpoint and receive instantly repaired, JSON-ready structured data back.</p>
            <p className="font-mono text-[10px] uppercase font-bold text-indigo-300/70 border-t border-indigo-500/20 pt-4 mt-auto">Billed via flat rate per 10k execution cycles.</p>
          </div>

          <div className="bg-gradient-to-b from-emerald-950/40 to-black/40 border border-emerald-500/20 p-8 rounded-[32px] relative overflow-hidden group">
            <Network className="absolute top-0 right-0 h-32 w-32 -mt-4 text-emerald-500/5 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black text-white mb-2 relative z-10 italic">Translation Middleware</h3>
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-6">Monthly Subscription</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">Perfect for B2B data routing. Our logic acts as an active translation bridge between older external corporate partners and your modern internal application layers.</p>
            <p className="font-mono text-[10px] uppercase font-bold text-emerald-300/70 border-t border-emerald-500/20 pt-4 mt-auto">Fixed B2B monthly data brokering retainer.</p>
          </div>

          <div className="bg-gradient-to-b from-orange-950/40 to-black/40 border border-orange-500/40 p-8 rounded-[32px] relative overflow-hidden group mt-4 md:mt-0 transform md:-translate-y-4 shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)]">
            <Building2 className="absolute top-0 right-0 h-32 w-32 -mt-4 text-orange-500/5 group-hover:scale-110 transition-transform" />
            <div className="absolute top-0 right-0 bg-orange-500 text-black text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-[20px] tracking-widest z-20 shadow-lg">Bank Grade</div>
            <h3 className="text-2xl font-black text-white mb-2 relative z-10 italic">On-Premise Deploy</h3>
            <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-6">Enterprise Licensing</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">For banking, healthcare, and governments. Deploy our entire ML engine locally within your isolated infrastructure for 100% zero-data-retention security.</p>
            <p className="font-mono text-[10px] uppercase font-bold text-orange-300/70 border-t border-orange-500/20 pt-4 mt-auto">Multi-year flat software licensing tier.</p>
          </div>
        </div>
      </div>

      <div className="mt-24 text-center">
        <div className="inline-block p-1 mt-4 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 cursor-pointer hover:scale-105 transition-transform duration-300">
          <button className="px-8 py-4 rounded-full bg-background hover:bg-black/50 transition-all font-bold tracking-wide">
            Integrate Our Neural API
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
