import { Code, KeyRound, Server } from "lucide-react";

const steps = [
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Create an API key",
    body: "Visit the dashboard → Settings → API keys. Generate a live and sandbox key pair. Keys are scoped to workspace roles.",
  },
  {
    icon: <Server className="h-5 w-5" />,
    title: "Choose an environment",
    body: "Use https://sandbox.api.dealo.africa for non-production requests. Traffic is rate-limited but mirrors production data models.",
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "Send your first request",
    body: "POST /v1/jobs with a title, location, and description. You’ll receive a job id you can publish or sync with ATS partners.",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Getting started
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white leading-tight">
          LAUNCH IN <br />
          <span className="text-emerald-500 text-3xl md:text-4xl">THREE STEPS</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium text-white/40 leading-relaxed">
          Provision secure credentials, pick the right environment, and make your first hiring or credentialing API call using curl, Postman, or our SDKs.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative space-y-6 rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-inner"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              {step.icon}
            </div>
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                {step.title}
              </h2>
              <p className="text-xs font-medium leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
                {step.body}
              </p>
            </div>
            <div className="absolute top-4 right-8 text-[40px] font-black text-white/[0.03] pointer-events-none group-hover:text-emerald-500/5 transition-colors">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


