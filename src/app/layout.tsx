import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "K-Tour Guide",
  description: "Your Korean Travel Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
