import React from 'react';
import { FileSignature, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <div className="container py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Scale className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>
        
        <div className="p-6 border border-border rounded-xl bg-orange-500/10 mb-12 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
          <p className="text-sm text-muted-foreground">
            By provisioning an API key or signing into the SmartAI Dashboard, you are establishing a legally binding agreement with SmartAI Networks, Inc. Please read carefully.
          </p>
        </div>

        <div className="space-y-12 prose dark:prose-invert max-w-none text-muted-foreground/90">
          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">1. Usage Limitations & Quotas</h2>
            <p className="leading-relaxed">
              Users agree not to maliciously overload inference nodes. Free tier execution environments are subject to a maximum payload size of 50MB per inference request, and a rate limit of 10 requests per minute. Attempts to evade rate limits will result in an immediate cryptographic ban of the utilizing API key.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">2. Liability of Inference Models</h2>
            <p className="leading-relaxed">
              While our XML Schema Inference boasts statistical accuracies exceedingly high (99.8%), the output is fundamentally probabilistic. We are not liable for system failures, data corruption, or financial loss incurred by deploying unreviewed AI-generated schemas directly to production environments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">3. Enterprise SLAs</h2>
            <p className="leading-relaxed">
              Paid Pro and Enterprise tiers include a 99.99% Node Uptime Service Level Agreement. In the event API availability drops beneath this threshold within a calendar month, pro-rated service credits will be issued to the account holder.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">4. Intellectual Property</h2>
            <p className="leading-relaxed">
              You retain full ownership of any XSD, JsonSchema, or structurally inferred artifacts produced by our API acting upon your input data. You do not, however, maintain any rights to the underlying ML models, prompt structures, or containerized binaries operated by SmartAI.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
