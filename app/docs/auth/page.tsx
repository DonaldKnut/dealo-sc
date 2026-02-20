const flows = [
  {
    name: "API keys",
    detail: "Server-to-server requests authenticated with dashboard-issued keys. Keys rotate every 90 days; use the refresh endpoint to cycle programmatically.",
  },
  {
    name: "OAuth 2.0",
    detail: "Authorization Code with PKCE for marketplace sellers and hiring partners. Supports scoped permissions for jobs, payouts, and messaging.",
  },
  {
    name: "Service tokens",
    detail: "Short-lived JWTs signed with your workspace secret. Ideal for mobile or Edge functions; exchange API key for a token via /v1/auth/token.",
  },
];

export default function AuthPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Security
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white leading-[1.1]">
          SECURE EVERY <br />
          <span className="text-emerald-500">INTEGRATION</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium text-white/40 leading-relaxed">
          All requests must include an Authorization header. Pair auth with workspace-level IP allowlists, request signing, and audit logs streamed to your SIEM.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {flows.map((flow) => (
          <div key={flow.name} className="group relative space-y-4 rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{flow.name}</p>
            <p className="text-xs font-medium leading-relaxed text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-wider">{flow.detail}</p>
          </div>
        ))}
      </div>

      <section className="relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-10 shadow-2xl overflow-hidden group shadow-inner">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Example Header</p>
          </div>
          <pre className="overflow-auto rounded-3xl bg-black/80 p-8 text-sm font-mono text-emerald-400 border border-white/5 shadow-2xl">
            {`Authorization: Bearer sk_live_123
X-Dealo-Workspace: wrk_acme`}
          </pre>
        </div>
      </section>
    </div>
  );
}


