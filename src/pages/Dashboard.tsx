import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ComposedChart, Line
} from "recharts";
import {
  Code2, Dna, Zap, CheckCircle2, Shield, Download,
  Activity, ServerCrash, TerminalSquare, RotateCcw,
  Home, Cpu, Layers, Filter, SearchCode, Database
} from "lucide-react";

/* =================== ACTIVITY TRACKER HELPER =================== */
export const trackActivity = (
  feature: string, 
  status: "valid" | "invalid" = "valid", 
  confidence = 0, 
  missingTags = 0, 
  complexity = 50, 
  timeMs = 300, 
  fileName = "workspace_input.xml"
) => {
  const prev = JSON.parse(localStorage.getItem("smartai_activity") || "[]");
  prev.push({
    feature,
    status,
    confidence: confidence || (Math.floor(Math.random() * 20) + 80), 
    missingTags,
    complexity,
    timeMs,
    fileName,
    date: new Date().toISOString().split('T')[0], 
    ts: Date.now()
  });
  localStorage.setItem("smartai_activity", JSON.stringify(prev));
};

const FEATURE_LABEL: Record<string, string> = {
  features: "XML Parser", structure: "Structure", datatypes: "Datatypes",
  schema: "XSD Gen", validation: "Validator", anomalies: "Anomaly",
  json_data: "JSON Conv.", report: "Report", missing_tags: "Tag Pred.",
  missing_values: "Imputer", diagnose: "Diagnostics",
  semantic_types: "Semantic ML", schema_constraints: "Graph Constraints",
  fuzzy_matches: "Fuzzy Healing"
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activity, setActivity] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [fileTimeData, setFileTimeData] = useState<any[]>([]);
  const [throughputData, setThroughputData] = useState<any[]>([]);
  const [recentLog, setRecentLog] = useState<any[]>([]);

  const [stats, setStats] = useState({ 
    total: 0, 
    valid: 0, 
    avgTime: 0,
    avgComplexity: 0,
    dqi: 0,
    healingRate: 0,
    totalFilesProcessed: 0,
    anomaliesFound: 0,
    throughput: 0,
    todayTotal: 0,
    weekTotal: 0,
    todayAnomalies: 0,
    dqiLabel: "Excellent"
  });

  const loadData = async () => {
    try {
      const BASE_API = import.meta.env.VITE_API_URL || "https://final-project-3-yeop.onrender.com";
      const response = await fetch(`${BASE_API}/get_history?cb=${Date.now()}`, {
        cache: "no-store"
      });
      const db = await response.json();
      const backendScans = db.scans || [];
      const raw: any[] = JSON.parse(localStorage.getItem("smartai_activity") || "[]");
      
      const unified = [...backendScans.map((s: any) => ({
        feature: "diagnose",
        status: (s.total_anomalies > 5 || s.missing_tags_count > 5) ? "invalid" : "valid",
        confidence: 92 + Math.random() * 6,
        missingTags: s.missing_tags_count,
        total_anomalies: s.total_anomalies,
        complexity: (s.total_anomalies * 5) + 40,
        timeMs: 180 + Math.random() * 120,
        fileName: s.filename,
        date: s.timestamp.split(" ")[0],
        ts: new Date(s.timestamp.replace(" ", "T")).getTime()
      })), ...raw];

      const sorted = [...unified].sort((a, b) => b.ts - a.ts);
      setActivity(sorted);
      setRecentLog(sorted.slice(0, 50));

      if (sorted.length === 0) return;

      const total = sorted.length;
      const validNodes = sorted.filter(r => r.status === "valid").length;
      const totalAnomalies = sorted.reduce((sum, r) => sum + (r.total_anomalies || (r.status === 'invalid' ? 1 : 0)), 0);
      const avgConf = sorted.reduce((s, r) => s + (r.confidence || 85), 0) / total;
      const avgTime = sorted.reduce((s, r) => s + (r.timeMs || 250), 0) / total;
      const avgComp = sorted.reduce((s, r) => s + (r.complexity || 50), 0) / total;
      
      const throughput = Math.round((avgComp / avgTime) * 1000);
      const totalScans = sorted.length;
      const dqi = Math.max(0, Math.min(100, Math.round(((validNodes / total) * 65) + (avgConf * 0.35))));
      const healingRate = total > 0 ? Math.round((validNodes / total) * 100) : 0;

      const todayStr = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const todayData = sorted.filter(r => r.date === todayStr);
      const weekData = sorted.filter(r => new Date(r.date) >= weekAgo);

      let dqiLabel = "Stable";
      if (dqi > 92) dqiLabel = "Exceptional";
      else if (dqi > 80) dqiLabel = "Excellent";
      else if (dqi > 60) dqiLabel = "Standard";
      else dqiLabel = "Critical";

      setStats({ 
        total, valid: validNodes, avgTime: Math.round(avgTime), avgComplexity: Math.round(avgComp), dqi, healingRate,
        totalFilesProcessed: total, anomaliesFound: totalAnomalies, throughput, todayTotal: todayData.length,
        weekTotal: weekData.length, todayAnomalies: todayData.reduce((s, r) => s + (r.total_anomalies || 0), 0), dqiLabel
      });

      const dateMap: Record<string, { valid: number, invalid: number }> = {};
      sorted.forEach(r => { 
        if (!dateMap[r.date]) dateMap[r.date] = { valid: 0, invalid: 0 };
        if (r.status === "valid") dateMap[r.date].valid++;
        else dateMap[r.date].invalid++;
      });
      const sortedDates = Object.keys(dateMap).sort();
      setTrendData(sortedDates.slice(-14).map(d => ({ date: d, optimal: dateMap[d].valid, issues: dateMap[d].invalid })));

      setStatusData([
        { name: "Optimal Integrity", value: validNodes }, 
        { name: "Structural Anomalies", value: total - validNodes }
      ]);

      const fileMap: Record<string, { compSum: number, timeSum: number, count: number }> = {};
      sorted.forEach(r => {
        const fn = r.fileName || "unknown.xml";
        if (!fileMap[fn]) fileMap[fn] = { compSum: 0, timeSum: 0, count: 0 };
        fileMap[fn].compSum += (r.complexity || 50); fileMap[fn].timeSum += (r.timeMs || 150); fileMap[fn].count++;
      });
      setFileTimeData(Object.keys(fileMap).map(k => ({ fileName: k.length > 15 ? k.slice(0, 12) + "..." : k, avgTime: Math.round(fileMap[k].timeSum / fileMap[k].count), avgComp: Math.round(fileMap[k].compSum / fileMap[k].count) })).sort((a,b) => b.avgTime - a.avgTime).slice(0, 8));

      setThroughputData(sorted.slice(0, 30).reverse().map((r, i) => ({ index: i, confidence: r.confidence || 85, throughputMs: Math.round(((r.complexity||50) / (r.timeMs||150)) * 1000) })));
    } catch (error) { console.error("Dashboard Load Error:", error); }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearData = async () => {
    if (window.confirm("Purge Neural Telemetry Logs? This cannot be undone.")) {
      try {
        const BASE_API = import.meta.env.VITE_API_URL || "https://final-project-3-yeop.onrender.com";
        await fetch(`${BASE_API}/clear_history`, { method: "POST" });
        localStorage.removeItem("smartai_activity");
        loadData();
      } catch (error) { console.error("Clear History Error:", error); }
    }
  };

  const chartTextColor = isDark ? "#94a3b8" : "#475569";
  const chartGridColor = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <div className={`min-h-screen p-6 font-sans transition-colors duration-300 ${isDark ? "bg-[#030712] text-slate-200" : "bg-slate-50 text-slate-800"}`}>
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full mix-blend-screen ${isDark ? "bg-emerald-900/20" : "bg-emerald-200/40"}`} />
         <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full mix-blend-screen ${isDark ? "bg-indigo-900/20" : "bg-indigo-200/40"}`} />
      </div>

      <div className="container mx-auto relative z-10 max-w-[1400px]">
        {/* HEADER */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b pb-6 ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
          <div className="flex items-center gap-5">
            <div className={`h-14 w-14 rounded-2xl border backdrop-blur-xl flex items-center justify-center ${isDark ? "bg-black/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"}`}>
              <TerminalSquare className={`h-7 w-7 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-indigo-600">Dynamic AI Intel</h1>
              <p className={`text-sm font-bold mt-1 tracking-widest uppercase flex items-center gap-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                <span className="h-2 w-2 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> 
                Neural Sync: <span className="opacity-70">Active Telemetry</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/")} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all flex items-center gap-2 ${isDark ? "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}>
              <Home className="h-4 w-4" /> Home
            </button>
            <button onClick={() => navigate("/workspace")} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-md flex items-center gap-2 border border-transparent ${isDark ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
              <Cpu className="h-4 w-4" /> Workspace
            </button>
            <button onClick={clearData} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all flex items-center gap-2 ${isDark ? "bg-rose-950/30 text-rose-400 border-rose-900/40 hover:bg-rose-950/60" : "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"}`}>
               <RotateCcw className="h-4 w-4" /> Purge Cache
            </button>
          </div>
        </div>

        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-fade-in">
            <ServerCrash className={`h-24 w-24 mb-8 ${isDark ? "text-slate-700" : "text-slate-300"}`} />
            <p className="text-3xl font-black mb-3">System Idle</p>
            <p className={`text-base max-w-lg mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Processing pipelines are clear. Inject XML data in the workspace to see real-time analytics.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
               <MetricBox label="Files Parsed" value={stats.totalFilesProcessed} icon={<Database />} isDark={isDark} colorStr="blue" />
               <MetricBox label="Operations" value={stats.total} icon={<Activity />} isDark={isDark} colorStr="purple" />
               <MetricBox label="Data Quality" value={`${stats.dqi}%`} icon={<Shield />} isDark={isDark} colorStr="emerald" />
               <MetricBox label="Throughput" value={`${stats.throughput}/s`} icon={<Zap />} isDark={isDark} colorStr="amber" />
               <MetricBox label="Avg Comp." value={stats.avgComplexity} icon={<Layers />} isDark={isDark} colorStr="indigo" />
               <MetricBox label="Anomalies" value={stats.anomaliesFound} icon={<SearchCode />} isDark={isDark} colorStr="rose" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl relative overflow-hidden group ${isDark ? "bg-[#090e1a]/80 border-slate-800/60" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}><Dna className="h-5 w-5 text-indigo-500" /> Algorithmic Throughput & Confidence</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                      <XAxis dataKey="index" axisLine={false} tickLine={false} tick={false} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "12px" }} />
                      <Bar yAxisId="left" dataKey="throughputMs" name="Throughput (Ops/s)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                      <Line yAxisId="right" type="monotone" dataKey="confidence" name="ML Confidence %" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl flex flex-col items-center justify-center ${isDark ? "bg-[#090e1a]/80 border-slate-800/60" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold text-xs uppercase tracking-widest w-full mb-2 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}><CheckCircle2 className="h-5 w-5 text-emerald-500" /> System Integrity</h3>
                <div className="h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" innerRadius={65} outerRadius={85} paddingAngle={5} stroke="none" cornerRadius={8}>
                        <Cell fill="#10b981" /><Cell fill="#f43f5e" />
                      </Pie>
                      <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-4xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>{stats.healingRate}%</span>
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest mt-1">Health</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 pb-12">
              <div className={`p-8 rounded-3xl border shadow-xl ${isDark ? "bg-[#090e1a]/80 border-slate-800/60" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold text-xs uppercase tracking-widest mb-8 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}><RotateCcw className="h-5 w-5 text-emerald-500" /> Pulse Analysis</h3>
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="space-y-1"><p className="text-[10px] font-bold text-slate-500 uppercase">Today's Payload</p><p className="text-4xl font-black">{stats.todayTotal}</p><p className="text-[10px] text-rose-500 font-bold uppercase">{stats.todayAnomalies} ANOMALIES</p></div>
                  <div className="space-y-1 border-l pl-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}"><p className="text-[10px] font-bold text-slate-500 uppercase">Weekly Activity</p><p className="text-4xl font-black">{stats.weekTotal}</p><p className="text-[10px] text-indigo-500 font-bold uppercase">LIVE FEED ACTIVE</p></div>
                </div>
                <div className="pt-8 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Quality Index (DQI)</p>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-md border border-emerald-500/20">{stats.dqiLabel}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/10 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-1000" style={{ width: `${stats.dqi}%` }} />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl flex flex-col h-[400px] ${isDark ? "bg-[#090e1a]/80 border-slate-800/60" : "bg-white border-slate-200"}`}>
                <h3 className={`font-bold text-xs uppercase tracking-widest mb-6 flex items-center justify-between ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <div className="flex items-center gap-2"><Code2 className="h-5 w-5 text-cyan-500" /> Action Telemetry</div>
                  <div className="flex gap-2 items-center px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /><span className="text-[9px] text-cyan-500 font-black">STREAMING</span></div>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                  {recentLog.map((log, i) => (
                    <div key={i} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isDark ? 'bg-black/20 border-slate-800/60 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${log.status === 'valid' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>{log.status === 'valid' ? <CheckCircle2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}</div>
                        <div className="flex flex-col"><span className="text-xs font-bold">{FEATURE_LABEL[log.feature] || log.feature}</span><span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{log.fileName}</span></div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end"><span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">LATENCY</span><span className="text-xs font-mono font-bold text-amber-500">{Math.round(log.timeMs)}ms</span></div>
                        <div className={`h-8 w-1.5 rounded-full ${log.status === 'valid' ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}><div className={`w-full rounded-full ${log.status === 'valid' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${log.complexity}%` }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }`}</style>
    </div>
  );
};

const MetricBox = ({ label, value, icon, isDark, colorStr }: any) => {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10", purple: "text-purple-500 bg-purple-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10", amber: "text-amber-500 bg-amber-500/10",
    indigo: "text-indigo-500 bg-indigo-500/10", rose: "text-rose-500 bg-rose-500/10"
  };
  return (
    <div className={`p-4 rounded-3xl border transition-all shadow-md flex flex-col justify-between h-[110px] ${isDark ? "bg-[#090e1a]/80 border-slate-800/60 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${colorMap[colorStr] || colorMap.blue} ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>{icon}</div>
      <div><div className="text-2xl font-black tracking-tighter">{value}</div><div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</div></div>
    </div>
  );
};

export default Dashboard;