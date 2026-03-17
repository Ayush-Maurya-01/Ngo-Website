import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "State Initiatives | PCHR&R",
  description: "Explore PCHR&R's state-wise initiatives, events, and awareness campaigns across all 28 states and 8 Union Territories of India.",
  keywords: ["NGO initiatives by State", "PCHRR state chapters", "Social awareness campaigns India", "Human rights across India", "NGO presence in all states"],
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
