import { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Us | Our Mission & Values",
  description: "Learn about PCHR&R's journey, our core values of integrity and compassion, and our mission to empower communities through human rights education.",
  keywords: ["NGO Mission", "Human Rights Values", "Social Welfare India", "PCHR&R Story"],
};

export default function AboutPage() {
  return <AboutClient />;
}
