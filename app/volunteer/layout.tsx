import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer with Us | Be the Change",
  description: "Join our volunteer force and contribute your skills to meaningful projects. Apply now to help protect human rights and advance education.",
  keywords: ["Volunteer opportunities India", "Join NGO team", "NGO Internship Delhi", "Social work volunteering", "Teach for good", "Help local community", "Volunteer online NGO", "Volunteer offline Delhi"],
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
