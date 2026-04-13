import React from 'react';
import { BookOpen, Code, Key, Zap, FileJson } from 'lucide-react';

const Docs = () => {
  return (
    <div className="container py-16 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold">Documentation</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 border-r border-border pr-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Getting Started</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="text-primary font-medium">Introduction</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Quickstart Guide</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Authentication</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Core Concepts</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Schema Inference</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Neural Repair Engine</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Batch Processing</li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-3 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Introduction to SmartAI XML Inference</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Welcome to the official documentation for the SmartAI inference network. Our platform leverages adaptive hierarchical ML layers to autonomously reconstruct XML structures with 99.8% structural integrity, making broken, corrupted, or schema-less XML data parseable and type-safe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
             <div className="p-6 rounded-xl border border-border bg-card/50">
                <Zap className="w-6 h-6 text-yellow-500 mb-4" />
                <h3 className="font-bold mb-2">Lightning Fast Inference</h3>
                <p className="text-sm text-muted-foreground">Our distributed intelligence nodes can parse and repair millions of missing end-tags per second.</p>
             </div>
             <div className="p-6 rounded-xl border border-border bg-card/50">
                <Code className="w-6 h-6 text-emerald-500 mb-4" />
                <h3 className="font-bold mb-2">Schema Generation</h3>
                <p className="text-sm text-muted-foreground">Automatically derive XSD schemas from unstructured XML dumps accurately.</p>
             </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-foreground">How it Works</h2>
          <p className="text-muted-foreground mb-4">
            The core engine uses advanced token predictive models to understand the structural intent of an XML payload. Instead of failing immediately upon reading a bad token, the system hallucinates the most mathematically probable fix and applies it.
          </p>
          <div className="bg-secondary/50 p-6 rounded-lg font-mono text-sm border border-border mb-8">
            <span className="text-muted-foreground"># Example: Repairing malformed XML</span><br/>
            <span className="text-primary">const</span> result = <span className="text-primary">await</span> smartAI.repair(<span className="text-green-500">"&lt;root&gt;&lt;item&gt;Data&lt;/root&gt;"</span>);<br/>
            console.log(result.xml); <span className="text-muted-foreground">// Outputs: &lt;root&gt;&lt;item&gt;Data&lt;/item&gt;&lt;/root&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
