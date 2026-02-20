const sdks = [
  {
    language: "TypeScript / Node",
    packageName: "@dealo/sdk",
    install: "npm install @dealo/sdk",
    snippet: `import { Dealo } from "@dealo/sdk";

const dealo = new Dealo({ apiKey: process.env.DEALO_KEY! });
const job = await dealo.jobs.create({ title: "Solutions Engineer" });`,
  },
  {
    language: "Python",
    packageName: "dealo-sdk",
    install: "pip install dealo-sdk",
    snippet: `from dealo import Dealo

dealo = Dealo(api_key=os.environ["DEALO_KEY"])
talent = dealo.talent.match(role="Product Designer")`,
  },
  {
    language: "Kotlin",
    packageName: "com.dealo.sdk",
    install: "implementation(\"com.dealo:sdk:1.4.0\")",
    snippet: `val client = Dealo(apiKey = BuildConfig.DEALO_KEY)
val result = client.learning.course("course_123").progress(userId)`,
  },
];

export default function SDKsPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Tools
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white leading-[1.1]">
          SHIP FASTER <br />
          <span className="text-emerald-500">OFFICIAL SDKS</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium text-white/40 leading-relaxed">
          All SDKs share the same auth layer, retries, and telemetry hooks. Each ships with TypeScript definitions or Pydantic models for strict typing.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {sdks.map((sdk) => (
          <div
            key={sdk.language}
            className="group relative flex flex-col rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-inner"
          >
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">
                {sdk.language}
              </p>
              <h2 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                {sdk.packageName}
              </h2>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">Install</p>
                <code className="block rounded-xl bg-black/80 border border-white/5 px-4 py-3 font-mono text-xs text-emerald-400 shadow-xl group-hover:border-emerald-500/20 transition-all">
                  {sdk.install}
                </code>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">Usage</p>
                <pre className="h-48 overflow-auto rounded-2xl bg-black/80 border border-white/5 p-5 text-[11px] font-mono text-blue-400 shadow-xl group-hover:border-emerald-500/20 transition-all custom-scrollbar">
                  {sdk.snippet}
                </pre>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for more SDKs */}
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/10 p-8 text-center bg-white/[0.01]">
          <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4">
            <span className="text-white/20 font-black">+</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">More SDKs Coming Soon</p>
        </div>
      </div>
    </div>
  );
}


