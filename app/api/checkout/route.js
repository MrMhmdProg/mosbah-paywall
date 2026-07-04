import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`,
    locale: "ar",
  });

  return NextResponse.redirect(session.url, 303);
}
