"use client";
import { useEffect, useState } from "react";
import "../globals.css";

export default function SuccessPage() {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setError("لم يتم العثور على معلومات الدفع.");
      return;
    }

    let attempts = 0;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/get-code?session_id=${sessionId}`);
        const data = await res.json();
        if (data.code) {
          setCode(data.code);
          return;
        }
      } catch (e) {
        // ignore, retry
      }
      if (attempts < 10) {
        setTimeout(poll, 1500);
      } else {
        setError("حدث تأخير في تجهيز رمزك. يرجى تحديث الصفحة خلال دقيقة.");
      }
    };
    poll();
  }, []);

  return (
    <div className="card">
      <h1>تم الدفع بنجاح 🎉</h1>
      <p className="sub">هذا رمزك الشخصي المكوّن من 5 أرقام. احتفظ به، فهو مرتبط باشتراكك.</p>

      {!code && !error && <p className="sub">...جارٍ تجهيز رمزك</p>}
      {error && <p className="msg-error">{error}</p>}
      {code && (
        <>
          <p className="msg-ok" style={{ marginBottom: 0 }}>
            📸 صوّر هذه الشاشة الآن قبل المتابعة
          </p>
          <div className="code-box">{code}</div>
        </>
      )}

      {code && (
        <a className="btn" href="/access">
          الانتقال إلى صفحة الدخول
        </a>
      )}
      <p className="footer-note">
        سيبقى هذا الرمز فعّالاً طالما اشتراكك الشهري نشط. سيتم الخصم تلقائياً كل شهر.
        <br />
        ⚠️ خذ لقطة شاشة (Screenshot) لهذا الرمز الآن واحتفظ بها في مكان آمن، فلن نتمكن من إرساله لك مرة أخرى إذا فقدته.
      </p>
    </div>
  );
}
