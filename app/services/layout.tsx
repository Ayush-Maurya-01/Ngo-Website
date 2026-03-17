import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Empowerment through Education",
  description: "Explore our free educational programs, health awareness camps, and environmental initiatives designed to empower communities.",
  keywords: ["Free Tuition NGO", "Computer Literacy Classes", "Blood Donation Camp India", "Tree Plantation Drives NGO", "Women Empowerment Services", "Legal Aid Services", "Our Services PCHRR", "Skill Development India"],
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
