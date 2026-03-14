import { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with PCHR&R",
  description: "Have questions or want to collaborate? Contact PCHR&R for human rights inquiries, educational support, or to visit our New Delhi office.",
  keywords: ["Contact NGO India", "Human Rights Helpline", "PCHR&R Address", "Social Support Delhi"],
};

export default function ContactPage() {
  return <ContactClient />;
}
