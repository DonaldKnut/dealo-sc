import Link from "next/link";

const resources = [
  {
    title: "Jobs API",
    summary: "Create, publish, and manage roles for bulk hiring and freelance engagements.",
    endpoints: ["/v1/jobs", "/v1/jobs/{id}", "/v1/jobs/{id}/publish"],
  },
  {
    title: "Talent Graph",
    summary: "Search, score, and shortlist verified professionals using AI filters.",
    endpoints: ["/v1/talent/search", "/v1/talent/{id}", "/v1/talent/matches"],
  },
  {
    title: "Learning & Certifications",
    summary: "Issue certificates, sync completions, and retrieve learner progress analytics.",
    endpoints: ["/v1/learning/courses", "/v1/learning/certificates"],
  },
];

export default function ApiReferencePage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          API Reference
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white leading-[1.1]">
          REST & <br />
          <span className="text-emerald-500">GRAPHQL-READY</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium text-white/40 leading-relaxed">
          Our OpenAPI spec lives in <code className="rounded-lg bg-emerald-500/10 px-2 py-1 text-emerald-400 border border-emerald-500/20 font-bold">/swagger.json</code>.
          Use the playground below or import the file into Postman, Insomnia, or your API gateway.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            href="/swagger.json"
            className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-white/5"
          >
            Download OpenAPI Spec
          </Link>
          <a
            href="https://generator.swagger.io/"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Generate SDK
          </a>
        </div>
      </header>

      <section className="relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-10 shadow-2xl overflow-hidden group shadow-inner">
        <div className="absolute top-0 right-0 p-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="space-y-4 max-w-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Live Explorer</p>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">COMING SOON</h3>
          <p className="text-sm font-medium leading-relaxed text-white/40">
            We&apos;re wiring up an interactive explorer that mounts the OpenAPI document from <code>/swagger.json</code>.
            It will support authenticated requests with your dashboard key and show typed responses.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Core Resources</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <section className="space-y-8">
        {resources.map((resource) => (
          <div
            key={resource.title}
            className="group relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-inner"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                    {resource.title}
                  </h2>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    REST
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/40 group-hover:text-white/60 transition-colors max-w-xl">
                  {resource.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
                {resource.endpoints.map((endpoint) => (
                  <span
                    key={endpoint}
                    className="rounded-xl bg-black/80 px-4 py-2 text-emerald-400 border border-white/5 group-hover:border-emerald-500/20 transition-all shadow-xl"
                  >
                    {endpoint}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}


