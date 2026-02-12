import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "K-Tour Guide",
  description: "Your Korean Travel Companion",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066CC" />
      </head>
      <body className="antialiased bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg relative">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
