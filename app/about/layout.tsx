import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PCHR&R's story, our mission to protect human rights, and the dedicated team driving social change in India.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
