import { NextRequest, NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = getPost(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.glyph !== undefined) update.glyph = body.glyph;
  if (body.color !== undefined) update.color = body.color;
  if (body.title !== undefined) update.title = body.title;
  if (body.date !== undefined) update.date = body.date;
  if (body.read_time !== undefined) update.read_time = body.read_time;
  if (body.tags !== undefined) update.tags = JSON.stringify(body.tags);
  if (body.excerpt !== undefined) update.excerpt = body.excerpt;
  if (body.content !== undefined) update.content = body.content;
  if (body.thumbnail !== undefined) update.thumbnail = body.thumbnail;
  if (body.featured !== undefined) update.featured = body.featured ? 1 : 0;
  if (body.sort_order !== undefined) update.sort_order = body.sort_order;
  updatePost(Number(id), update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  deletePost(Number(id));
  return NextResponse.json({ ok: true });
}
