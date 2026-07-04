"use client";
import { useState } from "react";
import "../globals.css";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ.");
        setLoading(false);
        return;
      }
      window.location.href = data.link;
    } catch (err) {
      setError("تعذر الاتصال بالخادم.");
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>الدخول إلى الأداة</h1>
      <p className="sub">أدخل رمزك الشخصي المكوّن من 5 أرقام للوصول إلى مصباح العلم.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="00000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <button type="submit" disabled={loading || code.length !== 5}>
          {loading ? "...جارٍ التحقق" : "دخول"}
        </button>
      </form>

      {error && <p className="msg-error">{error}</p>}

      <p className="footer-note">
        ليس لديك رمز؟ <a href="/">اشترك من هنا</a>
      </p>
    </div>
  );
}
