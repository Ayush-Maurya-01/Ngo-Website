"use client";

import { useLanguage } from "@/context/language-context";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-[88px] right-6 z-50 animate-fade-in delay-500">
      <div className="flex flex-col items-center gap-1 bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-1.5 ring-1 ring-black/5 transition-all hover:scale-105 group">
        <button
          onClick={() => setLanguage("en")}
          className={`w-full h-10 px-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            language === "en"
              ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <div className="w-8 h-px bg-slate-100 group-hover:w-full transition-all" />
        <button
          onClick={() => setLanguage("hi")}
          className={`w-full h-10 px-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            language === "hi"
              ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="हिन्दी में बदलें"
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
