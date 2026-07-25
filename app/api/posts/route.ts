import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getAllPosts());
  } catch (e) {
    console.error("[api/posts] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = createPost({
    glyph: body.glyph || "",
    color: body.color || "#00f0ff",
    title: body.title || "",
    date:
      body.date ||
      new Date()
        .toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase(),
    read_time: body.read_time || "5 DK",
    tags: JSON.stringify(body.tags || []),
    excerpt: body.excerpt || "",
    content: body.content || "",
    thumbnail: body.thumbnail || "",
    featured: body.featured ? 1 : 0,
    sort_order: body.sort_order || 0,
  });
  return NextResponse.json({ id }, { status: 201 });
}
