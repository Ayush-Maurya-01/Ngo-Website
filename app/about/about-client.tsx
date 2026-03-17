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

      {/* Leadership Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{t("ab_leadership")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">{t("about_team_title")}</h2>
          <div className="w-12 h-1 bg-primary-500 rounded-full mx-auto mb-6" />
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">{t("about_team_subtitle")}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { id: 1, nameKey: "about_team_member1_name", roleKey: "about_team_member1_role", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop" },
              { id: 2, nameKey: "about_team_member2_name", roleKey: "about_team_member2_role", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop" },
              { id: 3, nameKey: "about_team_member3_name", roleKey: "about_team_member3_role", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop" },
              { id: 4, nameKey: "about_team_member4_name", roleKey: "about_team_member4_role", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop" },
            ].map((member) => (
              <div key={member.id} className="group cursor-pointer">
                <div className="relative w-56 h-56 mx-auto rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl group-hover:shadow-primary-900/20 group-hover:-translate-y-2 transition-all duration-500 border-4 border-white ring-1 ring-slate-100">
                  <img src={member.img} alt={t(member.nameKey as any)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                       </div>
                       <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                       </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors tracking-tight">{t(member.nameKey as any)}</h3>
                <p className="text-primary-600 font-bold uppercase text-xs tracking-widest">{t(member.roleKey as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
