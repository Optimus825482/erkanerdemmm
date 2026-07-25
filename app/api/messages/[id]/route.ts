import { NextRequest, NextResponse } from "next/server";
import { getMessage, markMessageRead, deleteMessage } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const msg = getMessage(Number(id));
  if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  markMessageRead(Number(id));
  return NextResponse.json(msg);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  deleteMessage(Number(id));
  return NextResponse.json({ ok: true });
}
