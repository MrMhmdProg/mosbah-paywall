import { getCurrentToolLink, setCurrentToolLink } from "@/lib/codes";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة." }, { status: 401 });
  }
  const link = await getCurrentToolLink();
  return NextResponse.json({ link });
}

export async function POST(req) {
  const { password, link } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة." }, { status: 401 });
  }
  if (!link || !link.startsWith("http")) {
    return NextResponse.json({ error: "الرابط غير صالح." }, { status: 400 });
  }
  await setCurrentToolLink(link);
  return NextResponse.json({ ok: true });
}
