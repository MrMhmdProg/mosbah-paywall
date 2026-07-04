import { stripe } from "@/lib/stripe";
import { getOrCreateCodeForSubscription } from "@/lib/codes";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id مفقود" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ pending: true });
  }

  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    return NextResponse.json({ pending: true });
  }

  // The webhook usually creates the code milliseconds after this, but as a
  // safety net we also create it here if it hasn't arrived yet.
  const code = await getOrCreateCodeForSubscription(subscriptionId);
  return NextResponse.json({ code });
}
