import { Metadata } from "next";
import EventsClient from "./events-client";

export const metadata: Metadata = {
  title: "Upcoming Events & Social Initiatives",
  description: "Join PCHR&R's upcoming human rights workshops, health awareness camps, and community drives. Stay updated with our latest social initiatives across India.",
  keywords: ["NGO Events", "Social Work Workshops", "Community Initiatives India", "PCHR&R Events"],
};

export default function EventsPage() {
  return <EventsClient />;
}
