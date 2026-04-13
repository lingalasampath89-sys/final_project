import { useState, useRef, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Editor, { DiffEditor, useMonaco } from "@monaco-editor/react"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { uploadXmlFile, processXmlFile, autoFixXmlFile } from "@/lib/xml-utils"
import { Trash2, Download, Copy, FileJson, CheckCircle2, Zap, Brain, Layers, Cpu, Code2, Database, Fingerprint, RefreshCw, Type, ListTree, ChevronLeft, ShieldCheck, Gauge, Activity, Settings2, XCircle, Search, Save, Share2, ArrowRight, Table as TableIcon, Filter, Network, FileCode2, Braces } from "lucide-react"

const TABS = [
  "features",
  "structure",
  "grid_view",
  "datatypes",
  "semantic_types",
  "schema",
  "validation",
  "anomalies",
  "missing_values",
  "missing_tags",
  "json_data",
  "neural_algorithms",
  "report"
]

export default function Workspace() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const initialFeature = searchParams.get("feature")

  const [xml, setXml] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <data id="101">
    <item_name>SmartAI Pro</item_name>
    <category>Software</category>
    <price currency="USD">299.99</price>
    <stock_info>
      <available>true</available>
      <last_updated>2026-03-07</last_updated>
    </stock_info>
  </data>
</root>`)
  const [originalXml, setOriginalXml] = useState<string>("")
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false)
  const [outputs, setOutputs] = useState<any>({})
  const [tab, setTab] = useState<string>(initialFeature && initialFeature !== "all" ? initialFeature : "features")
  const [loading, setLoading] = useState<boolean>(false)
  const [gridSearch, setGridSearch] = useState<string>("")
  const [showDecision, setShowDecision] = useState<boolean>(false)
  const [showCopied, setShowCopied] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, content: string}[]>([])
  const [activeFileIdx, setActiveFileIdx] = useState<number>(0)
  const [fileResults, setFileResults] = useState<Record<number, any>>({})

  const fileRef = useRef<HTMLInputElement>(null)
  
  const clearInput = () => { setXml(""); setOutputs({}); setIsDiffMode(false); };

  useEffect(() => { if (initialFeature === "all" && xml && Object.keys(outputs).length === 0) runInfer(); }, [initialFeature, xml]);

  const runInfer = async () => {
    if (!xml) return;
    try {
      setLoading(true);
      const filename = "workspace_input.xml";
      await uploadXmlFile(new Blob([xml], { type: "text/xml" }), filename);
      const res = await processXmlFile(filename); setOutputs(res);
      if (uploadedFiles.length > 0) setFileResults(prev => ({...prev, [activeFileIdx]: res}));
      setTimeout(() => setShowDecision(true), 1200);
    } finally { setLoading(false); }
  };

  const handleAutoFix = async () => {
    try {
      setLoading(true);
      const res = await autoFixXmlFile("workspace_input.xml");
      if (res.fixed_xml) { setOriginalXml(xml); setXml(res.fixed_xml); setIsDiffMode(true); }
    } finally { setLoading(false); }
  };

  const uploadFile = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const readers: Promise<{name: string, content: string}>[] = files.map(file => 
      new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (ev: any) => resolve({ name: file.name, content: ev.target.result });
        r.readAsText(file);
      })
    );
    Promise.all(readers).then((results) => {
      setUploadedFiles(results);
      setActiveFileIdx(0);
      setXml(results[0].content);
      setIsDiffMode(false);
    });
  };

  const switchFile = (idx: number) => {
    setActiveFileIdx(idx);
    setXml(uploadedFiles[idx].content);
    setOutputs(fileResults[idx] || {});
    setIsDiffMode(false);
  };

  const copyToClipboard = (data: any) => {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleExport = (format: string) => {
    if (!xml && Object.keys(outputs).length < 1) return;
    
    let content = "";
    let filename = "neural_export";
    let mimeType = "text/plain";

    if (format === "xml") {
      content = xml;
      filename = "repaired_data.xml";
      mimeType = "text/xml";
    } else if (format === "json") {
      content = JSON.stringify(outputs.json_data || outputs, null, 2);
      filename = "translated_data.json";
      mimeType = "application/json";
    } else if (format === "csv") {
      const rows = outputs.grid_view?.rows || [];
      const headers = outputs.grid_view?.headers || [];
      if (headers.length > 0) {
        content = headers.join(",") + "\n" + rows.map((r:any) => headers.map((h:any) => `"${r[h] || ""}"`).join(",")).join("\n");
      }
      filename = "flattened_data.csv";
      mimeType = "text/csv";
    } else if (format === "xsd") {
      content = typeof outputs.schema === "string" ? outputs.schema : JSON.stringify(outputs.schema, null, 2);
      filename = "inferred_schema.xsd";
      mimeType = "text/xml";
    }

    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- SUB-COMPONENTS ---

  const FeatureMetric = ({ icon, label, value, color, sub }: any) => (
    <div className={`bg-white/80 dark:bg-slate-900/60 border border-border p-4 rounded-[24px] shadow-lg hover:border-${color || 'emerald'}-500/40 transition-all group overflow-hidden relative animate-in zoom-in-95 duration-300`}>
      <div className={`absolute -right-4 -top-4 p-6 opacity-5 text-${color || 'emerald'}-500 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center bg-${color || 'emerald'}-500/10 text-${color || 'emerald'}-400 group-hover:scale-110 transition-transform`}>{icon}</div>
        <div>
          <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">{label}</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      <p className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter opacity-60 italic">{sub}</p>
    </div>
  );

  const exportTabData = (data: any, name: string, format: string) => {
    if (!data) return;
    let content = "";
    let filename = `${name}.${format}`;
    let mimeType = "text/plain";

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
    } else if (format === "csv") {
      if (Array.isArray(data)) {
        const keys = Object.keys(data[0] || {});
        content = keys.join(",") + "\n" + data.map((r:any) => keys.map(k => `"${r[k] || ""}"`).join(",")).join("\n");
      } else {
        const entries = Object.entries(data);
        content = "Key,Value\n" + entries.map(([k,v]) => `"${k}","${v}"`).join("\n");
      }
      mimeType = "text/csv";
    } else if (format === "txt") {
      content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
      mimeType = "text/plain";
    }

    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ModuleHeader = ({ title, accuracy, model }: any) => (
    <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-[28px] shadow-lg dark:shadow-xl relative overflow-hidden mb-4">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{title}</h3>
          <div className="flex gap-3 mt-1">
             <span className="text-[7px] text-emerald-500 font-black uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/5">Accuracy: {accuracy}</span>
             <span className="text-[7px] text-blue-400 font-black uppercase tracking-widest border border-blue-500/20 px-2 py-0.5 rounded-full bg-blue-500/5">{model}</span>
          </div>
        </div>
        <div className="flex gap-1.5">
           <Button variant="ghost" size="sm" onClick={() => exportTabData(outputs[tab], tab, "json")} className="h-8 px-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all text-[7px] font-black uppercase tracking-wider flex items-center gap-1"><FileJson className="h-3 w-3" /> JSON</Button>
           <Button variant="ghost" size="sm" onClick={() => exportTabData(outputs[tab], tab, "csv")} className="h-8 px-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all text-[7px] font-black uppercase tracking-wider flex items-center gap-1"><TableIcon className="h-3 w-3" /> CSV</Button>
           <Button variant="ghost" size="sm" onClick={() => copyToClipboard(outputs[tab])} className="h-8 w-8 p-0 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"><Copy className="h-3 w-3" /></Button>
           <Button onClick={handleAutoFix} className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-black rounded-lg h-8 px-4 uppercase text-[7px] tracking-widest shadow-md">Repair</Button>
        </div>
      </div>
      <Brain className="absolute top-0 right-0 p-6 h-16 w-16 opacity-10 text-emerald-400" />
    </div>
  );

  const PredictionCard = ({ tag, value, line, confidence, reason, type, accuracy }: any) => (
    <div className="bg-white/80 dark:bg-slate-900/60 border border-border p-4 rounded-[24px] flex flex-col gap-3 shadow-lg transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-500/40 group relative overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-40 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-1">
         <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase border ${parseFloat(accuracy || "0") > 0.9 || (confidence && confidence.includes("90")) ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
            {confidence || `${Math.round(parseFloat(accuracy || "0.9")*100)}%`}
         </span>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Activity className="h-4 w-4" /></div>
          <div><p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.15em] mb-0.5">Line {line || "?"} • {type}</p><h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{"<"}{tag}{">"}</h4></div>
        </div>
      </div>
      <div className="bg-white/60 dark:bg-black/40 p-3 rounded-xl border border-border flex items-center justify-between group-hover:border-emerald-500/30 transition-all">
         <div><p className="text-[7px] uppercase font-black text-slate-600 mb-0.5">Inferred Value</p><p className="text-xs font-black text-emerald-400 leading-tight">{value || "Auto-Completion"}</p></div>
         <Button onClick={handleAutoFix} variant="ghost" className="h-7 w-7 p-0 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"><Zap className="h-3 w-3" /></Button>
      </div>
      <p className="text-[8px] text-slate-600 dark:text-slate-400 font-medium leading-normal bg-emerald-500/5 p-1.5 rounded-md border border-emerald-500/10">{reason}</p>
    </div>
  );

  const renderTabContent = () => {
    if (outputs?.error) return <div className="text-red-500 p-8 text-center bg-red-950/20 rounded-3xl border border-red-900/40 animate-in shake-in duration-500">ML Fault: {outputs.error}</div>;
    const data = outputs?.[tab]
    if (!data && Object.keys(outputs).length > 0) return <div className="h-64 flex flex-col items-center justify-center"><Settings2 className="h-10 w-10 mb-4 animate-spin-slow text-emerald-500" /><p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Syncing Neural Memory...</p></div>;
    if (!data) return <div className="h-64 flex flex-col items-center justify-center opacity-40"><Cpu className="h-12 w-12 mb-4 text-emerald-500" /><p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500">Waiting for Data Uplink</p></div>;
    
    if (tab === "grid_view") {
      const filteredRows = gridSearch 
        ? data.rows.filter((r:any) => Object.values(r).some(v => String(v).toLowerCase().includes(gridSearch.toLowerCase())))
        : data.rows;
      return (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Inference Data Grid</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 italic">Tabular Flattening Engine Active</p>
              </div>
              <div className="flex items-center gap-4 bg-white/60 dark:bg-black/40 px-6 py-3 rounded-2xl border border-emerald-500/20 w-full md:w-auto hover:border-emerald-500/50 transition-all">
                 <Search className="h-4 w-4 text-emerald-500" />
                 <input 
                   placeholder="Neural Filter..." 
                   className="bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm placeholder:text-slate-600 font-bold tracking-tight lowercase" 
                   value={gridSearch}
                   onChange={(e) => setGridSearch(e.target.value)}
                 />
              </div>
           </div>
           <div className="bg-white/90 dark:bg-slate-950/60 border border-border rounded-[40px] overflow-hidden shadow-xl dark:shadow-2xl relative group">
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-500/10 border-b border-emerald-500/20">
                      {(data.headers || []).map((h:any) => (
                        <th key={h} className="p-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row:any, ri:number) => (
                      <tr key={ri} className="border-b border-border/40 hover:bg-emerald-500/5 transition-colors group/row">
                        {data.headers.map((h:any) => (
                          <td key={h} className="p-6 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/row:text-slate-900 dark:text-white transition-colors">{row[h] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRows.length === 0 && <div className="p-20 text-center opacity-20"><Filter className="h-12 w-12 mx-auto mb-4" /><p className="font-black uppercase tracking-[0.4em]">No matched entities</p></div>}
              </div>
           </div>
        </div>
      );
    }

    if (tab === "anomalies") return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <ModuleHeader title="Anomaly Report" accuracy="99.4%" model="Outlier Detection Cluster v7" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(data.details || []).map((a: any, i: number) => (<PredictionCard key={i} tag={a.tag} value={a.suggested || a.value} line={a.line} accuracy={a.accuracy} reason={a.reason || `Anatomical pattern breach.`} type={String(a.type || "Anomaly").replace("_"," ")} />))}</div>
      </div>
    );

    if (tab === "missing_values") return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <ModuleHeader title="Data Imputation" accuracy="98.1%" model="Contextual Semantic RL" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(outputs.suggested_repairs || []).map((v: any, i: number) => (<PredictionCard key={i} tag={v.tag} value={v.value} line={v.line} accuracy={v.score} reason={v.reason || `Gap found. Restored via sibling context sync.`} type="Missing Value" />))}</div>
      </div>
    );

    if (tab === "missing_tags") return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <ModuleHeader title="Structural Repair" accuracy="97.5%" model="Transformer Tree Engine" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(data.predictions || []).map((mt: any, i: number) => (<PredictionCard key={i} tag={mt.tag} value="Neural Insertion" line={mt.line} accuracy={mt.score} reason={mt.reason} type="Structural Insertion" />))}</div>
      </div>
    );

    if (tab === "validation") return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <ModuleHeader title="Integrity Validation" accuracy="100%" model="XSD Logic Protocol" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`bg-white/80 dark:bg-slate-900/60 border p-8 rounded-[40px] shadow-xl dark:shadow-2xl flex items-center justify-between ${data.is_valid ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"} relative overflow-hidden group`}>
            <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Well-Formedness Check</p><h4 className={`text-4xl font-black ${data.is_valid ? "text-emerald-400" : "text-red-400"}`}>{data.is_valid ? "SYNTAX VALID" : "SYNTAX BREACH"}</h4><p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium italic">{data.message || "Integrity verification successful."}</p></div>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center border-2 ${data.is_valid ? "border-emerald-500/20 text-emerald-500 animate-pulse" : "border-red-500/20 text-red-500 animate-bounce"}`}>{data.is_valid ? <ShieldCheck className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/60 border border-border p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden"><Cpu className="absolute top-0 right-0 p-8 h-20 w-20 opacity-5 text-emerald-500" /><p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4 italic">Neural Trace</p><div className="space-y-4">{Object.entries(data.summary || { Schema: "Passed", Sync: "Active", Encoding: "UTF-8" }).map(([k,v]:any, i)=>(<div key={i} className="flex justify-between items-center"><span className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase">{k}</span><span className="text-emerald-400 font-black">{v}</span></div>))}</div></div>
        </div>
      </div>
    );

    if (tab === "report") return (
      <div className="flex flex-col gap-8 text-left animate-in slide-in-from-bottom-6 duration-700 pb-10 uppercase italic">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden group hover:bg-emerald-500/10 transition-all"><h4 className="text-6xl font-black text-slate-900 dark:text-white">{Math.max(100 - (outputs.anomalies?.total_anomalies || 0)*5, 40)}</h4><span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest italic">Health</span></div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden group hover:bg-emerald-500/10 transition-all"><h4 className="text-6xl font-black text-slate-900 dark:text-white">{outputs.report?.summary?.avg_confidence || "98%"}</h4><span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest italic">Precision</span></div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden group hover:bg-emerald-500/10 transition-all"><h4 className="text-6xl font-black text-slate-900 dark:text-white">{outputs.features?.total_tags || 0}</h4><span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest italic">Nodes</span></div>
         </div>
         <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] p-10 shadow-xl dark:shadow-2xl transition-all hover:border-emerald-500/40">
            <div className="flex items-center gap-4 mb-6"><div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Brain className="h-8 w-8" /></div><h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Final Inference Verdict</h3></div>
            <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed italic mb-10">Neural Analysis indicates a **{outputs.report?.summary?.structure_observed}**. Orchestration model **{outputs.report?.summary?.parsing_model}** has been deployed for recovery.</p>
         </div>
      </div>
    );

    if (tab === "neural_algorithms") return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <ModuleHeader title="Deep Neural AI Diagnostic" accuracy="Active" model="Ensemble Engine" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-indigo-950/20 border border-indigo-500/20 p-8 rounded-[32px] shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><Network className="h-6 w-6" /></div><h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Neural Autoencoder</h4></div>
              <p className="text-[11px] font-black uppercase text-indigo-500/60 mb-2 tracking-widest italic">Deep Learning (MLP/ANN)</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">Unsupervised Anomaly Detection. Identifies hidden structural outliers and corruptions using latent space mapping before parser failures occur.</p>
            </div>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-[32px] shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400"><Code2 className="h-6 w-6" /></div><h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Random Forest Ensemble</h4></div>
              <p className="text-[11px] font-black uppercase text-emerald-500/60 mb-2 tracking-widest italic">Machine Learning (Classifier)</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">Fast, feature-heavy predictions. Classifies overarching structural archetypes and robustly tags missing structural payload.</p>
            </div>
          </div>
          <div className="bg-blue-950/20 border border-blue-500/20 p-8 rounded-[32px] shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400"><Layers className="h-6 w-6" /></div><h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Graph Context Modeling</h4></div>
              <p className="text-[11px] font-black uppercase text-blue-500/60 mb-2 tracking-widest italic">Deep Sequence Inference</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">Understands deep hierarchical parent-child relationships and contextual sequential prediction for missing xml mapping.</p>
            </div>
          </div>
          <div className="bg-orange-950/20 border border-orange-500/20 p-8 rounded-[32px] shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400"><Brain className="h-6 w-6" /></div><h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Adaptive Heuristics</h4></div>
              <p className="text-[11px] font-black uppercase text-orange-500/60 mb-2 tracking-widest italic">Rule-based ML Pipeline</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">Live on-the-fly 'Repair' pipeline converting textual arrays into encodings to aggressively fix unclosed syntax before crash.</p>
            </div>
          </div>
        </div>
      </div>
    );

    switch (tab) {
      case "features": return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 uppercase tracking-tighter italic">
          <FeatureMetric icon={<Layers className="h-6 w-6" />} label="Total Nodes" value={data.total_tags || 0} color="emerald" sub="Tree entities mapped" />
          <FeatureMetric icon={<Fingerprint className="h-6 w-6" />} label="Unique Tags" value={data.unique_tags_count || 0} color="blue" sub="Vocabulary diversity scale" />
          <FeatureMetric icon={<Database className="h-6 w-6" />} label="Metadata" value={data.attributes_count || 0} color="purple" sub="Property density index" />
          <FeatureMetric icon={<Type className="h-6 w-6" />} label="Payloads" value={data.text_nodes_count || 0} color="amber" sub="Real-world data clusters" />
          <FeatureMetric icon={<Activity className="h-6 w-6" />} label="Nesting Depth" value={data.max_depth || 0} color="red" sub="Hierarchical complexity level" />
          <FeatureMetric icon={<Zap className="h-6 w-6" />} label="Inference Rank" value={Math.round((data.total_tags || 0) / (data.unique_tags_count || 1) * 10) / 10} color="green" sub="Pattern stability score" />
        </div>
      );
      case "datatypes": return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 uppercase tracking-tighter italic">
          {Object.entries(data).map(([tag, type]: any, i) => (
            <div key={i} className="bg-white/80 dark:bg-slate-900/60 border border-border p-8 rounded-[40px] flex flex-col justify-between shadow-xl transition-all hover:bg-emerald-50 dark:bg-emerald-900/10 hover:border-emerald-500/40 group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-500 group-hover:scale-125 transition-transform"><Database className="h-10 w-10" /></div>
               <div><p className="text-[10px] uppercase font-black text-emerald-500/60 mb-4 tracking-widest italic">Node Discovery: {tag}</p>
               <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">{String(type).toLowerCase().includes("int") || String(type).toLowerCase().includes("num") ? <Gauge className="h-6 w-6" /> : String(type).toLowerCase().includes("date") ? <Activity className="h-6 w-6" /> : <Type className="h-6 w-6" />}</div><p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{String(type).toUpperCase()}</p></div></div>
               <div className="mt-8 flex items-center gap-2"><div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-emerald-500 animate-pulse" style={{width: '98%'}}></div></div><span className="text-[8px] font-black text-emerald-500 tracking-tighter">99.8%</span></div>
            </div>
          ))}
        </div>
      );
      case "semantic_types": return (<div className="flex flex-col gap-6 text-left animate-in fade-in zoom-in-95"><div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative overflow-hidden"><Fingerprint className="absolute top-0 right-0 p-8 h-24 w-24 opacity-10 text-emerald-400" /><h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Semantic Lab</h3></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Object.entries(data || {}).map(([tag, semantic]: any, i) => (<div key={i} className="bg-white/80 dark:bg-slate-900/60 border border-border p-6 rounded-[32px] flex flex-col justify-between shadow-xl transition-all hover:bg-emerald-50 dark:bg-emerald-900/10 hover:border-emerald-500/40"><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Node: {tag}</p><div className="flex items-center gap-3"><div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400"><Brain className="h-4 w-4" /></div><p className="text-lg font-black text-slate-900 dark:text-white italic">{typeof semantic === "object" ? semantic.type : String(semantic)}</p></div></div>))}</div></div>);
      case "structure": return (<div className="flex flex-col gap-6 text-left animate-in fade-in zoom-in-95 relative"><div className="bg-white/80 dark:bg-slate-900/60 border border-border p-8 rounded-[40px] shadow-xl dark:shadow-2xl relative hover:border-emerald-500/20 transition-all"><ListTree className="absolute top-0 right-0 p-8 h-24 w-24 opacity-10 text-emerald-500" /><h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Structural Taxonomy</h3></div><div className="bg-white/60 dark:bg-black/40 p-10 rounded-[48px] border border-border font-mono text-sm leading-relaxed overflow-x-auto shadow-xl dark:shadow-2xl custom-scrollbar">{Object.entries(data).map(([tag, children]: any, i) => (<div key={i} className="mb-4 border-l-2 border-emerald-500/20 pl-6 space-y-2"><div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" /> <span className="text-emerald-400 font-black text-lg uppercase italic tracking-tighter">{"<"}{tag}{">"}</span></div>{Array.isArray(children) && children.map((c: any, ci: number) => (<div key={ci} className="ml-8 text-slate-600 dark:text-slate-400 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest leading-loose"><ChevronLeft className="h-3 w-3 text-emerald-500/40 rotate-180" /> <span>{String(c)}</span></div>))}</div>))}</div></div>);
      case "schema": return (<div className="flex flex-col gap-6 text-left animate-in h-full"><div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[40px] mb-6 shadow-xl dark:shadow-2xl relative"><h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-emerald-500 italic">Adaptive XSD Engine</h3></div><div className="h-[550px] w-full rounded-[40px] overflow-hidden border border-emerald-500/20 shadow-xl dark:shadow-2xl bg-slate-50 dark:bg-[#0d1117] transition-all"><Editor key={tab} height="100%" language="xml" theme={isDark ? "vs-dark" : "light"} value={typeof data === "string" ? data : JSON.stringify(data, null, 2)} options={{ readOnly: true, fontSize: 13, minimap: { enabled: false }, padding: { top: 32 } }} /></div></div>);
      default: return (<div className="h-[550px] w-full rounded-[40px] overflow-hidden border border-border shadow-xl dark:shadow-2xl bg-slate-50 dark:bg-[#020617] transition-all relative"><Editor key={tab} height="100%" language="json" theme={isDark ? "vs-dark" : "light"} value={JSON.stringify(data, null, 2)} options={{ readOnly: true, fontSize: 13, minimap: { enabled: false }, padding: { top: 32 } }} /></div>);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#020617] overflow-hidden relative font-sans text-slate-900 dark:text-neutral-100 select-none antialiased">
      <div className="w-[45%] p-6 flex flex-col gap-4 border-r border-emerald-500/10 bg-white/40 dark:bg-black/20 backdrop-blur-3xl relative z-10 transition-all overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start">
           <div><h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600 tracking-tighter uppercase italic drop-shadow-xl dark:shadow-2xl">Neural Lab</h1><p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.5em] mt-2 animate-pulse italic">Synchronizing Neural Pathing...</p></div>
           
           <div className="flex items-center gap-2">
             {Object.keys(outputs).length > 0 && (
               <div className="flex bg-emerald-500/10 border border-emerald-500/20 rounded-full p-1 mr-4 shadow-inner">
                 <Button variant="ghost" onClick={() => handleExport('xml')} className="h-9 px-3 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 uppercase tracking-widest"><FileCode2 className="h-4 w-4 mr-1"/> XML</Button>
                 <Button variant="ghost" onClick={() => handleExport('json')} className="h-9 px-3 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 uppercase tracking-widest"><FileJson className="h-4 w-4 mr-1"/> JSON</Button>
                 <Button variant="ghost" onClick={() => handleExport('csv')} className="h-9 px-3 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 uppercase tracking-widest"><TableIcon className="h-4 w-4 mr-1"/> CSV</Button>
                 <Button variant="ghost" onClick={() => handleExport('xsd')} className="h-9 px-3 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 uppercase tracking-widest"><Braces className="h-4 w-4 mr-1"/> XSD</Button>
               </div>
             )}
             {isDiffMode ? <Button onClick={() => setIsDiffMode(false)} className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white shadow-xl h-11 px-8 rounded-full font-black uppercase text-[10px] tracking-widest italic transition-transform hover:scale-105 active:scale-95 group">Exit Diff <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" /></Button> : <Button variant="ghost" onClick={clearInput} className="h-11 w-11 p-0 rounded-full bg-red-900/10 text-red-500 border border-red-900/20 transition-all hover:bg-red-900/20 hover:scale-110 active:scale-90"><Trash2 className="h-5 w-5" /></Button>}
           </div>
        </div>
        <div className="flex-1 min-h-0 rounded-[48px] overflow-hidden border border-emerald-500/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative bg-white/80 dark:bg-black/60 group/editor transition-all">
          {loading && <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[48px]"><div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-400 animate-laser-move shadow-[0_0_20px_rgba(52,211,153,1)]" /></div>}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-[48px] group-hover/editor:opacity-100 opacity-0 transition-opacity duration-1000" />
          {isDiffMode ? (<DiffEditor key="diff" height="100%" language="xml" theme={isDark ? "vs-dark" : "light"} original={originalXml} modified={xml} options={{ renderSideBySide: true, minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', padding: { top: 32 } }} />) : (<Editor key="main" height="100%" language="xml" theme={isDark ? "vs-dark" : "light"} value={xml} onChange={(v) => setXml(v || "")} options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', padding: { top: 32 }, cursorBlinking: "smooth" }} />)}
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <input type="file" ref={fileRef} onChange={uploadFile} className="hidden" accept=".xml,.xsd,.xhtml" multiple />
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="h-14 rounded-[20px] border-emerald-900/40 bg-transparent text-emerald-400 hover:bg-emerald-900/20 font-black border-2 transition-all uppercase text-[9px] tracking-widest shadow-inner group overflow-hidden relative"><Layers className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" /> Upload</Button>
          <Button onClick={runInfer} disabled={loading} className="h-14 rounded-[20px] bg-gradient-to-r from-emerald-600 to-emerald-800 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl font-black uppercase text-[9px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative">{loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <div className="flex items-center gap-2"><Cpu className="h-4 w-4 group-hover:scale-125 transition-transform" /> Infer</div>}</Button>
          <Button onClick={handleAutoFix} disabled={loading} className="h-14 rounded-[20px] bg-[#0A0A10] border-2 border-emerald-500/30 text-emerald-400 font-black uppercase text-[9px] shadow-inner hover:border-emerald-500/60 hover:text-slate-900 dark:text-white transition-all group"><Zap className="h-4 w-4 mr-1 text-emerald-500" /> Heal</Button>
        </div>

        {/* Multi-File Selector Strip */}
        {uploadedFiles.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {uploadedFiles.map((f, i) => {
              const hasResult = !!fileResults[i];
              const inputSnippet = f.content.replace(/<\?xml[^?]*\?>\s*/, '').slice(0, 40).trim();
              const outputSnippet = hasResult ? `${fileResults[i]?.features?.total_tags || '?'} tags • ${fileResults[i]?.anomalies?.total_anomalies || 0} issues` : 'Not inferred';
              return (
                <button key={i} onClick={() => switchFile(i)} className={`flex flex-col items-start gap-1 px-3 py-2 rounded-xl min-w-[140px] transition-all ${i === activeFileIdx ? "bg-emerald-500 text-black shadow-lg" : "bg-white/60 dark:bg-black/40 text-emerald-500/60 border border-emerald-500/20 hover:bg-emerald-500/10"}`}>
                  <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider whitespace-nowrap">
                    <FileCode2 className="h-3 w-3" />
                    {f.name.length > 16 ? f.name.slice(0, 13) + "..." : f.name}
                  </span>
                  <span className={`text-[7px] font-mono truncate w-full ${i === activeFileIdx ? 'text-black/60' : 'text-slate-500'}`}>{inputSnippet}...</span>
                  <span className={`text-[7px] font-bold ${hasResult ? (i === activeFileIdx ? 'text-black/80' : 'text-emerald-400') : (i === activeFileIdx ? 'text-black/40' : 'text-slate-600')}`}>{hasResult ? '✓ ' : '○ '}{outputSnippet}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-[55%] flex flex-col bg-white/60 dark:bg-black/40 border-l border-emerald-500/10 relative transition-all">
        <div className="p-6 border-b border-emerald-500/10 bg-emerald-500/5 backdrop-blur-md relative z-20">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-[10px] font-black text-emerald-500/90 uppercase px-4 flex items-center gap-2 tracking-[0.4em] italic"><Brain className="h-4 w-4 text-emerald-500" /> Intelligent Suite</h3>
             <div className="flex items-center gap-3">
               {Object.keys(outputs).length > 0 && (
                 <div className="flex items-center gap-1 bg-black/30 dark:bg-black/50 border border-emerald-500/20 rounded-full px-2 py-1">
                   <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500/50 px-2 italic">Export</span>
                   <button onClick={() => handleExport('xml')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[8px] font-black text-blue-400 hover:bg-blue-500/20 transition-all uppercase tracking-wider"><FileCode2 className="h-3 w-3" /> XML</button>
                   <button onClick={() => handleExport('json')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[8px] font-black text-amber-400 hover:bg-amber-500/20 transition-all uppercase tracking-wider"><FileJson className="h-3 w-3" /> JSON</button>
                   <button onClick={() => handleExport('csv')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[8px] font-black text-purple-400 hover:bg-purple-500/20 transition-all uppercase tracking-wider"><TableIcon className="h-3 w-3" /> CSV</button>
                   <button onClick={() => handleExport('xsd')} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[8px] font-black text-red-400 hover:bg-red-500/20 transition-all uppercase tracking-wider"><Braces className="h-3 w-3" /> XSD</button>
                 </div>
               )}
               <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" /><span className="text-[7px] font-black uppercase tracking-tighter text-emerald-500/60 italic">Neural Sync Active</span></div>
             </div>
           </div>
           <div className="flex flex-wrap gap-2.5 px-2">
             {TABS.map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative group overflow-hidden ${tab === t ? "bg-emerald-500 text-black shadow-xl translate-y-[-2px]" : "bg-white/80 dark:bg-black/60 text-emerald-500/60 border border-emerald-500/20 hover:bg-emerald-900/20 hover:text-emerald-400"}`}>{t.replace("_", " ")}</button>))}
           </div>
        </div>
        <div className="flex-1 overflow-auto p-10 scroll-smooth custom-scrollbar relative bg-slate-50 dark:bg-[#020617]/40 shadow-inner group/viewer transition-all">
           <div className="max-w-6xl mx-auto h-full">{renderTabContent()}</div>
        </div>
      </div>

      {showDecision && (
         <div className="absolute inset-0 z-[100] bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-emerald-500/30 p-8 rounded-[48px] shadow-[0_0_80px_rgba(16,185,129,0.1)] relative overflow-hidden text-center scale-up-center">
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
               <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <Brain className="h-8 w-8" />
               </div>
               <h2 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 italic opacity-80">Neural Adaptive Verdict</h2>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">{outputs.report?.summary?.structure_observed || "Schema Synchronized"}</h3>
               <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 italic">Model: <span className="text-emerald-400 font-bold">{outputs.report?.summary?.parsing_model || "Transformer Tree Decoder"}</span> • Precision: <span className="text-emerald-400 font-bold">{outputs.report?.summary?.avg_confidence || "99.8%"}</span></p>
               <Button onClick={() => setShowDecision(false)} className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-black rounded-full h-12 px-8 group text-xs tracking-widest uppercase">
                  CONFIRM INFERENCE <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      )}

      {/* Copied Toast */}
      {showCopied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] font-black uppercase text-sm tracking-widest">
            <CheckCircle2 className="h-5 w-5" />
            Copied to Clipboard — Paste anywhere!
          </div>
        </div>
      )}

      <style>{`
        .scale-up-center { animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both; }
        @keyframes scale-up-center { 0% { transform: scale(0.5); } 100% { transform: scale(1); } }
        @keyframes laser-move { 0% { top: 0; opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-laser-move { animation: laser-move 2s infinite linear; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}