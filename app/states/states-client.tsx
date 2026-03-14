"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { supabase } from "@/lib/supabase";

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

interface StateEvent {
  id: string;
  state: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  created_at: string;
}

export default function StatesClient() {
  const { t } = useLanguage();
  const [stateEvents, setStateEvents] = useState<StateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const fetchStateEvents = async () => {
    const { data } = await supabase
      .from("state_events")
      .select("*")
      .order("event_date", { ascending: false });
    if (data) setStateEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStateEvents();
  }, []);

  const getEventsForState = (state: string) =>
    stateEvents.filter((e) => e.state === state);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-primary-50 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent opacity-50 z-0"></div>
        <div className="premium-blur top-[10%] left-[-10%] opacity-40 bg-primary-200" />
        <div className="premium-blur bottom-[-10%] right-[-10%] bg-secondary-200/30 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-5 py-2 bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest rounded-full border border-primary-100 mb-6 shadow-sm">
            {t("states_nationwide")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-6 tracking-tight leading-tight drop-shadow-sm">
            {t("states_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium">
            {t("states_subtitle")}
          </p>
        </div>
      </div>

      <div className="sticky top-24 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-2xl group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <input
              type="text"
              placeholder={t("states_search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-slate-200 rounded-2xl text-base text-slate-900 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 shadow-sm transition-all bg-white"
            />
          </div>
          <div className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 text-sm font-bold shadow-sm whitespace-nowrap">
            <span className="text-primary-600 text-xl font-black mr-2">{stateEvents.length}</span>
            {t("states_activities")}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-black text-slate-900">{t("states_states_label")}</h2>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">28</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INDIA_STATES.slice(0, 28).filter((s) => s.toLowerCase().includes(search.toLowerCase())).map((state) => {
              const count = getEventsForState(state).length;
              const isSelected = selectedState === state;
              return (
                <div key={state}>
                  <button
                    onClick={() => setSelectedState(isSelected ? null : state)}
                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-primary-500 bg-gradient-to-b from-primary-50 to-white shadow-xl shadow-primary-500/10 scale-[1.02] z-10 relative"
                        : "border-slate-100 bg-white hover:border-primary-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-lg tracking-tight">{state}</span>
                      {count > 0 && (
                        <span className="px-3 py-1 bg-primary-600 text-white text-xs font-black rounded-full shadow-sm">
                          {count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {count === 0 ? t("states_no_activity") : `${count} ${count === 1 ? t("states_activity") : t("states_activities_plural")}`}
                    </p>
                  </button>

                  {isSelected && (
                    <div className="mt-4 border border-slate-200 bg-white rounded-[2rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-top-4 fade-in duration-300 z-0">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-white font-black text-lg tracking-tight">{state} <span className="text-primary-200 font-normal">| {t("states_panel_label")}</span></h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                          <svg className="w-4 h-4 transition-transform duration-300 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      {getEventsForState(state).length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                          <div className="text-4xl mb-3 opacity-20">📭</div>
                          {t("states_no_activity_for")} {state}.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {getEventsForState(state).map((ev) => (
                            <div key={ev.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-black text-slate-900 text-base md:text-lg mb-1">{ev.title}</h4>
                                  {ev.location && (
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                      <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                                      {ev.location}
                                    </p>
                                  )}
                                  {ev.description && <p className="text-sm text-slate-600 mt-3 leading-relaxed">{ev.description}</p>}
                                </div>
                                {ev.event_date && (
                                  <span className="shrink-0 text-xs bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap self-start">
                                    {formatDate(ev.event_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-black text-slate-900">{t("states_uts_label")}</h2>
            <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-100">8</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INDIA_STATES.slice(28).filter((s) => s.toLowerCase().includes(search.toLowerCase())).map((state) => {
              const count = getEventsForState(state).length;
              const isSelected = selectedState === state;
              return (
                <div key={state}>
                  <button
                    onClick={() => setSelectedState(isSelected ? null : state)}
                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-orange-400 bg-gradient-to-b from-orange-50 to-white shadow-xl shadow-orange-500/10 scale-[1.02] z-10 relative"
                        : "border-slate-100 bg-white hover:border-orange-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-lg tracking-tight">{state}</span>
                      {count > 0 && (
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-black rounded-full shadow-sm">
                          {count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {count === 0 ? t("states_no_activity") : `${count} ${count === 1 ? t("states_activity") : t("states_activities_plural")}`}
                    </p>
                  </button>

                  {isSelected && (
                    <div className="mt-4 border border-orange-200 bg-white rounded-[2rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-top-4 fade-in duration-300 z-0">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-white font-black text-lg tracking-tight">{state} <span className="text-orange-100 font-normal">| {t("states_panel_label")}</span></h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                          <svg className="w-4 h-4 transition-transform duration-300 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      {getEventsForState(state).length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium bg-orange-50/30">
                          <div className="text-4xl mb-3 opacity-20">📭</div>
                          {t("states_no_activity_for")} {state}.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {getEventsForState(state).map((ev) => (
                            <div key={ev.id} className="p-6 hover:bg-orange-50/20 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-black text-slate-900 text-base md:text-lg mb-1">{ev.title}</h4>
                                  {ev.location && (
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                                      {ev.location}
                                    </p>
                                  )}
                                  {ev.description && <p className="text-sm text-slate-600 mt-3 leading-relaxed">{ev.description}</p>}
                                </div>
                                {ev.event_date && (
                                  <span className="shrink-0 text-xs bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap self-start">
                                    {formatDate(ev.event_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-slate-400 font-medium">{t("states_loading")}</div>
        )}
      </div>
    </div>
  );
}
