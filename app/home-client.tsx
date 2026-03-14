"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Reusable component to animate children when they scroll into view
const AnimatedSection = ({ children, className = "", delay = "" }: { children: ReactNode, className?: string, delay?: string }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver();
  return (
    <div
      ref={targetRef}
      className={`${className} transition-all duration-1000 ${isIntersecting ? `opacity-100 translate-y-0 ${delay}` : 'opacity-0 translate-y-12'}`}
    >
      {children}
    </div>
  );
};

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  location: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
}

export default function HomeClient() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ people: 0, events: 0, volunteers: 0, districts: 0 });

  // Use translations for slides
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop",
      title: t("hero_slide1_title"),
      subtitle: t("hero_slide1_tag")
    },
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
      title: t("hero_slide2_title"),
      subtitle: t("hero_slide2_tag")
    },
    {
      url: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop",
      title: t("hero_slide3_title"),
      subtitle: t("hero_slide3_tag")
    },
    {
      url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b4b8?q=80&w=2070&auto=format&fit=crop",
      title: t("hero_slide1_title"),
      subtitle: t("hero_slide4_tag")
    },
    {
      url: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop",
      title: t("hero_slide2_title"),
      subtitle: t("hero_slide2_tag")
    }
  ];

  const fetchDynamicData = async () => {
    try {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(4);
      
      if (eventsData) setEvents(eventsData);

      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select('*')
        .limit(2);
      
      if (testimonialData) setTestimonials(testimonialData);
    } catch (err) {
      console.error("Error fetching dynamic data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicData();
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        people: Math.floor(ease * 5000),
        events: Math.floor(ease * 120),
        volunteers: Math.floor(ease * 800),
        districts: Math.floor(ease * 18),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) setCurrentSlide((prev) => (prev + 1) % slides.length);
    else if (isRightSwipe) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white selection:bg-primary-100 selection:text-primary-900">
      <section className="bg-gradient-to-br from-slate-50 via-white to-primary-50 py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent opacity-50 z-0"></div>
        <div className="premium-blur top-[10%] left-[-10%] opacity-40 bg-primary-200" />
        <div className="premium-blur bottom-[-10%] right-[-10%] bg-secondary-200/30 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-10 lg:mb-16">
            <h1 className="text-primary-600 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase mb-4 animate-pulse">
              {t("hero_welcome")}
            </h1>
            <div className="text-slate-950 text-4xl md:text-6xl lg:text-6xl font-black leading-tight max-w-4xl mx-auto drop-shadow-sm tracking-tight animate-fade-in-up delay-100">
              {t("hero_org_name")}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
              <Link href="/services" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-600/30 transition-all hover:scale-105 active:scale-95 flex items-center text-sm md:text-lg group">
                {t("hero_explore")}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
              </Link>
              <Link href="/donate" className="px-8 py-4 bg-white border border-slate-200 text-slate-900 hover:border-primary-500 hover:text-primary-600 font-black rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 text-sm md:text-lg">
                {t("hero_support")}
              </Link>
            </div>
          </AnimatedSection>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[400px] lg:h-[550px] animate-fade-in-up delay-300">
            <div 
              className="relative w-full lg:w-[68%] h-[350px] sm:h-[450px] lg:h-full rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-200 bg-slate-900 animate-fade-in"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent z-10" />
                  <img src={slide.url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                    <div className="glass inline-block py-1.5 px-4 md:py-2 md:px-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl text-white text-[8px] md:text-xs font-black tracking-widest mb-4 border border-white/20 uppercase">
                      {slide.subtitle}
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] drop-shadow-xl max-w-2xl transform transition-transform duration-700 translate-y-0 opacity-100">
                      {slide.title}
                    </h2>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-8 right-8 z-30 flex space-x-3">
                {slides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1.5 transition-all rounded-full ${index === currentSlide ? "bg-primary-500 w-12" : "bg-white/30 w-4 hover:bg-white/60"}`} />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[32%] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200/60 group animate-scale-in delay-200">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 md:p-8 border-b border-primary-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">{t("nav_events")}</h3>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">📅</div>
                </div>
                <p className="text-primary-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">{t("hero_slide1_tag")}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event, i) => (
                      <Link key={event.id} href="/events" className="block p-5 bg-slate-50 border border-transparent hover:border-primary-200 hover:bg-white hover:shadow-xl transition-all rounded-3xl group/item animate-fade-in-up" style={{ animationDelay: `${(i*100) + 400}ms` }}>
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-white border-2 border-primary-50 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover/item:bg-primary-600 group-hover/item:text-white transition-colors shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 group-hover/item:opacity-100">{formatDate(event.event_date).split(" ")[0]}</span>
                            <span className="text-xl font-black leading-none">{formatDate(event.event_date).split(" ")[1]}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover/item:text-primary-600 transition-colors line-clamp-2 leading-snug">{event.title}</h4>
                            <p className="text-xs text-slate-400 mt-2 font-bold flex items-center truncate">
                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                               {event.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : loading ? (
                    [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-3xl mb-4" />)
                  ) : (
                    <div className="p-10 text-center opacity-50 font-bold uppercase text-xs tracking-widest">{t("events_no_today")}</div>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <Link href="/events" className="w-full flex justify-center items-center py-4 px-6 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                  {t("hub_view_all")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection delay="delay-100">
                <span className="text-primary-600 font-black text-xs uppercase tracking-[0.4em] mb-6 block underline decoration-4 underline-offset-8 decoration-primary-200">{t("mission_mandate")}</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-8 tracking-tight leading-none text-gradient">{t("mission_title")}</h2>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl">{t("mission_desc")}</p>
                
                <div className="grid sm:grid-cols-2 gap-8">
                   <AnimatedSection delay="delay-200" className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-200/60 glass transition-all hover:shadow-premium hover:-translate-y-1">
                      <h3 className="font-black text-primary-600 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        {t("mission_vision_label")}
                      </h3>
                      <p className="text-slate-700 font-medium leading-relaxed">{t("mission_vision_text")}</p>
                   </AnimatedSection>
                   <AnimatedSection delay="delay-300" className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-200/60 glass transition-all hover:shadow-premium hover:-translate-y-1">
                      <h3 className="font-black text-primary-600 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        {t("mission_mission_label")}
                      </h3>
                      <p className="text-slate-700 font-medium leading-relaxed">{t("mission_mission_text")}</p>
                   </AnimatedSection>
                </div>
             </AnimatedSection>
             <AnimatedSection delay="delay-400" className="relative group">
                <div className="absolute inset-0 bg-primary-600 rounded-[3rem] rotate-3 scale-95 opacity-10 group-hover:rotate-0 transition-transform duration-700" />
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                   <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                </div>
             </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="premium-blur top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 bg-primary-400" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: counts.people.toLocaleString() + "+", label: t("stat_people"), icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, delay: "delay-100" },
              { value: counts.events + "+", label: t("stat_events"), icon: <><rect height="18" rx="2" ry="2" width="18" x="3" y="4"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>, delay: "delay-200" },
              { value: counts.volunteers + "+", label: t("stat_volunteers"), icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>, delay: "delay-300" },
              { value: counts.districts + "+", label: t("stat_districts"), icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>, delay: "delay-400" },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={stat.delay} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm text-center transition-all hover:bg-white/10 hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    {stat.icon}
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-black text-white tabular-nums mb-3 tracking-tighter">{stat.value}</div>
                <div className="text-primary-400 font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
               <span className="text-primary-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">{t("action_take")}</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-none text-gradient">{t("action_ways")}</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-10">
               {[
                 { title: t("quick_impact"), desc: t("quick_impact_desc"), link: "/events", icon: "📈", color: "from-blue-600 to-indigo-600" },
                 { title: t("quick_knowledge"), desc: t("quick_knowledge_desc"), link: "/human-rights", icon: "🛡️", color: "from-primary-600 to-primary-800" },
                 { title: t("quick_volunteer"), desc: t("quick_volunteer_desc"), link: "/volunteer", icon: "🤝", color: "from-rose-500 to-orange-500" }
               ].map((item, i) => (
                 <AnimatedSection key={i} delay={`delay-${(i+1)*100}`}>
                 <Link href={item.link} className="block group relative bg-slate-50 p-12 rounded-[3rem] border border-slate-200/60 transition-all duration-500 hover:shadow-premium hover:-translate-y-2 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`} />
                    <div className="text-6xl mb-10 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                    <h3 className="text-2xl font-black text-slate-950 mb-4">{item.title}</h3>
                    <p className="text-slate-600 font-medium mb-10 leading-relaxed text-lg">{item.desc}</p>
                    <div className="flex items-center text-primary-600 font-black uppercase text-xs tracking-[0.2em]">
                       {t("hero_explore")}
                       <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                    </div>
                 </Link>
                 </AnimatedSection>
               ))}
            </div>
         </div>
      </section>

      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="premium-blur top-0 left-0 opacity-20 bg-primary-600" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block">{t("test_label")}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">{t("test_title")}</h2>
            <div className="w-16 h-1.5 bg-primary-500 mx-auto rounded-full" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.length > 0 ? (
               testimonials.map((t, index) => (
                  <AnimatedSection key={t.id} delay={`delay-${(index+1)*100}`} className="glass-dark border border-white/10 p-12 rounded-[3.5rem] transition-all hover:bg-white/10 group">
                      <div className="text-primary-400 text-6xl mb-8 opacity-40 group-hover:opacity-100 transition-opacity">“</div>
                      <p className="text-2xl font-medium mb-12 italic leading-relaxed text-slate-100"> {t.content} ”</p>
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 bg-primary-600/20 text-primary-400 rounded-2xl flex items-center justify-center font-black text-2xl border border-primary-600/30">
                           {t.name.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-black text-xl text-white tracking-tight">{t.name}</h4>
                            <p className="text-primary-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t.role}</p>
                         </div>
                      </div>
                  </AnimatedSection>
               ))
            ) : (
               [1,2].map(i => <div key={i} className="h-80 bg-white/5 rounded-[3.5rem] animate-pulse" />)
            )}
          </div>
        </div>
      </section>

      <section className="py-40 bg-white text-center relative overflow-hidden">
         <div className="premium-blur bottom-0 right-0 opacity-20 bg-primary-100" />
         <AnimatedSection className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-10 tracking-tight leading-none text-gradient">{t("events_inspired")}</h2>
            <p className="text-2xl text-slate-500 mb-16 font-medium leading-relaxed max-w-2xl mx-auto">{t("events_inspired_desc")}</p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
               <Link href="/volunteer" className="w-full sm:w-auto px-12 py-6 bg-primary-600 text-white font-black rounded-3xl shadow-2xl shadow-primary-900/40 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95 text-xl">
                 {t("nav_join_volunteer")}
               </Link>
               <Link href="/donate" className="w-full sm:w-auto px-12 py-6 border-4 border-slate-950 text-slate-950 font-black rounded-3xl hover:bg-slate-950 hover:text-white transition-all text-xl">
                 {t("nav_donate_now")}
               </Link>
            </div>
         </AnimatedSection>
      </section>
    </div>
  );
}
