const events = [
  {
    name: "job.match.created",
    description: "Triggered when the talent graph finds new candidates.",
  },
  {
    name: "application.status.updated",
    description: "Sent when a candidate advances or is rejected.",
  },
  {
    name: "learning.completion.recorded",
    description: "Emitted when a learner completes a certification module.",
  },
];

export default function WebhooksPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Events
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white leading-[1.1]">
          REAL-TIME <br />
          <span className="text-emerald-500 text-3xl md:text-4xl">WEBHOOK SIGNALS</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium text-white/40 leading-relaxed">
          Deliver events to your HTTPS endpoints with at-least-once delivery. All payloads ship with an HMAC signature header you can verify using your signing secret.
        </p>
      </header>

      <section className="relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-10 shadow-2xl overflow-hidden group shadow-inner">
        <div className="space-y-4 max-w-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Security First</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">SIGNING SECRET VERIFICATION</h3>
          <p className="text-sm font-medium leading-relaxed text-white/40">
            Find the secret in Dashboard → Developers → Webhooks. Hash the raw request body with SHA-256 and compare to{" "}
            <code className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20 font-bold">x-dealo-signature</code>.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Event Catalog</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <div
            key={event.name}
            className="group relative flex items-center justify-between gap-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-inner"
          >
            <div className="space-y-1">
              <p className="font-mono text-sm font-black text-emerald-400 tracking-tight group-hover:text-white transition-colors">
                {event.name}
              </p>
              <p className="text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors">
                {event.description}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


