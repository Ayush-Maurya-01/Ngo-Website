import { Metadata } from "next";
import DonateClient from "./donate-client";

export const metadata: Metadata = {
  title: "Support Our Cause | Donate to PCHR&R",
  description: "Your contribution helps PCHR&R provide free education, legal aid, and medical support to those in need. Support human rights initiatives in India today.",
  keywords: ["Donate NGO India", "Charity for Education", "Support Human Rights", "PCHR&R Donation"],
};

export default function DonatePage() {
  return <DonateClient />;
}
