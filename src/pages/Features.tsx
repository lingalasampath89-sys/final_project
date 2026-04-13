import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Code2, Zap, Layers, FileCheck, Brain, BarChart3, Shield,
  Dna, FileJson, LayoutTemplate, CheckCircle2, Eye, LineChart,
  SearchCode, Lock, ChevronLeft, Network
} from "lucide-react";

const ALL_FEATURES = [
  { icon: Code2,         title: "XML Smart Parser",      desc: "Heuristic-based parsing for complex XML trees.",       id: "features",       enabled: true },
  { icon: LayoutTemplate,title: "Structure Learner",     desc: "Learns and visualizes hierarchical patterns.",         id: "structure",      enabled: true },
  { icon: Dna,           title: "Datatype Detector",     desc: "BAVA-powered intelligent type inference.",             id: "datatypes",      enabled: true },
  { icon: Zap,           title: "XSD Generator",         desc: "Export instantly to XML Schema Definitions.",          id: "schema",         enabled: true },
  { icon: CheckCircle2,  title: "Strict Validator",      desc: "Real-time structural XML rule validation.",            id: "validation",     enabled: true },
  { icon: Shield,        title: "Anomaly Detector",      desc: "Detect outliers and encoding errors.",                 id: "anomalies",      enabled: true },
  { icon: FileJson,      title: "JSON Converter",        desc: "Transform XML to JSON structures seamlessly.",         id: "json_data",      enabled: true },
  { icon: LineChart,     title: "Report Engine",         desc: "Generate professional analytical reports.",            id: "report",         enabled: true },
  { icon: Brain,         title: "Tag Predictor",         desc: "AI-powered missing tag identification.",               id: "missing_tags",   enabled: true },
  { icon: FileCheck,     title: "Value Imputer",         desc: "Intelligently fill missing data values.",              id: "missing_values", enabled: true },
  { icon: Eye,           title: "Hierarchy Visualizer",  desc: "Trace complex parent-child connections.",              id: "diagnose",       enabled: true },
  { icon: SearchCode,    title: "Confidence Scorer",     desc: "Machine Learning scoring for reliability.",            id: "report",         enabled: false },
];

const Features = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedFeature = searchParams.get("feature");

  const goToFeature = (id: string, enabled: boolean) => {
    if (!enabled) return;
    if (!user) {
      navigate("/auth?mode=signup");
    } else {
      navigate(`/workspace?feature=${id}`);
    }
  };

  return (
    <div className="animate-fade-in relative">
      {/* Hero */}
      <section className="container py-16 text-center relative">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 text-muted-foreground hover:text-emerald-400 gap-1 font-bold"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
          <Zap className="h-4 w-4" /> 12 Intelligence Modules
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Every XML Tool You Need
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Click any module below to open it directly in the Workspace. Locked modules will be unlocked in upcoming updates.
        </p>
        <Button
          size="lg"
          onClick={() => navigate(user ? "/workspace?feature=all" : "/auth?mode=signup")}
          className="bg-primary hover:bg-primary/90"
        >
          Open Full Workspace →
        </Button>
      </section>

      {/* 12 Features Grid */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ALL_FEATURES.map((feature, i) => {
            const isSelected = selectedFeature === feature.id;
            const isLocked = !feature.enabled;
            return (
              <div
                key={i}
                onClick={() => goToFeature(feature.id, feature.enabled)}
                className={`
                  relative p-6 rounded-2xl border flex flex-col h-full transition-all duration-300
                  ${isLocked
                    ? "opacity-50 cursor-not-allowed border-border/30 bg-card/40"
                    : isSelected
                    ? "ring-2 ring-primary border-primary/40 bg-card shadow-xl cursor-pointer"
                    : "border-border/50 bg-card hover:shadow-xl hover:border-primary/30 cursor-pointer group"
                  }
                `}
              >
                {/* Lock overlay badge */}
                {isLocked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full border">
                    <Lock className="h-3 w-3" /> Locked
                  </div>
                )}

                {/* Active badge */}
                {isSelected && !isLocked && (
                  <div className="absolute top-3 right-3 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                    Active
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors
                  ${isLocked ? "bg-muted" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                  <feature.icon className={`h-6 w-6 ${isLocked ? "text-muted-foreground" : "text-primary"}`} />
                </div>

                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1 italic">{feature.desc}</p>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isLocked}
                  className={`w-full rounded-lg transition-all duration-300
                    ${isLocked
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary/5 hover:bg-primary hover:text-white"
                    }`}
                >
                  {isLocked ? "Coming Soon" : "Try Now →"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ML & DL Technologies Section */}
      <section className="container py-16 mb-16 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-4">
            <Brain className="h-4 w-4" /> Advanced Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Machine Learning & Deep Learning Core</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform doesn't just parse XML, it understands it. Powered by state-of-the-art intelligent algorithms dynamically optimizing data pipelines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Deep Learning Card */}
          <div className="p-8 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)]">
            <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
              <Network className="h-6 w-6" /> Deep Learning (DL)
            </h3>
            <ul className="space-y-6">
              <li>
                <h4 className="font-bold text-foreground mb-1">Neural Autoencoder (MLP/ANN)</h4>
                <p className="text-sm text-muted-foreground">Unsupervised anomaly detection. Identifies hidden structural outliers and corruptions using latent space mapping before parsing failures occur.</p>
              </li>
              <li>
                <h4 className="font-bold text-foreground mb-1">Graph & Sequence Context Modeling</h4>
                <p className="text-sm text-muted-foreground">Extracts deep hierarchical parent-child relationships and predicts contextually missing node values with sequence-to-sequence logic.</p>
              </li>
            </ul>
          </div>

          {/* Machine Learning Card */}
          <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]">
            <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
              <Code2 className="h-6 w-6" /> Machine Learning (ML)
            </h3>
            <ul className="space-y-6">
              <li>
                <h4 className="font-bold text-foreground mb-1">Random Forest Classifier</h4>
                <p className="text-sm text-muted-foreground">Ensemble trees for fast, feature-heavy predictions. Classifies overarching structural archetypes and robustly tags missing structural payload.</p>
              </li>
              <li>
                <h4 className="font-bold text-foreground mb-1">Adaptive Heuristics & Label Encoding</h4>
                <p className="text-sm text-muted-foreground">Converts raw textual elements into predictive numeric vectors. Dynamically applies learned rules to repair malformed brackets during execution.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
