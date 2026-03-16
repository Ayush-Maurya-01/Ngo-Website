"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function DonateClient() {
  const { t } = useLanguage();
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [amount, setAmount] = useState<number | string>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const presetAmounts = [500, 1000, 2500, 5000];

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("custom");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const finalAmount = amount === "custom" ? parseFloat(customAmount) : (amount as number);
    
    if (!finalAmount || finalAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setStatus("error");
      return;
    }

    try {
      // Simulation of a payment gateway response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage("Payment simulation failed. Please try again.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 10% 20%, white 1px, transparent 1px), radial-gradient(circle at 90% 80%, white 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6 font-mono">{t("don_impact")}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t("donate_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100 mb-6">
            {t("donate_subtitle")}
          </p>
          <div className="inline-flex items-center justify-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
             <span className="text-primary-200 text-sm">{t("donate_direct_text")}</span>
             <a href={`mailto:${t("donate_direct_email")}`} className="text-white font-bold text-sm tracking-wide hover:underline">
               {t("donate_direct_email")}
             </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary-900/10 border border-slate-100 overflow-hidden">
          {status === "success" ? (
            <div className="py-24 px-8 text-center bg-white">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner animate-bounce">🧧</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("donate_success")}</h2>
              <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">{t("don_success_desc")}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={() => setStatus("idle")} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all shadow-md">{t("don_again")}</button>
                 <Link href="/" className="px-8 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">{t("don_home")}</Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 lg:grid-cols-12 min-h-[600px]">
              
              {/* Impact Sidebar */}
              <div className="md:col-span-2 lg:col-span-4 bg-primary-900 p-8 md:p-12 text-white flex flex-col justify-between overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl -mb-32 -mr-32 opacity-20" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="w-8 h-1 bg-primary-400 mr-4 rounded-full" />
                    {t("donate_impact_title")}
                  </h3>
                  
                  <div className="space-y-10">
                    <div>
                      <h4 className="font-bold text-primary-300 text-lg mb-2">{t("donate_impact1_title")}</h4>
                      <p className="text-primary-100/80 leading-relaxed text-sm">{t("donate_impact1_desc")}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-300 text-lg mb-2">{t("donate_impact2_title")}</h4>
                      <p className="text-primary-100/80 leading-relaxed text-sm">{t("donate_impact2_desc")}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-300 text-lg mb-2">{t("donate_impact3_title")}</h4>
                      <p className="text-primary-100/80 leading-relaxed text-sm">{t("donate_impact3_desc")}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-12 p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                   <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">{t("don_transparency")}</p>
                   <p className="text-sm font-medium italic text-primary-100">{t("don_transparency_quote")}</p>
                </div>
              </div>

              {/* Donation Form */}
              <div className="md:col-span-3 lg:col-span-8 p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Frequency Toggle */}
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                    <button 
                      type="button"
                      onClick={() => setDonationType("one-time")}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${donationType === "one-time" ? "bg-white text-primary-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {t("donate_one_time")}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDonationType("monthly")}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${donationType === "monthly" ? "bg-white text-primary-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {t("donate_monthly")}
                    </button>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 ml-1">{t("don_choose")}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {presetAmounts.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAmountClick(val)}
                          className={`py-4 rounded-2xl font-bold text-lg border-2 transition-all ${amount === val ? "bg-primary-50 border-primary-600 text-primary-600 shadow-sm" : "bg-white border-slate-100 text-slate-500 hover:border-primary-200"}`}
                        >
                          ₹{val}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <span className={`font-bold transition-colors ${amount === "custom" ? "text-primary-600" : "text-slate-400"}`}>₹</span>
                      </div>
                      <input 
                        type="number"
                        placeholder={t("donate_enter_amount")}
                        value={customAmount}
                        onChange={handleCustomPrice}
                        className={`w-full bg-slate-50 border-2 rounded-2xl pl-10 pr-5 py-4 outline-none font-bold text-lg transition-all ${amount === "custom" ? "bg-white border-primary-600 text-primary-600" : "border-slate-100 focus:border-primary-200"}`}
                      />
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 block tracking-wider">{t("donate_first_name")}</label>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300" placeholder="Aarti" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 block tracking-wider">{t("donate_last_name")}</label>
                      <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300" placeholder="Sharma" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 block tracking-wider">{t("donate_email")}</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300" placeholder="aarti@domain.com" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 block tracking-wider">{t("donate_pan")}</label>
                      <input type="text" value={panNumber} onChange={e => setPanNumber(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300" placeholder="ABCDE1234F (Optional)" />
                    </div>
                  </div>

                  {status === "error" && <p className="text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-100 text-center">{errorMessage}</p>}

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full group relative overflow-hidden py-5 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-900/20 hover:bg-primary-500 active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center text-xl">
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t("donate_processing")}
                        </>
                      ) : (
                        <>
                          {t("donate_btn")}
                          <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-slate-400 text-xs font-medium uppercase tracking-widest pt-4">{t("don_secured")}</p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
