import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer with Us | Be the Change",
  description: "Join our volunteer force and contribute your skills to meaningful projects. Apply now to help protect human rights and advance education.",
  alternates: {
    canonical: "/volunteer",
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
