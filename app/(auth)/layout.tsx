import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
const inter = Inter({ subsets: ["latin"] });
import ToastContext from "@/components/ToastContext";
import Provider from "@/components/Provider";
export const metadata: Metadata = {
  title: "Auth Halo Chat",
  description: "Build a next 14 Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider>
          <ToastContext />
          {children}
      </Provider>

      </body>
    </html>
  );
}
