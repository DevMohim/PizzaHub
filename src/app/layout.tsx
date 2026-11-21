import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";
import { MotionConfig } from "motion/react";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaHub | Fresh Pizza, Delivered",
  description:
    "Order freshly made pizza from PizzaHub. Choose your favorites and get them delivered hot to your door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Navbar />
            <div className="flex-1">
              <MotionProvider>{children}</MotionProvider>
            </div>

            <Toaster position="bottom-right" />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
