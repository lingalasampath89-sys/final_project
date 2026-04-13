import React from 'react';
import { ShieldAlert, Lock, Server } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <ShieldAlert className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="p-6 border border-border rounded-xl bg-secondary/20 mb-12">
          <p className="text-sm text-muted-foreground font-mono">
            <strong>Last Updated:</strong> March 23, 2026<br/>
            <strong>Document Identifier:</strong> POL-SEC-01-2026
          </p>
        </div>

        <div className="space-y-12 prose dark:prose-invert max-w-none text-muted-foreground/90">
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-2 mb-6">
              <Server className="w-5 h-5 text-primary" /> 1. Data Ingestion & Retention
            </h2>
            <p className="leading-relaxed">
              When processing XML payloads through the SmartAI engine, we stream data exclusively in memory. Raw payload data is never written to disk unless explicitly saved to your persistent Workspace Dashboard. Short-term caching is employed solely for parsing large documents, and clears immediately upon node disconnect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-2 mb-6">
              <Lock className="w-5 h-5 text-primary" /> 2. Model Training & Telemetry
            </h2>
            <p className="leading-relaxed">
              We highly respect the sensitivity of enterprise XML (including PII, financial ledgers, and healthcare records). The global Neural Engine is <strong>never</strong> fine-tuned on user-submitted data. Telemetry is restricted entirely to structural metadata (e.g., tag frequency, nesting depth, error typologies) rather than the literal node text content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">3. Third-Party Integrations</h2>
            <p className="leading-relaxed">
              Google OAuth is utilized strictly for identity verification. We retrieve minimal profile assertions (email, name, avatar). Your inference history and API keys are heavily hashed within our Supabase managed infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-6">4. Contacting the DPO</h2>
            <p className="leading-relaxed">
              If you require a Data Processing Addendum (DPA) or have GDPR/CCPA requests regarding your account telemetry, please contact our Data Protection Officer at <span className="text-primary font-bold">privacy@smartai.example.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
