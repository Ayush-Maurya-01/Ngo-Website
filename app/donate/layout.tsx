import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate & Support Our Mission",
  description: "Your contributions fund education, health camps, and environmental sustainability. Support PCHR&R and change lives today.",
  alternates: {
    canonical: "/donate",
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
