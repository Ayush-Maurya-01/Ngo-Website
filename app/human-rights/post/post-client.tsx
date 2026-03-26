"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
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

function PostContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const { t } = useLanguage();

  // Scroll Progress logic
  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    async function fetchPost() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-2xl w-3/4 mb-6" />
          <div className="h-6 bg-slate-200 rounded-xl w-1/4 mb-12" />
          <div className="h-96 bg-slate-200 rounded-3xl w-full mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8 font-medium">The article you are looking for does not exist or has been removed.</p>
        <Link href="/human-rights" className="px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-900/10 hover:bg-primary-500 hover:-translate-y-1 transition-all">
          Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-50">
        <div 
          className="h-full bg-primary-600 transition-all duration-150 ease-out" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_100%_0%,_#e0f2fe_0%,_transparent_50%),radial-gradient(circle_at_0%_100%,_#f0f9ff_0%,_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-100/50 text-primary-700 text-xs font-black uppercase tracking-widest rounded-full border border-primary-200 mb-8 mx-auto shadow-sm">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest flex-wrap">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              {post.read_time}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-20 md:mb-28">
          <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-slate-100">
            {/* Using img with a reliable fallback to solve broken AI images */}
            <img 
              src={post.image_url} 
              alt={post.title}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"; }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="prose prose-lg md:prose-xl prose-slate max-w-none hover:prose-a:text-primary-500 prose-a:font-bold prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:text-3xl prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-4 prose-h2:mt-12 prose-h2:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700 prose-blockquote:shadow-sm prose-li:marker:text-primary-500 prose-li:marker:font-bold prose-img:rounded-3xl prose-img:shadow-xl selection:bg-primary-100 selection:text-primary-900 drop-shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Action Bottom */}
        <div className="mt-20 pt-10 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/human-rights" className="group inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            Back to Articles
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share:</span>
             <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100 shadow-sm" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"))}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
             </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PostClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-32 flex justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/></div>}>
      <PostContent />
    </Suspense>
  );
}
