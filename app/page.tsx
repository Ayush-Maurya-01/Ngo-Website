import { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "PCHR&R | Possible Centre for Human Rights & Responsibilities",
  description: "PCHR&R is a leading NGO in India dedicated to human rights, quality education, legal aid, and environmental sustainability. Join our mission for a better society.",
  keywords: ["NGO India", "Human Rights NGO", "Social Welfare Delhi", "PCHR&R", "Community Empowerment"],
};

export default function HomePage() {
  return <HomeClient />;
}
