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

export function PostContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(0);
  const [toc, setToc] = useState<{id: string, text: string, level: string}[]>([]);
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
        
        // Generate pseudo-random likes based on ID length
        setLikes(Math.floor(Math.random() * 50) + 124);

        // Parse Table of Contents
        if (typeof window !== 'undefined') {
          const div = document.createElement('div');
          div.innerHTML = data.content;
          const headings = Array.from(div.querySelectorAll('h2, h3'));
          setToc(headings.map((h, i) => ({
            id: `heading-${i}`,
            text: h.textContent || '',
            level: h.tagName.toLowerCase()
          })));
        }

      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  // Handle Audio Synthesis
  const handlePlayAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if (post) {
        const textToRead = post.content.replace(/<[^>]+>/g, '');
        const utterance = new SpeechSynthesisUtterance(`${post.title}. ${textToRead}`);
        utterance.rate = 0.95; // Slightly slower for accessibility
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  // Modify content to inject IDs for ToC
  let contentWithIds = post?.content || "";
  if (post) {
    let i = 0;
    contentWithIds = post.content.replace(/<(h[23])([^>]*)>/g, (match, p1, p2) => {
      return `<${p1} id="heading-${i++}"${p2}>`;
    });
  }

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
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-slate-50 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_100%_0%,_#e0f2fe_0%,_transparent_50%),radial-gradient(circle_at_0%_100%,_#f0f9ff_0%,_transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-100/50 text-primary-700 text-xs font-black uppercase tracking-widest rounded-full border border-primary-200 mb-8 mx-auto shadow-sm animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {post.category}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-slate-900 mb-8 leading-[1.1] tracking-tight text-balance animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest flex-wrap animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
        <div className="w-full px-4 sm:px-8 lg:px-16 -mt-16 md:-mt-24 relative z-10 mb-20 md:mb-32 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <div className="relative aspect-[21/9] lg:aspect-[2.5/1] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-slate-100">
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

      {/* Content wrapper with Sidebar layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 pb-32 flex flex-col xl:flex-row gap-16 relative">
      
        {/* Left Sticky Sidebar: Table of Contents & Tools */}
        <aside className="hidden xl:block w-72 shrink-0 relative">
          <div className="sticky top-40 space-y-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-lg font-black font-heading text-slate-900 mb-4 uppercase tracking-widest">In this Article</h4>
                <nav className="space-y-3 max-h-[40vh] overflow-y-auto hide-scrollbar">
                  {toc.map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`}
                      className={`block text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors line-clamp-2 ${item.level === 'h3' ? 'pl-4 border-l-2 border-slate-200 ml-2' : ''}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handlePlayAudio}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all shadow-sm ${isPlaying ? 'bg-primary-600 text-white shadow-primary-500/25' : 'bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-600 border border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  {isPlaying ? (
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  {isPlaying ? "Stop Audio" : "Listen to Article"}
                </div>
              </button>

              <button 
                onClick={() => window.print()}
                className="flex items-center justify-between px-6 py-4 rounded-2xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Save as PDF
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Article Body */}
        <div className="flex-grow w-full max-w-[65rem] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          
          {/* Mobile Actions Bar (Shown only on small screens) */}
          <div className="flex xl:hidden flex-wrap items-center gap-4 mb-10 pb-6 border-b border-slate-100">
             <button onClick={handlePlayAudio} className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${isPlaying ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
                {isPlaying ? "⏹ Stop Audio" : "▶️ Listen"}
             </button>
             <button onClick={() => window.print()} className="flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm bg-slate-50 text-slate-700 border border-slate-100">
                🖨️ Save PDF
             </button>
          </div>

          <div className="prose prose-xl md:prose-2xl lg:prose-[1.35rem] prose-slate max-w-full w-full leading-relaxed md:leading-[1.9] text-slate-800 hover:prose-a:text-primary-500 prose-a:font-bold prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:text-3xl md:prose-h2:text-4xl lg:prose-h2:text-[2.5rem] prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:scroll-mt-32 prose-h2:pb-4 prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:scroll-mt-32 prose-blockquote:border-l-8 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:py-6 prose-blockquote:px-8 md:prose-blockquote:px-12 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-primary-900 prose-blockquote:shadow-sm prose-blockquote:my-10 prose-blockquote:text-xl prose-ul:my-8 prose-li:my-3 prose-li:marker:text-primary-500 prose-li:marker:font-bold prose-img:rounded-3xl prose-img:shadow-2xl selection:bg-primary-100 selection:text-primary-900 drop-shadow-sm font-medium">
            <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          </div>

          {/* Inline Newsletter Subscription Box */}
          <div className="my-16 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-transparent opacity-50 pointer-events-none" />
             <div className="relative z-10">
               <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/20">Stay Informed</span>
               <h3 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-4">Join our Human Rights Newsletter</h3>
               <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">Get weekly insights, deeply researched articles, and awareness campaigns delivered straight to your inbox. Be part of the change.</p>
               <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert("Successfully Subscribed to PCHR&R Newsletter!"); }}>
                 <input type="email" placeholder="Enter your email address" required className="flex-grow px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                 <button type="submit" className="px-8 py-4 bg-primary-600 rounded-2xl font-bold tracking-widest uppercase hover:bg-primary-500 hover:-translate-y-1 transition-all shadow-lg shadow-primary-600/30 shrink-0">Subscribe</button>
               </form>
             </div>
          </div>

        {/* Action Bottom */}
        <div className="mt-24 pt-12 border-t border-slate-200">
          
          {/* Tags & Share & Likes */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <Link href="/human-rights" className="group inline-flex items-center px-6 py-3 bg-slate-50 rounded-full text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100 shadow-sm uppercase tracking-widest hover:-translate-x-1 shrink-0">
              <svg className="w-5 h-5 mr-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              Back to Articles
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-4">
               {/* Like Button */}
               <button 
                 onClick={() => setLikes(l => l + 1)}
                 className="inline-flex items-center px-6 py-3 bg-rose-50 text-rose-600 rounded-full font-bold hover:bg-rose-100 hover:text-rose-700 transition-all border border-rose-100 shadow-sm active:scale-95 group"
               >
                 <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                 {likes} Applauds
               </button>

               {/* Share Button */}
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
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all justify-center"
               >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Share Article
               </button>
            </div>
          </div>
          
          {/* Author & CTA Block */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-slate-100 relative overflow-hidden my-16 shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-70" />
            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center text-white shadow-xl shadow-primary-900/20 -rotate-6 hover:rotate-0 transition-transform duration-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div className="flex-grow text-center md:text-left relative z-10">
              <h4 className="text-2xl font-black text-slate-900 mb-3 font-heading">PCHR&R Editorial Team</h4>
              <p className="text-slate-600 leading-relaxed mb-8 font-medium max-w-2xl text-lg">This article was thoughtfully crafted and thoroughly researched by our expert team to spread crucial awareness, educate citizens, and foster social equality.</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href="/volunteer" className="px-8 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-primary-600 hover:-translate-y-1 transition-all shadow-md">Join as Volunteer</Link>
                <Link href="/donate" className="px-8 py-3.5 bg-white text-slate-900 border-2 border-slate-200 text-sm font-bold rounded-2xl hover:border-primary-200 hover:bg-primary-50 hover:-translate-y-1 transition-all">Support Our Work</Link>
              </div>
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
