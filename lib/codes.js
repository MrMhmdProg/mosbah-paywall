import { getStore } from "@netlify/blobs";

// One shared "store" (like a small key-value table) for all our data.
function store() {
  return getStore("mosbah-codes");
}

// Generates a random 5-digit code (10000-99999) that isn't already taken.
export async function generateUniqueCode() {
  const s = store();
  for (let i = 0; i < 20; i++) {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    const existing = await s.get(`code:${code}`);
    if (!existing) return code;
  }
  throw new Error("تعذر إنشاء رمز فريد، حاول مرة أخرى.");
}

// Get (or create) the personal code tied to a Stripe subscription id.
export async function getOrCreateCodeForSubscription(subscriptionId) {
  const s = store();
  const existingCode = await s.get(`sub:${subscriptionId}`);
  if (existingCode) return existingCode;

  const code = await generateUniqueCode();
  await s.set(`code:${code}`, subscriptionId);
  await s.set(`sub:${subscriptionId}`, code);
  return code;
}

export async function getSubscriptionForCode(code) {
  return store().get(`code:${code}`);
}

export async function getCurrentToolLink() {
  const link = await store().get("current_gemini_link");
  return link || null;
}

export async function setCurrentToolLink(link) {
  await store().set("current_gemini_link", link);
}
