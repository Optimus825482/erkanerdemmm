import { NextRequest, NextResponse } from "next/server";
import { getAbout, updateAbout } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getAbout());
  } catch (e) {
    console.error("[api/about] GET error:", e);
    return NextResponse.json({
      name: "",
      location: "",
      experience: "",
      expertise: "",
      status: "",
      lead: "",
      bio1: "",
      bio2: "",
      bio3: "",
      avatar: "",
      skills: "[]",
      timeline: "[]",
    });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.location !== undefined) update.location = body.location;
  if (body.experience !== undefined) update.experience = body.experience;
  if (body.expertise !== undefined) update.expertise = body.expertise;
  if (body.status !== undefined) update.status = body.status;
  if (body.lead !== undefined) update.lead = body.lead;
  if (body.bio1 !== undefined) update.bio1 = body.bio1;
  if (body.bio2 !== undefined) update.bio2 = body.bio2;
  if (body.bio3 !== undefined) update.bio3 = body.bio3;
  if (body.avatar !== undefined) update.avatar = body.avatar;
  if (body.skills !== undefined) update.skills = JSON.stringify(body.skills);
  if (body.timeline !== undefined)
    update.timeline = JSON.stringify(body.timeline);
  updateAbout(update);
  return NextResponse.json({ ok: true });
}
