import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming & Past Events",
  description: "Stay updated with PCHR&R's latest community workshops, legal awareness drives, and health seminars. Join our upcoming initiatives.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
