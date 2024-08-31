import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "@/components/Provider";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halo Chat App",
  description: "A NextJS 14 Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
      <Provider>
        <TopBar/>
        {children}
        <BottomBar/>
        </Provider>
        </body>
    </html>
  );
}
