import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Code2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Layers,
  FileCheck,
  Brain,
  BarChart3,
  Dna,
  FileJson,
  LayoutTemplate,
  CheckCircle2,
  Eye,
  LineChart,
  SearchCode
} from "lucide-react";

import NeuralTerminal from "@/components/NeuralTerminal";

const Index = () => {
  const navigate = useNavigate();
  // ... rest of the code before the video section
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);

  const goToFeature = (feature: string) => {
    if (!user) {
      navigate("/auth?mode=signup");
    } else {
      navigate(`/workspace?feature=${feature}`);
    }
  };

  const steps = [
    {
      title: "1. Paste XML",
      desc: "Copy and paste your XML into our smart editor. Our system immediately starts structural analysis.",
      image: "/step1.png",
    },
    {
      title: "2. AI Processing",
      desc: "Our engine analyzes structure, detects datatypes, and learns the schema using advanced ML models.",
      image: "/step2.png",
    },
    {
      title: "3. Get Results",
      desc: "View comprehensive reports, download generated XSDs, fix errors, and export to JSON instantly.",
      image: "/step3.png",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in bg-transparent">

      {/* HERO with global background integration */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container relative z-10 mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-left">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-8 shadow-sm border border-emerald-500/20">
                <Sparkles className="h-4 w-4" /> Next-Gen XML Intelligence
              </div>

              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-foreground transition-colors duration-300">
                Automate Your 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">XML Workflow</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg mb-12 font-medium leading-relaxed">
                SmartAI initializes deep-learning processors to reconstruct data integrity with neural precision. Generate schemas and fix anomalies instantly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 font-black rounded-2xl transition-all hover:scale-105"
                  onClick={() =>
                    navigate(user ? "/workspace?feature=all" : "/auth?mode=signup")
                  }
                >
                  INITIALIZE ENGINE <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 border-2 font-black rounded-2xl hover:bg-secondary transition-all"
                  onClick={() => navigate("/features")}
                >
                  EXPLORE MODULES
                </Button>
              </div>
            </div>

            {/* Hero Video Section */}
            <div className="relative group animate-float">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-[2rem] overflow-hidden border-8 border-card/50 shadow-2xl aspect-video bg-black/40 backdrop-blur-xl">
                <NeuralTerminal />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 pointer-events-none">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase">Neural Analytics Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="container pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            12 Core AI Intelligence Modules
          </h2>
          <p className="text-muted-foreground text-lg">Integrated tools for every XML engineering challenge.</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { icon: Code2, title: "XML Smart Parser", desc: "Heuristic-based parsing for complex XML trees.", id: "features" },
            { icon: LayoutTemplate, title: "Structure Learner", desc: "Learns and visualizes hierarchical patterns.", id: "structure" },
            { icon: Dna, title: "Datatype Detector", desc: "BAVA-powered intelligent type inference.", id: "datatypes" },
            { icon: Zap, title: "XSD Generator", desc: "Export instantly to XML Schema Definitions.", id: "schema" },
            { icon: CheckCircle2, title: "Strict Validator", desc: "Real-time structural XML rule validation.", id: "validation" },
            { icon: Shield, title: "Anomaly Detector", desc: "Detect outliers and encoding errors.", id: "anomalies" },
            { icon: FileJson, title: "JSON Converter", desc: "Transform XML to JSON structures seamlessly.", id: "json_data" },
            { icon: LineChart, title: "Report Engine", desc: "Generate professional analytical reports.", id: "report" },
            { icon: Brain, title: "Tag Predictor", desc: "AI-powered missing tag identification.", id: "missing_tags" },
            { icon: Sparkles, title: "Value Imputer", desc: "Intelligently fill missing data values.", id: "missing_values" },
            { icon: Eye, title: "Hierarchy Visualizer", desc: "Trace complex parent-child connections.", id: "structure" },
            { icon: SearchCode, title: "Confidence Scorer", desc: "Machine Learning scoring for reliability.", id: "report" },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border/50 transition-all hover:shadow-xl hover:border-primary/30 group flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>

              <p className="text-muted-foreground text-sm mb-6 flex-1 italic">
                {feature.desc}
              </p>

              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all duration-300 rounded-lg group text-emerald-600 dark:text-emerald-400 dark:hover:text-black font-bold"
                onClick={() => goToFeature(feature.id)}
              >
                Try Now <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/50 py-24 overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Experience the Process</h2>
            <p className="text-muted-foreground">See how SmartAI effortlessly handles your complex XML data.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps List */}
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeStep === i
                      ? "bg-card shadow-xl border-primary/20 translate-x-2"
                      : "bg-transparent border-transparent grayscale opacity-60"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      activeStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                  {activeStep === i && (
                    <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-progress-fast" style={{ width: '100%' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Display */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-card bg-card group">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    activeStep === i ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-2 pointer-events-none"
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80 mb-1">Current Phase</p>
                      <h4 className="text-2xl font-bold">{step.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/80 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE_PREVIEW_MODE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM PERFORMANCE METRICS */}
      <section className="py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Neural Engine Benchmarks</h2>
            <p className="text-muted-foreground">Proven performance in large-scale XML ecosystems.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Inference Accuracy", value: "99.8%", sub: "ML-Based Verification" },
              { label: "Processing Speed", value: "< 45ms", sub: "Ultra-Low Latency" },
              { label: "Patterns Learned", value: "1.2M+", sub: "Deep Structural Data" },
              { label: "Reliability Score", value: "99.99%", sub: "Enterprise Ready" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-card/50 border border-emerald-500/10 hover:border-emerald-500/30 transition-all group text-center cyber-card">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">{stat.label}</p>
                <h3 className="text-4xl font-black text-emerald-500 mb-2 glow-text">{stat.value}</h3>
                <p className="text-xs text-emerald-500/40 font-bold">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your XML?
        </h2>
        <p className="text-muted-foreground mb-8">
          Start using SmartAI today and unlock intelligent XML insights.
        </p>

        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => goToFeature("validation")}
        >
          Start Free Now
        </Button>
      </section>

    </div>
  );
};

export default Index;