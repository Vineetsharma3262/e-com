import { DM_Sans, Fraunces } from "next/font/google";
import { Shell } from "@/components/Shell";
import { ShopProvider } from "@/components/ShopProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata = {
  title: {
    default: "Aurelle — Men's & Women's Clothing",
    template: "%s — Aurelle",
  },
  description:
    "T-shirts, shirts, two-piece and three-piece suits for men and women, from ₹200 to ₹9,500, delivered across India.",
};

const themeScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ShopProvider>
          <Shell>{children}</Shell>
        </ShopProvider>
      </body>
    </html>
  );
}
