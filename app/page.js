import "./globals.css";

export default function HomePage() {
  return (
    <div className="card">
      <h1>مصباح العلم</h1>
      <p className="sub">اشترك للحصول على رمزك الشخصي المكوّن من 5 أرقام، والوصول إلى أداة المساعد التعليمي.</p>

      <div className="price">10$ <span>/ شهرياً</span></div>

      <form action="/api/checkout" method="POST">
        <button type="submit">الاشتراك الآن</button>
      </form>

      <p className="footer-note">
        الدفع يتم بشكل آمن عبر Stripe. لن تُخزَّن بيانات بطاقتك على هذا الموقع.
        <br />
        بعد الدفع ستحصل فوراً على رمزك المكوّن من 5 أرقام.
        <br />
        هل لديك رمز بالفعل؟ <a href="/access">ادخل من هنا</a>
      </p>
    </div>
  );
}
