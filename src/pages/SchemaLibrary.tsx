import React from 'react';
import { Database, Search, FileText, CheckCircle2 } from 'lucide-react';

const schemas = [
  { name: 'RSS 2.0', category: 'Syndication', confidence: '99.9%', description: 'Standard RSS feed schema definitions used universally.' },
  { name: 'SOAP 1.2', category: 'Web Services', confidence: '99.5%', description: 'Enterprise-grade SOAP envelope validation metrics.' },
  { name: 'MathML 3.0', category: 'Scientific', confidence: '98.2%', description: 'Mathematical markup language definitions for web rendering.' },
  { name: 'SVG 1.1', category: 'Graphics', confidence: '99.8%', description: 'Scalable Vector Graphics internal path parsing logic.' },
  { name: 'XHTML Strict', category: 'Web', confidence: '99.9%', description: 'Rigid adherence model for valid XHTML documents.' },
  { name: 'DocBook', category: 'Publishing', confidence: '97.5%', description: 'Technical documentation definitions.' },
];

const SchemaLibrary = () => {
  return (
    <div className="container py-16 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Schema Library</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our vast repository of pre-trained models tuned for specific, globally-recognized XML standards. Perfect for zero-shot inference.
          </p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search schemas..." 
            className="pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemas.map((schema, idx) => (
          <div key={idx} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-secondary rounded-full text-secondary-foreground">
                {schema.category}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{schema.name}</h3>
            <p className="text-muted-foreground text-sm mb-6 h-10">{schema.description}</p>
            
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-muted-foreground">Inference Confidence</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> {schema.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaLibrary;
