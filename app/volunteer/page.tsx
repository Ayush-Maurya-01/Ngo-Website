import { Metadata } from "next";
import VolunteerClient from "./volunteer-client";

export const metadata: Metadata = {
  title: "Volunteer With Us | Make a Difference",
  description: "Join PCHR&R's volunteer community. Help us promote human rights through education, environmental action, and social welfare programs in India.",
  keywords: ["Volunteer NGO India", "Social Work Opportunities", "PCHR&R Volunteer", "Community Service Delhi"],
};

export default function VolunteerPage() {
  return <VolunteerClient />;
}
