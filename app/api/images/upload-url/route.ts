import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const accountId = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string;
    const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: "Cloudflare Images env vars missing" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Images upload URL error: ${res.status} ${text}` },
        { status: 500 }
      );
    }

    const json = await res.json();
    // { result: { id, uploadURL }, success: true, ... }
    return NextResponse.json({
      id: json?.result?.id,
      uploadURL: json?.result?.uploadURL,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create images upload URL" },
      { status: 500 }
    );
  }
}


