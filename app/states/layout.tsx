import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "State Initiatives | PCHR&R",
  description: "Explore PCHR&R's state-wise initiatives, events, and awareness campaigns across all 28 states and 8 Union Territories of India.",
};

export default function StatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
