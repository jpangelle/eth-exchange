import { Providers } from "@/components//Providers";
import { Header } from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ethereum Exchange",
  description: "Buy Etherum with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <AppShell header={{ height: 60 }} padding="md">
              <AppShellHeader px={16}>
                <Header />
              </AppShellHeader>
              <AppShellMain h={1}>{children}</AppShellMain>
            </AppShell>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
