import { Metadata } from "next";
import HumanRightsClient from "./human-rights-client";

export const metadata: Metadata = {
  title: "Human Rights Hub | Education & Resources",
  description: "Access our comprehensive library of human rights articles, legal resources, and educational materials. Stay informed about social equality and responsibilities.",
  keywords: ["Human Rights Articles", "Legal Aid India", "Social Awareness", "PCHR&R Hub", "Human Rights Education"],
};

export default function HumanRightsPage() {
  return <HumanRightsClient />;
}
