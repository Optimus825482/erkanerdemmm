import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword, setAdminPassword } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === "login") {
      const pass = getAdminPassword();
      if (body.password === pass) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { ok: false, error: "Hatalı şifre" },
        { status: 401 },
      );
    }

    if (action === "change") {
      const current = getAdminPassword();
      if (body.current !== current) {
        return NextResponse.json(
          { ok: false, error: "Mevcut şifre yanlış" },
          { status: 403 },
        );
      }
      if (!body.newPassword || body.newPassword.length < 4) {
        return NextResponse.json(
          { ok: false, error: "Yeni şifre en az 4 karakter olmalı" },
          { status: 400 },
        );
      }
      setAdminPassword(body.newPassword);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Bilinmeyen action" },
      { status: 400 },
    );
  } catch (e) {
    console.error("[api/auth] POST error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
