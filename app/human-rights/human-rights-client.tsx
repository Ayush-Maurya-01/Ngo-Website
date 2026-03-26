"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/language-context";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  read_time: string;
  image_url: string;
  created_at: string;
}

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  size: string;
  file_url: string;
}

export default function HumanRightsClient() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchData = async () => {
    try {
      // Fetch articles
      const { data: articlesData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (articlesData) setArticles(articlesData);

      // Fetch resources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (resourcesData && resourcesData.length > 0) {
        setResources(resourcesData);
      } else {
        // Fallback resources
        setResources([
          { id: "1", title: t("ser_edu_h1"), type: "PDF", size: "3.2 MB", file_url: "#" },
          { id: "2", title: t("ser_env_h3"), type: "PDF", size: "4.1 MB", file_url: "#" },
          { id: "3", title: t("ser_health_h4"), type: "ZIP", size: "8.5 MB", file_url: "#" },
          { id: "4", title: t("ser_health_h1"), type: "PNG", size: "1.2 MB", file_url: "#" }
        ]);
      }
    } catch (err) {
      console.error("Error fetching hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 md:py-28 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 10% 20%, white 1px, transparent 1px), radial-gradient(circle at 90% 80%, white 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6 font-mono">{t("hub_knowledge_label")}</span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            {t("hub_main_title")}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-primary-100">
            {t("hub_main_desc")}
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-3 block">{t("hub_subtitle")}</span>
              <h2 className="text-3xl font-bold text-slate-900">{t("hub_title")}</h2>
              <p className="text-slate-600 mt-2">{t("hub_desc")}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Search bar */}
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                <input
                  type="text"
                  placeholder={t("hub_search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-white text-sm text-slate-800 focus:outline-none focus:border-primary-400 w-52 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </button>
                )}
              </div>
              <Link href="/human-rights" className="inline-flex items-center text-primary-600 font-bold group hover:text-primary-500 transition-colors whitespace-nowrap">
                {t("hub_view_all")}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-[480px] border border-slate-100 animate-pulse shadow-sm" />
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full shadow-sm">
                  <div className="h-60 bg-slate-100 relative overflow-hidden">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-primary-50 flex items-center justify-center text-5xl">📰</div>
                    )}
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-primary-600 rounded-lg shadow-sm uppercase tracking-wider border border-primary-100">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between uppercase tracking-tighter">
                      <span>{formatDate(article.created_at)}</span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        {article.read_time}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <div 
                      className="text-slate-600 mb-6 line-clamp-3 prose prose-sm max-w-none text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: article.content.substring(0, 200) + '...' }}
                    />
                    <div className="mt-auto">
                      <Link href={`/human-rights/post?id=${article.id}`} className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-500 group-hover:translate-x-1 transition-all">
                        {t("hub_read_more")}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-slate-500 font-medium">{searchQuery ? `${t("hub_no_results")} "${searchQuery}"` : t("hub_no_articles")}</p>
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="mt-4 px-6 py-2 text-sm font-bold text-primary-600 border-2 border-primary-200 rounded-xl hover:bg-primary-50 transition-all">{t("hub_clear_search")}</button>}
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Resources & Downloads */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl -mb-48 -mr-48 opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">{t("hub_downloads_label")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t("hub_school_title")}</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                {t("hub_school_desc")}
              </p>
              
              <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-900/10 hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all">
                {t("hub_school_link")}
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              </Link>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <svg className="w-8 h-8 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                {t("hub_repository_title")}
              </h3>
              <div className="space-y-4">
                {resources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 group-hover/item:border-primary-200 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black">{res.type}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{res.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{res.size}</p>
                      </div>
                    </div>
                    <a 
                      href={res.file_url} 
                      className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
