import { NextRequest, NextResponse } from "next/server";
import { getContactInfo, updateContactInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getContactInfo());
  } catch (e) {
    console.error("[api/contact-info] GET error:", e);
    return NextResponse.json({
      email: "merhaba@erkanerdem.online",
      location: "Istanbul / Turkiye (UTC+3)",
      response_time: "< 24 saat",
      socials: "[]",
    });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.email !== undefined) update.email = body.email;
  if (body.location !== undefined) update.location = body.location;
  if (body.response_time !== undefined)
    update.response_time = body.response_time;
  if (body.socials !== undefined) update.socials = JSON.stringify(body.socials);
  updateContactInfo(update);
  return NextResponse.json({ ok: true });
}
