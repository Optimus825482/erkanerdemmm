import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getAllProjects());
  } catch (e) {
    console.error("[api/projects] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = createProject({
    title: body.title || "",
    category: body.category || "web",
    category_label: body.category_label || "WEB",
    image: body.image || "",
    description: body.description || "",
    tags: JSON.stringify(body.tags || []),
    year: body.year || "",
    featured: body.featured ? 1 : 0,
    sort_order: body.sort_order || 0,
  });
  return NextResponse.json({ id }, { status: 201 });
}
