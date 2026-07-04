"use client";
import { useState } from "react";
import "../globals.css";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [currentLink, setCurrentLink] = useState(null);
  const [status, setStatus] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  async function unlock(e) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", text: data.error });
      return;
    }
    setCurrentLink(data.link || "(لا يوجد رابط محفوظ بعد)");
    setUnlocked(true);
  }

  async function updateLink(e) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, link }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", text: data.error });
      return;
    }
    setCurrentLink(link);
    setStatus({ type: "ok", text: "تم تحديث الرابط بنجاح." });
    setLink("");
  }

  if (!unlocked) {
    return (
      <div className="card">
        <h1>لوحة التحكم</h1>
        <p className="sub">هذه الصفحة لك أنت فقط.</p>
        <form onSubmit={unlock}>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">دخول</button>
        </form>
        {status?.type === "error" && <p className="msg-error">{status.text}</p>}
      </div>
    );
  }

  return (
    <div className="card">
      <h1>تحديث رابط الأداة</h1>
      <p className="sub">الرابط الحالي:</p>
      <p style={{ wordBreak: "break-all", color: "var(--gold-bright)" }}>{currentLink}</p>

      <form onSubmit={updateLink}>
        <input
          type="text"
          placeholder="الصق الرابط الجديد هنا"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{ letterSpacing: "normal" }}
        />
        <button type="submit" disabled={!link}>
          حفظ الرابط الجديد
        </button>
      </form>
      {status?.type === "ok" && <p className="msg-ok">{status.text}</p>}
      {status?.type === "error" && <p className="msg-error">{status.text}</p>}
    </div>
  );
}
