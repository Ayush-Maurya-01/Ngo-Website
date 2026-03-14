import { Metadata } from "next";
import ServicesClient from "./services-client";

export const metadata: Metadata = {
  title: "Our Services | Education, Health & Environment",
  description: "Explore PCHR&R's core initiatives: Quality education for all, weekly health camps, and environmental protection drives across India.",
  keywords: ["NGO Services India", "Free Education NGO", "Medical Camps Delhi", "Green Initiative India"],
};

export default function ServicesPage() {
  return <ServicesClient />;
}
