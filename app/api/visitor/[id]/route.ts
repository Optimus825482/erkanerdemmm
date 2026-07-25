import { NextRequest, NextResponse } from "next/server";
import { deleteVisitorLog } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  deleteVisitorLog(Number(id));
  return NextResponse.json({ ok: true });
}
