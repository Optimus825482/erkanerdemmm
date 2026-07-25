import { NextRequest, NextResponse } from "next/server";
import { getAllMessages, createMessage } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getAllMessages());
  } catch (e) {
    console.error("[api/messages] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "name, email, message gerekli" },
      { status: 400 },
    );
  }
  const id = createMessage({
    name: body.name,
    email: body.email,
    subject: body.subject || "",
    message: body.message,
  });
  return NextResponse.json({ id }, { status: 201 });
}
