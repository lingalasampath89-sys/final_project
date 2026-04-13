import React, { useState, useEffect } from 'react';

const logs = [
  "[SYSTEM] Initializing XML Neural Engine...",
  "[LOAD] Reading schema definitions...",
  "[ANALYSIS] Identifying structural patterns...",
  "[ML] Running Decision Tree Orchestrator...",
  "[INFERENCE] Detected Semantic Type: Customer_ID",
  "[REPAIR] Reconstructing missing closing tags...",
  "[VALIDATION] Schema conformity check: 98% Confidence",
  "[SYSTEM] Real-time inference pipeline active.",
  "[DATA] Converting hierarchical tree to JSON-Graph...",
  "[ANOMALY] Outlier detected at /Root/Invoices/Item[42]",
  "[ML] Auto-refining XSD constraints..."
];

const NeuralTerminal = () => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLogs(prev => {
        const nextLog = logs[index % logs.length];
        const updated = [...prev, nextLog];
        if (updated.length > 8) updated.shift();
        return updated;
      });
      setIndex(prev => prev + 1);
    }, 1500);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="w-full h-full bg-black/80 p-6 font-mono text-sm leading-relaxed overflow-hidden flex flex-col justify-end">
      <div className="flex-1 flex flex-col gap-2 justify-end">
        {visibleLogs.map((log, i) => (
          <div key={i} className={`flex gap-3 transition-all duration-500 animate-fade-in ${i === visibleLogs.length - 1 ? 'text-emerald-400 font-bold' : 'text-emerald-800'}`}>
            <span className="opacity-50">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            <span className="flex-1 truncate">{log}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-emerald-500/20 pt-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-black">Neural Core: Processing Live Stream</span>
      </div>
    </div>
  );
};

export default NeuralTerminal;
