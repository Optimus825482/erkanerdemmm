import { NextRequest, NextResponse } from "next/server";
import { createVisitorLog, getAllVisitorLogs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getAllVisitorLogs());
  } catch (e) {
    console.error("[api/visitor] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    createVisitorLog({
      ip: body.ip || "",
      city: body.city || "",
      country: body.country || "",
      isp: body.isp || "",
      user_agent: body.user_agent || "",
      browser: body.browser || "",
      os: body.os || "",
      device_type: body.device_type || "",
      platform: body.platform || "",
      language: body.language || "",
      screen: body.screen || "",
      timezone: body.timezone || "",
      referrer: body.referrer || "",
      connection_type: body.connection_type || "",
      cores: body.cores || 0,
      ram: body.ram || "",
      page: body.page || "",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/visitor] POST error:", e);
    return NextResponse.json({ ok: false });
  }
}
