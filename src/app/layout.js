import "./globals.css";

export const metadata = {
  title: "SwiftBag | Shop at the comfort of your Home",
  description: "Premium on-demand S&R personal shopper and delivery service in CDO.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body 
        className="min-h-full flex flex-col bg-[#0a0a09] text-white"
        style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}