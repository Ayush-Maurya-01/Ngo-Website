"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: 'upcoming' | 'past' | 'completed' | 'cancelled';
  report_html?: string;
  gallery_urls?: string[];
}

export default function EventsClient() {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Suggestion form state
  const [suggestion, setSuggestion] = useState({ name: "", email: "", title: "", details: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
      if (data) {
        setUpcomingEvents(data.filter(e => e.status === 'upcoming'));
        setPastEvents(data.filter(e => e.status === 'past' || e.status === 'completed'));
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      // In a real app, this would save to a 'suggestions' table
      await new Promise(res => setTimeout(res, 1000));
      setFormStatus("success");
      setSuggestion({ name: "", email: "", title: "", details: "" });
    } catch (err) {
      setFormStatus("error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 30% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6">{t("ev_journey")}</span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            {t("events_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100">
            {t("events_subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Upcoming Events */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900">{t("events_upcoming")}</h2>
            <div className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-tighter">{t("ev_live")}</div>
          </div>
          
          {loading ? (
             <div className="grid md:grid-cols-2 gap-8">
               {[1, 2].map(i => (
                 <div key={i} className="bg-white h-72 rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
               ))}
             </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map(event => (
                <div key={event.id} className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-2xl font-bold text-sm border border-primary-100">
                      {new Date(event.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                    <span className="text-slate-400 font-medium">{event.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                  <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">{event.description}</p>
                  <Link href={`/volunteer?tab=event&id=${event.id}`} className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all shadow-md group-hover:scale-105 active:scale-95">
                    {t("events_register")}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-slate-500 font-medium text-lg">{t("events_no_upcoming")}</p>
            </div>
          )}
        </section>

        {/* Past Initiatives */}
        <section className="mb-24">
          <div className="flex items-center mb-10 pb-4 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900">{t("events_past")}</h2>
          </div>
          
          {loading ? (
             <div className="grid md:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white h-60 rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
               ))}
             </div>
          ) : pastEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map(event => (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-48 bg-slate-200 relative">
                     {event.gallery_urls?.[0] ? (
                       <img src={event.gallery_urls[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center text-slate-400">{t("ev_no_image")}</div>
                     )}
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                        {new Date(event.event_date).getFullYear()}
                     </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{event.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/events/${event.id}`} className="text-primary-600 font-bold text-sm hover:underline flex items-center">
                        {event.report_html ? t("events_read_report") : t("events_view_highlights")}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                      </Link>
                      {event.gallery_urls && event.gallery_urls.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">📸 {event.gallery_urls.length} {t("ev_photos")}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">{t("events_no_past")}</p>
          )}
        </section>

        {/* Suggestion Form */}
        <section className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-primary-900/10 border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -ml-32 -mb-32 opacity-40" />
           
           <div className="relative grid lg:grid-cols-2 gap-16 items-center">
             <div>
               <span className="text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">{t("ev_collab")}</span>
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t("events_suggest_title")}</h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                 {t("events_suggest_desc")}
               </p>
               <ul className="space-y-4">
                 {[t("ev_workshop"), t("ev_health"), t("ev_edu")].map(item => (
                   <li key={item} className="flex items-center text-slate-700 font-medium">
                     <span className="w-2 h-2 rounded-full bg-primary-500 mr-3" /> {item}
                   </li>
                 ))}
               </ul>
             </div>
             
             <div className="bg-slate-50/50 p-8 rounded-3xl border border-white">
                {formStatus === "success" ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">🙌</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t("ev_submitted")}</h3>
                    <p className="text-slate-600 mb-6">{t("ev_submitted_desc")}</p>
                    <button onClick={() => setFormStatus("idle")} className="text-primary-600 font-bold hover:underline">{t("ev_submit_another")}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSuggest} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t("events_your_name")}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary-500 outline-none transition-all"
                        value={suggestion.name}
                        onChange={e => setSuggestion({...suggestion, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t("events_event_title")}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary-500 outline-none transition-all"
                        value={suggestion.title}
                        onChange={e => setSuggestion({...suggestion, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t("events_event_details")}</label>
                      <textarea 
                        rows={4}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary-500 outline-none transition-all resize-none"
                        value={suggestion.details}
                        onChange={e => setSuggestion({...suggestion, details: e.target.value})}
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={formStatus === "loading"}
                      className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-900/20 hover:bg-primary-500 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {formStatus === "loading" ? t("ev_submitting") : t("events_suggest_btn")}
                    </button>
                  </form>
                )}
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}
