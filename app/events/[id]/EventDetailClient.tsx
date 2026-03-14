"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: string;
  report_html?: string;
  gallery_urls?: string[];
}

export default function EventDetailClient({ event }: { event: EventItem }) {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-24 md:py-32 text-white overflow-hidden">
        {event.gallery_urls?.[0] && (
          <div className="absolute inset-0 opacity-30">
            <img src={event.gallery_urls[0]} alt="" className="w-full h-full object-cover blur-sm" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Link href="/events" className="inline-flex items-center text-primary-400 font-bold text-sm mb-8 hover:text-primary-300 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            {t("events_all_initiatives")}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
            {event.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-300 font-bold uppercase tracking-widest text-sm">
            <span className="flex items-center"><span className="mr-2">📅</span> {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center"><span className="mr-2">📍</span> {event.location}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${event.status === 'upcoming' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'}`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Report Section */}
        {event.report_html ? (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100 mb-20 prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-3xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-10 pb-4 border-b-4 border-primary-500 inline-block">{t("events_insight")}</h2>
            <div dangerouslySetInnerHTML={{ __html: event.report_html }} />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100 mb-20 text-center">
             <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("events_about")}</h2>
             <p className="text-lg text-slate-600 leading-relaxed mb-10">{event.description}</p>
             {event.status === 'upcoming' && (
               <Link href={`/volunteer?tab=event&id=${event.id}`} className="px-10 py-4 bg-primary-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20 active:scale-95 inline-block">
                 {t("events_join")}
               </Link>
             )}
          </div>
        )}

        {/* Photo Gallery */}
        {event.gallery_urls && event.gallery_urls.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{t("events_gallery")}</h2>
              <span className="px-4 py-1.5 bg-slate-900 text-white text-xs font-black uppercase rounded-full">
                {event.gallery_urls.length} {t("events_images_count")}
              </span>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {event.gallery_urls.map((url, i) => (
                <div key={i} className="break-inside-avoid rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-slate-200">
                  <img src={url} alt={`Gallery image ${i+1}`} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer Call to Action */}
      <section className="bg-primary-950 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">{t("events_inspired")}</h2>
          <p className="text-primary-200 text-lg mb-10">{t("events_inspired_desc")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/volunteer" className="px-8 py-4 bg-white text-primary-900 font-black uppercase tracking-widest rounded-2xl hover:bg-primary-100 transition-all active:scale-95">{t("nav_join_volunteer")}</Link>
            <Link href="/donate" className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95">{t("nav_donate_now")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
