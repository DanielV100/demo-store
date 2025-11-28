import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_EUGEN_API ?? "http://localhost:8000";
const API_PREFIX   = process.env.NEXT_PUBLIC_EUGEN_API_PREFIX ?? "/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { message: { role, content, at }, ... }

    // cookie-based conversation id
    let sid = req.cookies.get("eugen_session_id")?.value;
    if (!sid) sid = Math.random().toString(36).slice(2);

    const r = await fetch(`${BACKEND_URL}${API_PREFIX}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sid,
        prompt: body?.message?.content ?? "",
        k: 6,
      }),
    });

    const data = await r.json();
    const res = NextResponse.json(data, { status: r.status });

    res.cookies.set("eugen_session_id", sid, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "proxy failed" }, { status: 500 });
  }
}