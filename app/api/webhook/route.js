import { stripe } from "@/lib/stripe";
import { getOrCreateCodeForSubscription } from "@/lib/codes";
import { NextResponse } from "next/server";

// Stripe needs the raw request body to verify the webhook signature.
export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.payment_succeeded"
  ) {
    const subscriptionId =
      event.data.object.subscription || event.data.object.id;
    if (subscriptionId) {
      try {
        await getOrCreateCodeForSubscription(subscriptionId);
      } catch (err) {
        console.error("Failed to generate code:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
