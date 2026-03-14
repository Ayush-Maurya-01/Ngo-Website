"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 30%, #2563eb 1px, transparent 1px), radial-gradient(circle at 80% 70%, #2563eb 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
      
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600/20 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">🔐</div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 font-medium">Please sign in to continue</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium text-white shadow-inner"
              placeholder="admin@possiblecentre.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium text-white shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-900/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                Signing in...
              </div>
            ) : "Enter Dashboard"}
          </button>
        </form>
        
        <p className="text-center mt-10 text-slate-500 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 PCHR&R NGO
        </p>
      </div>
    </div>
  );
}
