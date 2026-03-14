"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function ContactClient() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(result.error || t("contact_error"));
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("error");
      setErrorMessage(t("contact_error"));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 70% 20%, white 1px, transparent 1px)", backgroundSize: "50px 50px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6">{t("con_connect")}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t("contact_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100">
            {t("contact_subtitle")}
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">{t("contact_info_title")}</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-slate-900">{t("contact_address")}</h3>
                    <p className="text-slate-600 mt-1 text-lg">{t("contact_address_val")}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-slate-900">{t("contact_email_label")}</h3>
                    <a href={`mailto:${t("contact_email_val")}`} className="text-slate-600 mt-1 text-lg hover:text-primary-600 transition-colors">{t("contact_email_val")}</a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-slate-900">{t("contact_phone_label")}</h3>
                    <a href={t("contact_phone_href")} className="text-slate-600 mt-1 text-lg hover:text-primary-600 transition-colors">{t("contact_phone_val")}</a>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="w-full h-80 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <iframe
                  title="PCHR&R Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.0!2d77.2167!3d28.6329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNew%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-primary-900/10 border border-slate-100">
              {status === "success" ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner animate-bounce">✓</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{t("contact_success")}</h3>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all shadow-md active:scale-95"
                  >
                    {t("con_back")}
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center shadow-sm">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1 mb-1 block uppercase tracking-wider">{t("contact_name")}</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-1 block uppercase tracking-wider">{t("contact_email")}</label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1 mb-1 block uppercase tracking-wider">{t("contact_phone")}</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1 mb-1 block uppercase tracking-wider">{t("contact_subject")}</label>
                    <input 
                       type="text"
                       name="subject"
                       required
                       value={formData.subject}
                       onChange={handleChange}
                       className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1 mb-1 block uppercase tracking-wider">{t("contact_message")}</label>
                    <textarea 
                      name="message"
                      rows={5} 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full group relative overflow-hidden px-8 py-5 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-900/20 hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t("contact_sending")}
                        </>
                      ) : (
                        <>
                          {t("contact_send")}
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
