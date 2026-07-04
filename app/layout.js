export const metadata = {
  title: "مصباح العلم — الاشتراك",
  description: "اشترك للحصول على رمز الدخول الخاص بك",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
