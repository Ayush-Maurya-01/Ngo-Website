import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human Rights & Knowledge Hub",
  description: "Access a repository of articles, guides, and resources on fundamental rights, duties, and social justice in India.",
  alternates: {
    canonical: "/human-rights",
  },
};

export default function HumanRightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
