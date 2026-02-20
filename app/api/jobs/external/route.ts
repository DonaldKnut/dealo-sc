import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Provider = "remotive" | "arbeitnow" | "greenhouse";

function getProvider(): Provider {
  const p = (process.env.JOBS_API_PROVIDER || "remotive").toLowerCase();
  if (p === "arbeitnow" || p === "greenhouse") return p;
  return "remotive";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const remote = searchParams.get("remote") || ""; // "true" | "false"

    const provider = getProvider();

    let targetUrl = "";
    if (provider === "remotive") {
      // https://remotive.com/api/remote-jobs?search=frontend
      const base =
        process.env.JOBS_API_URL || "https://remotive.com/api/remote-jobs";
      const sp = new URLSearchParams();
      if (query) sp.set("search", query);
      // Remotive is mostly remote; include location in search if provided
      if (location) sp.set("search", `${query} ${location}`.trim());
      targetUrl = `${base}?${sp.toString()}`;
    } else if (provider === "arbeitnow") {
      // https://arbeitnow.com/api/job-board-api
      const base =
        process.env.JOBS_API_URL || "https://arbeitnow.com/api/job-board-api";
      targetUrl = base; // no search params supported directly; client-side filter
    } else if (provider === "greenhouse") {
      // Greenhouse requires per-company boards; leave URL configurable
      const base = process.env.JOBS_API_URL || "";
      if (!base)
        return NextResponse.json(
          { success: false, message: "Set JOBS_API_URL for greenhouse" },
          { status: 400 }
        );
      targetUrl = base;
    }

    const headers: Record<string, string> = {};
    if (process.env.JOBS_API_KEY)
      headers["Authorization"] = `Bearer ${process.env.JOBS_API_KEY}`;

    const upstream = await fetch(targetUrl, { headers, cache: "no-store" });
    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { success: false, message: text || "Upstream error" },
        { status: upstream.status }
      );
    }
    const data = await upstream.json();

    // Normalize results
    let items: any[] = [];
    if (provider === "remotive") {
      items = (data?.jobs || []).map((j: any) => ({
        id: j.id || j.job_id || crypto.randomUUID(),
        title: j.title,
        company: j.company_name,
        location: j.candidate_required_location || j.job_type || "Remote",
        salary: j.salary || "—",
        type: j.job_type || "Remote",
        experience: "—",
        posted: j.publication_date,
        description: j.description,
        skills: (j.tags || [])
          .map((t: any) => (typeof t === "string" ? t : t?.name))
          .filter(Boolean),
        url: j.url,
      }));
    } else if (provider === "arbeitnow") {
      items = (data?.data || []).map((j: any) => ({
        id: j.slug || j.id || crypto.randomUUID(),
        title: j.title,
        company: j.company,
        location: j.location || j.remote ? "Remote" : "",
        salary: "—",
        type: j.remote ? "Remote" : "On-site",
        experience: "—",
        posted: j.created_at,
        description: j.description,
        skills: j.tags || [],
        url: j.url,
      }));
    } else if (provider === "greenhouse") {
      // Expect caller to set a unified JSON from their Greenhouse board
      items = (
        Array.isArray(data) ? data : data?.jobs || data?.results || []
      ).map((j: any) => ({
        id: j.id || j.identifier || crypto.randomUUID(),
        title: j.title,
        company: j.company || j.organization || "",
        location: j.location?.name || j.location || "",
        salary: j.salary || "—",
        type: j.type || "—",
        experience: j.experience || "—",
        posted: j.updated_at || j.posted_at || j.created_at,
        description: j.content || j.description,
        skills: [],
        url: j.absolute_url || j.url,
      }));
    }

    // Basic server-side filtering for search/location if provider doesn't support
    const filtered = items.filter((j) => {
      const s = query.toLowerCase();
      const loc = location.toLowerCase();
      const searchOk =
        !s ||
        `${j.title} ${j.company} ${j.description}`.toLowerCase().includes(s);
      const locOk = !loc || `${j.location}`.toLowerCase().includes(loc);
      const remoteOk =
        !remote ||
        (remote === "true"
          ? j.type?.toLowerCase().includes("remote") ||
            j.location?.toLowerCase().includes("remote")
          : true);
      return searchOk && locOk && remoteOk;
    });

    return NextResponse.json({ success: true, jobs: filtered });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
