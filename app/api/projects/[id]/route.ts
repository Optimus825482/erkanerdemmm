import { NextRequest, NextResponse } from "next/server";
import { getProject, updateProject, deleteProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = getProject(Number(id));
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.category !== undefined) update.category = body.category;
  if (body.category_label !== undefined)
    update.category_label = body.category_label;
  if (body.image !== undefined) update.image = body.image;
  if (body.description !== undefined) update.description = body.description;
  if (body.tags !== undefined) update.tags = JSON.stringify(body.tags);
  if (body.year !== undefined) update.year = body.year;
  if (body.featured !== undefined) update.featured = body.featured ? 1 : 0;
  if (body.sort_order !== undefined) update.sort_order = body.sort_order;
  updateProject(Number(id), update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  deleteProject(Number(id));
  return NextResponse.json({ ok: true });
}
