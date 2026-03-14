"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  highlights: string[];
  schedule: string;
  image_url: string;
}

export default function ServicesClient() {
  const { t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices([
          { id: "education", title: t("footer_edu_growth"), icon: "📚", description: t("ser_edu_desc"), highlights: [t("ser_edu_h1"), t("ser_edu_h2"), t("ser_edu_h3"), t("ser_edu_h4")], schedule: t("ser_edu_sched"), image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop" },
          { id: "environment", title: t("footer_env_action"), icon: "🌱", description: t("ser_env_desc"), highlights: [t("ser_env_h1"), t("ser_env_h2"), t("ser_env_h3"), t("ser_env_h4")], schedule: t("ser_env_sched"), image_url: "https://images.unsplash.com/photo-1542601906-973be1f9a055?q=80&w=2070&auto=format&fit=crop" },
          { id: "health", title: t("footer_health_wellbeing"), icon: "❤️", description: t("ser_health_desc"), highlights: [t("ser_health_h1"), t("ser_health_h2"), t("ser_health_h3"), t("ser_health_h4")], schedule: t("ser_health_sched"), image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6">PCHR&R</span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">{t("services_title")}</h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100">{t("services_subtitle")}</p>
        </div>
      </div>

      {/* Services List */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mb-4" />
              <p className="text-slate-500 font-medium">{t("ser_loading")}</p>
            </div>
          ) : (
            services.map((service, index) => (
              <div key={service.id} id={service.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1 w-full bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">{service.title}</h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                  <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs text-primary-600">{t("services_highlights")}</h3>
                  <ul className="space-y-2.5 mb-8">
                    {service.highlights.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 mt-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <span className="text-slate-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-slate-100">
                    <div className="mb-4 sm:mb-0">
                      <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">{t("services_schedule")}</span>
                      <span className="font-semibold text-slate-900">{service.schedule}</span>
                    </div>
                    <Link href={`/contact?subject=${service.id}`} className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-200 transition-all hover:scale-105 active:scale-95">
                      {t("services_enroll")}
                    </Link>
                  </div>
                </div>
                <div className="flex-1 w-full relative h-[420px] rounded-3xl overflow-hidden shadow-2xl hidden md:block group">
                  <img src={service.image_url} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <span className="text-white font-heading text-xl font-bold drop-shadow-lg">{service.title}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{t("services_cta_title")}</h2>
          <p className="text-lg text-primary-100 mb-8">{t("services_cta_desc")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white hover:bg-white hover:text-primary-600 transition-all shadow-sm">
              {t("services_cta_counsel")}
            </Link>
            <Link href="/volunteer" className="inline-flex items-center px-8 py-4 bg-white text-lg font-semibold rounded-xl text-primary-600 hover:bg-primary-50 transition-all shadow-md">
              {t("services_cta_volunteer")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
