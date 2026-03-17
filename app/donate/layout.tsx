import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate & Support Our Mission",
  description: "Your contributions fund education, health camps, and environmental sustainability. Support PCHR&R and change lives today.",
  keywords: ["Donate to NGO", "Charity Donation India", "80G Cash Exemption NGO", "Sponsor Child Education", "Support Health Camps", "CSR NGO India", "Donate Online PCHRR"],
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
