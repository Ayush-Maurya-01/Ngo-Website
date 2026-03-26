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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="prose prose-xl md:prose-2xl prose-slate max-w-none leading-relaxed md:leading-loose text-slate-800 hover:prose-a:text-primary-500 prose-a:font-bold prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-4 prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-blockquote:border-l-8 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700 prose-blockquote:shadow-sm prose-blockquote:my-10 prose-ul:my-8 prose-li:my-3 prose-li:marker:text-primary-500 prose-li:marker:font-bold prose-img:rounded-3xl prose-img:shadow-2xl selection:bg-primary-100 selection:text-primary-900 drop-shadow-sm font-medium">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Action Bottom */}
        <div className="mt-24 pt-12 border-t border-slate-200">
          
          {/* Tags & Share */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <Link href="/human-rights" className="group inline-flex items-center px-6 py-3 bg-slate-50 rounded-full text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100 shadow-sm uppercase tracking-widest hover:-translate-x-1">
              <svg className="w-5 h-5 mr-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              Back to Articles
            </Link>

            <div className="flex items-center gap-4">
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:inline-block">Share:</span>
               <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: "Read this inspiring article on PCHR&R's Human Rights Hub!",
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied to clipboard!"));
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
               >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Share Article
               </button>
            </div>
          </div>

          {/* Author & CTA Block */}
          <div className="bg-slate-50 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center text-white shadow-xl shadow-primary-900/10">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div className="flex-grow text-center md:text-left relative z-10">
              <h4 className="text-xl font-black text-slate-900 mb-2">PCHR&R Editorial Team</h4>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">This article was curated and generated by our automated AI awareness pipeline to spread crucial knowledge about human rights, education, and social equality.</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href="/volunteer" className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-colors">Join as Volunteer</Link>
                <Link href="/donate" className="px-6 py-2 bg-white text-slate-900 border border-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">Support Our Work</Link>
              </div>
            </div>
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
