"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { name: t("nav_home"), path: "/" },
    { name: t("nav_about"), path: "/about" },
    { name: t("nav_services"), path: "/services" },
    { name: t("nav_knowledge"), path: "/human-rights" },
    { name: t("nav_events"), path: "/events" },
    { name: t("nav_states"), path: "/states" },
    { name: t("nav_contact"), path: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center animate-fade-in">
            <Link href="/" className="flex-shrink-0 flex items-center py-2 group">
              {/* Using standard img to avoid next/image caching issues for SVG */}
              <img
                src="/logo.svg"
                alt="PCHR&R Logo"
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105 animate-scale-in"
              />
              <span className="ml-3 font-heading font-black text-xl tracking-tighter text-slate-900 group-hover:text-primary-600 transition-colors">PCHR&R</span>
            </Link>
          </div>

          <div className={`hidden md:flex md:items-center ${language === "en" ? "md:space-x-6" : "md:space-x-10"}`}>
            {links.map((link, index) => (
              <Link
                key={link.name}
                href={link.path}
                className={`inline-flex items-center px-1 pt-1 text-sm transition-all relative group animate-fade-in-up ${
                  language === "hi" ? "font-bold tracking-normal" : "font-black tracking-tighter"
                } ${isActive(link.path)
                    ? "text-primary-600"
                    : "text-slate-500 hover:text-primary-600"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
                <span className={`absolute bottom-6 left-0 h-1 bg-primary-500 transition-all rounded-full ${isActive(link.path) ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`}></span>
              </Link>
            ))}
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 animate-fade-in-up delay-300">
              <Link
                href="/donate"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-900/20 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
              >
                {t("nav_donate")}
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center px-6 py-3 border-2 border-primary-100 text-primary-600 font-black rounded-2xl bg-white hover:bg-primary-50 shadow-sm transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
              >
                {t("nav_volunteer")}
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${isOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute top-0 right-0 h-full w-[320px] max-w-[85%] glass shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-transform duration-500 ease-in-out flex flex-col border-l border-white/20 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-8 border-b border-slate-100/50 flex items-center justify-between bg-primary-50/20 backdrop-blur-md">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 group">
              <img src="/logo.svg" alt="Logo" className="h-10 w-auto transition-transform group-hover:scale-110" />
              <span className="font-black text-xl text-slate-900 tracking-tighter">PCHR&R</span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-2xl bg-white shadow-premium text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-90"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-10 px-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 pl-2">{t("nav_navigation")}</p>
            <nav className="space-y-3">
              {links.map((link, idx) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl text-lg transition-all ${
                    language === "hi" ? "font-bold tracking-normal" : "font-black tracking-tighter"
                  } ${isActive(link.path)
                      ? "bg-primary-600 text-white shadow-2xl shadow-primary-900/30 -translate-y-1"
                      : "text-slate-600 hover:bg-white hover:text-primary-600 hover:shadow-xl active:scale-95"
                    }`}
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <span>{link.name}</span>
                  {isActive(link.path) ? (
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                  ) : (
                    <svg className="h-4 w-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              ))}
            </nav>
            
            <div className="mt-16 space-y-5">
              <Link
                href="/donate"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center h-16 bg-primary-600 text-white text-lg font-black rounded-3xl shadow-2xl shadow-primary-900/40 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                {t("nav_donate")}
              </Link>
              <Link
                href="/volunteer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center h-16 border-2 border-slate-900 text-slate-900 text-lg font-black rounded-3xl hover:bg-slate-900 hover:text-white active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                {t("nav_volunteer")}
              </Link>
            </div>
          </div>
          
          <div className="p-10 bg-slate-50/50 backdrop-blur-xl border-t border-slate-200/50 mt-auto">
             <div className="flex items-center justify-between px-2">
               <a href="https://www.facebook.com/possiblecentreforhumanrightsandreponsibilities" target="_blank" className="p-3 rounded-full bg-white shadow-sm text-slate-400 hover:text-primary-600 hover:shadow-md transition-all">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
               </a>
               <a href="https://www.instagram.com/possible.centre" target="_blank" className="p-3 rounded-full bg-white shadow-sm text-slate-400 hover:text-[#E4405F] hover:shadow-md transition-all">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
               </a>
               <a href="https://whatsapp.com/channel/0029Vb6s0VN0VycDd96j6R2e" target="_blank" className="p-3 rounded-full bg-white shadow-sm text-slate-400 hover:text-[#25D366] hover:shadow-md transition-all">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
               </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
