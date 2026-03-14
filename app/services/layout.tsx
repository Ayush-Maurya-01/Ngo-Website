import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Empowerment through Education",
  description: "Explore our free educational programs, health awareness camps, and environmental initiatives designed to empower communities.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
