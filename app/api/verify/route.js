import { stripe } from "@/lib/stripe";
import { getSubscriptionForCode, getCurrentToolLink } from "@/lib/codes";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { code } = await req.json();

  if (!code || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: "الرمز يجب أن يتكون من 5 أرقام." }, { status: 400 });
  }

  const subscriptionId = await getSubscriptionForCode(code);
  if (!subscriptionId) {
    return NextResponse.json({ error: "الرمز غير صحيح." }, { status: 404 });
  }

  let subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } catch (e) {
    return NextResponse.json({ error: "تعذر التحقق من الاشتراك." }, { status: 500 });
  }

  const activeStatuses = ["active", "trialing"];
  if (!activeStatuses.includes(subscription.status)) {
    return NextResponse.json(
      { error: "الاشتراك غير نشط حالياً. يرجى التأكد من إتمام الدفع." },
      { status: 403 }
    );
  }

  const link = await getCurrentToolLink();
  if (!link) {
    return NextResponse.json(
      { error: "الرابط غير متوفر حالياً، يرجى المحاولة لاحقاً." },
      { status: 503 }
    );
  }

  return NextResponse.json({ link });
}
