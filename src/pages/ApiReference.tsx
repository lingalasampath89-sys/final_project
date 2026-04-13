import React from 'react';
import { Terminal, ArrowRight, LayoutDashboard, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApiReference = () => {
  return (
    <div className="container py-16 min-h-screen flex">
      {/* Sidebar Mock */}
      <div className="hidden lg:block w-64 pr-8 border-r border-border min-h-[calc(100vh-8rem)]">
        <h3 className="font-bold text-lg mb-4 text-foreground uppercase tracking-widest text-xs">Endpoints</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2 text-primary font-bold"><span className="text-[10px] bg-green-500/20 text-green-500 px-2 rounded">POST</span> /api/v1/infer</li>
          <li className="flex items-center gap-2 hover:text-foreground cursor-pointer"><span className="text-[10px] bg-blue-500/20 text-blue-500 px-2 pl-3 rounded">GET</span> /api/v1/schemas</li>
          <li className="flex items-center gap-2 hover:text-foreground cursor-pointer"><span className="text-[10px] bg-blue-500/20 text-blue-500 px-2 pl-3 rounded">GET</span> /api/v1/jobs</li>
          <li className="flex items-center gap-2 hover:text-foreground cursor-pointer"><span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 rounded">PUT</span> /api/v1/models</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-10">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">API Reference</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mb-12 mt-4">
          Integrate the SmartAI Neural Engine directly into your microservices via our globally distributed edge network.
        </p>

        <div className="space-y-12">
          {/* Endpoint Block */}
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="border-b border-border bg-secondary/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-green-500 font-mono text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">POST</span>
                <span className="font-bold font-mono text-sm tracking-wide">/api/v1/infer</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground hidden sm:block">Analyze and parse raw XML payload</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Request Headers</h4>
                <div className="bg-secondary/20 rounded-lg p-3 text-sm font-mono space-y-2 border border-border/50">
                  <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-primary font-bold">Authorization</span><span className="text-muted-foreground">Bearer &lt;token&gt;</span></div>
                  <div className="flex justify-between"><span className="text-primary font-bold">Content-Type</span><span className="text-muted-foreground">application/json</span></div>
                </div>

                <h4 className="font-bold text-sm mt-6 mb-4 uppercase tracking-wider text-muted-foreground">Parameters</h4>
                <ul className="text-sm space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-foreground">payload</span>
                    <span className="text-muted-foreground">- The raw XML string. Required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-foreground">strict_mode</span>
                    <span className="text-muted-foreground">- Boolean evaluating rigorous XSD generation.</span>
                  </li>
                </ul>
              </div>

              <div className="relative group">
                <div className="absolute right-4 top-4 bg-background p-2 rounded-md shadow drop-shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-muted-foreground hover:text-foreground border border-border">
                  <Copy className="w-4 h-4" />
                </div>
                <pre className="bg-[#0D1117] text-[#c9d1d9] p-6 rounded-xl font-mono text-xs h-full leading-relaxed overflow-x-auto border border-[#30363d]">
                  <span className="text-[#ff7b72]">curl</span> -X POST https://api.smartai.example.com/v1/infer \has
                  <br/>  -H <span className="text-[#a5d6ff]">"Authorization: Bearer YOUR_API_KEY"</span> \has
                  <br/>  -H <span className="text-[#a5d6ff]">"Content-Type: application/json"</span> \has
                  <br/>  -d <span className="text-[#a5d6ff]">'{'{'}"payload": "&lt;order&gt;&lt;id&gt;123&lt;/id&gt;&lt;/order&gt;"{'}'}'</span>
                  <br/><br/>
                  <span className="text-[#8b949e]"># Response</span><br/>
                  {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-[#7ee787]">"status"</span>: <span className="text-[#a5d6ff]">"success"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-[#7ee787]">"inferred_schema"</span>: <span className="text-[#a5d6ff]">"..."</span>,<br/>
                  &nbsp;&nbsp;<span className="text-[#7ee787]">"confidence_score"</span>: <span className="text-[#79c0ff]">0.998</span><br/>
                  {'}'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiReference;
