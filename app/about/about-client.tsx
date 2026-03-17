"use client";

import { useLanguage } from "@/context/language-context";

export default function AboutClient() {
  const { t } = useLanguage();

  const values = [
    { titleKey: "about_value1_title" as const, textKey: "about_value1_text" as const, icon: "🌟" },
    { titleKey: "about_value2_title" as const, textKey: "about_value2_text" as const, icon: "🛡️" },
    { titleKey: "about_value3_title" as const, textKey: "about_value3_text" as const, icon: "❤️" },
    { titleKey: "about_value4_title" as const, textKey: "about_value4_text" as const, icon: "⚖️" },
    { titleKey: "about_value5_title" as const, textKey: "about_value5_text" as const, icon: "🤝" },
    { titleKey: "about_value6_title" as const, textKey: "about_value6_text" as const, icon: "🏆" },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6">PCHR&R</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t("about_title")}
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            {t("about_subtitle")}
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{t("about_title")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">{t("about_story_title")}</h2>
              <div className="w-12 h-1 bg-primary-500 rounded-full mb-8" />
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {t("about_story_p1")}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("about_story_p2")}
              </p>
            </div>
            <div className="relative h-80 md:h-full min-h-[420px] rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-slate-200 bg-[url('https://images.unsplash.com/photo-1531206715517-5c0ba140b4b8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{t("ab_who_we_are")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">{t("about_values_title")}</h2>
            <div className="w-12 h-1 bg-primary-500 rounded-full mx-auto mb-6" />
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t("about_values_subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{t(value.titleKey)}</h3>
                <p className="text-slate-600 leading-relaxed">{t(value.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
