"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
  status: string;
}

export default function VolunteerClient() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"ngo" | "event">("ngo");
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Registration Form State
  const [regStatus, setRegStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // NGO Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    availability: "",
    about: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'event' || tab === 'ngo') {
      setActiveTab(tab as "ngo" | "event");
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await supabase.from('events').select('*').eq('status', 'upcoming').order('event_date', { ascending: true });
      if (data) setUpcomingEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegStatus("loading");
    try {
       // Simulation
       await new Promise(r => setTimeout(r, 1500));
       setRegStatus("success");
    } catch (err) {
       setRegStatus("error");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 overflow-hidden text-center text-white">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "35px 35px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6 font-mono">{t("nav_volunteer")}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {t("volunteer_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100">
            {t("volunteer_subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16 p-2 bg-slate-100 rounded-[2rem] w-fit mx-auto shadow-inner">
          <button 
            onClick={() => setActiveTab("ngo")}
            className={`px-10 py-4 rounded-[1.5rem] font-bold text-lg transition-all ${activeTab === "ngo" ? "bg-white text-primary-600 shadow-xl" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t("volunteer_tab_ngo")}
          </button>
          <button 
            onClick={() => setActiveTab("event")}
            className={`px-10 py-4 rounded-[1.5rem] font-bold text-lg transition-all ${activeTab === "event" ? "bg-white text-primary-600 shadow-xl" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t("volunteer_tab_event")}
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-primary-900/10 border border-slate-100">
           {regStatus === "success" ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner animate-pulse">🤝</div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("volunteer_success")}</h2>
                <p className="text-slate-600 text-lg mb-10 max-w-sm mx-auto">{t("vol_pass")}</p>
                <button onClick={() => setRegStatus("idle")} className="px-10 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-500 shadow-lg shadow-primary-900/20 transition-all">{t("vol_back")}</button>
              </div>
           ) : activeTab === "ngo" ? (
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_first_name")}</label>
                    <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_last_name")}</label>
                    <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_email")}</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_phone")}</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_interest")}</label>
                  <select required value={formData.interest} onChange={e => setFormData({...formData, interest: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 appearance-none">
                    <option value="">{t("vol_select")}</option>
                    <option value="education">{t("vol_interest_edu")}</option>
                    <option value="legal">{t("vol_interest_legal")}</option>
                    <option value="env">{t("vol_interest_env")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t("volunteer_about")}</label>
                  <textarea rows={4} required value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 resize-none"></textarea>
                </div>

                <button type="submit" disabled={regStatus === "loading"} className="w-full py-5 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-900/20 hover:bg-primary-500 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50">
                  {regStatus === "loading" ? t("volunteer_submitting") : t("volunteer_submit")}
                </button>
              </form>
           ) : (
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">{t("volunteer_events_title")}</h2>
                 {loadingEvents ? (
                    <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
                 ) : upcomingEvents.length > 0 ? (
                    <div className="grid gap-6">
                       {upcomingEvents.map(event => (
                          <div key={event.id} className="p-8 border-2 border-slate-100 rounded-3xl hover:border-primary-200 hover:shadow-xl transition-all group">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                   <div className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] mb-2">{event.location} • {new Date(event.event_date).toLocaleDateString()}</div>
                                   <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                                </div>
                                <button onClick={() => setActiveTab("ngo")} className="px-8 py-3 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-600 hover:text-white transition-all">
                                   {t("volunteer_register_event")}
                                 </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                       <p className="text-slate-500 font-medium">{t("volunteer_no_events")}</p>
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
