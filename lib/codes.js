import { kv } from "@vercel/kv";

// Generates a random 5-digit code (10000-99999) that isn't already taken.
export async function generateUniqueCode() {
  for (let i = 0; i < 20; i++) {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    const existing = await kv.get(`code:${code}`);
    if (!existing) return code;
  }
  throw new Error("تعذر إنشاء رمز فريد، حاول مرة أخرى.");
}

// Get (or create) the personal code tied to a Stripe subscription id.
export async function getOrCreateCodeForSubscription(subscriptionId) {
  const existingCode = await kv.get(`sub:${subscriptionId}`);
  if (existingCode) return existingCode;

  const code = await generateUniqueCode();
  await kv.set(`code:${code}`, subscriptionId);
  await kv.set(`sub:${subscriptionId}`, code);
  return code;
}

export async function getSubscriptionForCode(code) {
  return kv.get(`code:${code}`);
}

export async function getCurrentToolLink() {
  const link = await kv.get("current_gemini_link");
  return link || null;
}

export async function setCurrentToolLink(link) {
  await kv.set("current_gemini_link", link);
}
