import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with PCHR&R for queries, collaborations, or to learn more about our work. We're here to listen and help.",
  keywords: ["Contact PCHRR", "NGO phone number", "NGO email address", "Collaborate with NGO India", "Partner with PCHRR", "Headquarters NGO Delhi"],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
