import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Confinity",
  description: "Video calling App",
  icons: {
    icon: "/icons/confinity.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "/icons/confinity.svg",
          },
          variables: {
            colorText: "#000000",
            colorPrimary: "#0E78F9",
            colorBackground: "#ffff",
            colorInputBackground: "#ffff",
            colorInputText: "#000000",
          },
        }}
      >
        {/* <body className={`${inter.className} bg-white`}> */}
        <body className={`${inter.className} bg-dark-2`}>
          <Toaster />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}