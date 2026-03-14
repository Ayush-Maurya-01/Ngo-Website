import { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/lib/supabase";
import EventDetailClient from "./EventDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function generateStaticParams() {
  const { data: events } = await supabase
    .from('events')
    .select('id');
  
  return (events || []).map((event) => ({
    id: event.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await getEvent(params.id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: event.title,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.substring(0, 160),
      images: [event.gallery_urls?.[0] || "/logo.png", ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.substring(0, 160),
      images: [event.gallery_urls?.[0] || "/logo.png"],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}
