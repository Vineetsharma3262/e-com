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
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata = {
  title: {
    default: "Your Brand — Men's & Women's Clothing, Footwear and Leather Bags",
    template: "%s — Your Brand",
  },
  description:
    "Everyday tees and kurtis, shirts and denim, sneakers, sandals, leather bags and accessories, hand-picked by Your Brand and delivered across India.",
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
