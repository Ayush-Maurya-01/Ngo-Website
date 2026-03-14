"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// --- Interfaces ---
interface DashboardStats {
  volunteers: number;
  donations: number;
  donationAmount: number;
  messages: number;
  recentActivity: any[];
}

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  program: string;
  status: string;
  created_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  event_title?: string;
}

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  frequency: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}


interface EventItem {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
  status: string;
  report_html?: string;
  gallery_urls?: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  created_at: string;
}

interface StateEvent {
  id: string;
  state: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  created_at: string;
}

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  schedule: string;
  created_at: string;
}

interface ResourceItem {
  id: string;
  title: string;
  icon?: string;
  type: string;
  size: string;
  file_url: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [volunteerSubTab, setVolunteerSubTab] = useState<"ngo" | "event">("ngo");
  const [stats, setStats] = useState<DashboardStats>({
    volunteers: 0,
    donations: 0,
    donationAmount: 0,
    messages: 0,
    recentActivity: []
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [eventRegs, setEventRegs] = useState<EventRegistration[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [stateEvents, setStateEvents] = useState<StateEvent[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // New Item Forms State
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "", desc: "" });
  const [newBlog, setNewBlog] = useState({ title: "", content: "", category: "Education", author: "PCHR&R Admin", image_url: "" });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", content: "" });
  const [newService, setNewService] = useState({ title: "", icon: "📚", description: "", highlights: "", schedule: "", image_url: "" });
  const [newDonation, setNewDonation] = useState({ donor_name: "", donor_email: "", amount: "", frequency: "one-time" });
  const [newResource, setNewResource] = useState({ title: "", type: "PDF", size: "", file_url: "" });
  const [newStateEvent, setNewStateEvent] = useState({ state: "Delhi", title: "", desc: "", date: "", location: "" });
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  useEffect(() => {
    fetchData();
  }, [activeTab, volunteerSubTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const { count: volCount } = await supabase.from('volunteers').select('*', { count: 'exact', head: true });
      const { data: donData } = await supabase.from('donations').select('amount');
      const { count: msgCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
      
      const totalDonation = donData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

      setStats({
        volunteers: volCount || 0,
        donations: donData?.length || 0,
        donationAmount: totalDonation,
        messages: msgCount || 0,
        recentActivity: []
      });

      // 2. Fetch Tab Specific Data
      if (activeTab === 'volunteers') {
        if (volunteerSubTab === 'ngo') {
          const { data } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
          setVolunteers(data || []);
        } else {
          const { data } = await supabase.from('event_registrations').select(`
            *,
            events (title)
          `).order('created_at', { ascending: false });
          const formatted = data?.map(reg => ({
            ...reg,
            event_title: (reg.events as any)?.title || 'Unknown Event'
          }));
          setEventRegs(formatted || []);
        }
      } else if (activeTab === 'donations') {
        const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
        setDonations(data || []);
      } else if (activeTab === 'contacts') {
        const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
      } else if (activeTab === 'events') {
        const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        setEvents(data || []);
      } else if (activeTab === 'testimonials') {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        setTestimonials(data || []);
      } else if (activeTab === 'blog') {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        setBlogPosts(data || []);
      } else if (activeTab === 'services') {
        const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        setServices(data || []);
      } else if (activeTab === 'resources') {
        const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
        setResources(data || []);
      } else if (activeTab === 'state_events') {
        const { data } = await supabase.from('state_events').select('*').order('event_date', { ascending: false });
        setStateEvents(data || []);
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleUpdateStatus = async (table: string, id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format the date to YYYY-MM-DD from the datetime-local value (YYYY-MM-DDTHH:MM)
      const formattedDate = newEvent.date.split('T')[0];
      
      const { error } = await supabase.from('events').insert([{
        title: newEvent.title,
        event_date: formattedDate,
        location: newEvent.location,
        description: newEvent.desc,
        status: 'upcoming',
        gallery_urls: []
      }]);
      
      if (error) throw error;
      setNewEvent({ title: "", date: "", location: "", desc: "" });
      fetchData();
      alert("Event added successfully!");
    } catch (err: any) {
      console.error("Add Event Error:", err);
      alert(`Failed to add event: ${err.message || "Unknown error"}`);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: editingEvent.title,
          location: editingEvent.location,
          description: editingEvent.description,
          status: editingEvent.status,
          report_html: editingEvent.report_html,
          gallery_urls: editingEvent.gallery_urls
        })
        .eq('id', editingEvent.id);
      
      if (error) throw error;
      setEditingEvent(null);
      fetchData();
      alert("Event updated successfully!");
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleUploadEventImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingEvent) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${editingEvent.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      const updatedGallery = [...(editingEvent.gallery_urls || []), publicUrl];
      setEditingEvent({ ...editingEvent, gallery_urls: updatedGallery });
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(`Upload failed: ${err.message}. Make sure 'events' storage bucket exists.`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    if (!editingEvent) return;
    const updatedGallery = editingEvent.gallery_urls?.filter(u => u !== url) || [];
    setEditingEvent({ ...editingEvent, gallery_urls: updatedGallery });
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('blog_posts').insert([newBlog]);
      if (error) throw error;
      setNewBlog({ title: "", content: "", category: "Education", author: "PCHR&R Admin", image_url: "" });
      fetchData();
      alert("Blog published!");
    } catch (err) {
      alert("Failed to publish blog.");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('testimonials').insert([newTestimonial]);
      if (error) throw error;
      setNewTestimonial({ name: "", role: "", content: "" });
      fetchData();
      alert("Testimonial added!");
    } catch (err) {
      alert("Failed to add testimonial.");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const highlightsArray = newService.highlights.split(',').map(s => s.trim());
      const { error } = await supabase.from('services').insert([{
        ...newService,
        highlights: highlightsArray
      }]);
      if (error) throw error;
      setNewService({ title: "", icon: "📚", description: "", highlights: "", schedule: "", image_url: "" });
      fetchData();
      alert("Service program added!");
    } catch (err) {
      alert("Failed to add service.");
    }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('donations').insert([{
        ...newDonation,
        amount: parseFloat(newDonation.amount),
        status: 'completed'
      }]);
      if (error) throw error;
      setNewDonation({ donor_name: "", donor_email: "", amount: "", frequency: "one-time" });
      fetchData();
      alert("Manual donation recorded!");
    } catch (err) {
      alert("Failed to record donation.");
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('resources').insert([newResource]);
      if (error) throw error;
      setNewResource({ title: "", type: "PDF", size: "", file_url: "" });
      fetchData();
      alert("Digital resource added!");
    } catch (err) {
      alert("Failed to add resource.");
    }
  };

  const handleAddStateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('state_events').insert([{
        state: newStateEvent.state,
        title: newStateEvent.title,
        description: newStateEvent.desc,
        event_date: newStateEvent.date,
        location: newStateEvent.location
      }]);
      if (error) throw error;
      setNewStateEvent({ state: "Delhi", title: "", desc: "", date: "", location: "" });
      fetchData();
      alert("State event added!");
    } catch (err) {
      alert("Failed to add state event.");
    }
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'volunteers', name: 'Volunteer Force', icon: '🤝' },
    { id: 'donations', name: 'Impact Funds', icon: '💰' },
    { id: 'contacts', name: 'Messages & Queries', icon: '✉️' },
    { id: 'events', name: 'Events Hub', icon: '📅' },
    { id: 'services', name: 'Programs/Services', icon: '🛠️' },
    { id: 'resources', name: 'Digital Library', icon: '📚' },
    { id: 'blog', name: 'Write Articles', icon: '✍️' },
    { id: 'testimonials', name: 'Success Stories', icon: '✨' },
    { id: 'state_events', name: 'State Initiatives', icon: '📍' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <span className={`font-bold text-xl text-primary-400 ${!isSidebarOpen && 'hidden'}`}>PCHR&R Admin</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
            {isSidebarOpen ? '⬅️' : '➡️'}
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">{menuItems.find(i => i.id === activeTab)?.name}</h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Live Database
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold border border-slate-700">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Volunteers", val: stats.volunteers, color: "from-blue-600 to-indigo-700", icon: "🤝" },
                  { label: "Donations Count", val: stats.donations, color: "from-emerald-600 to-teal-700", icon: "📈" },
                  { label: "Total Funds", val: `₹${stats.donationAmount.toLocaleString()}`, color: "from-amber-500 to-orange-600", icon: "💰" },
                  { label: "Unread Messages", val: stats.messages, color: "from-rose-600 to-pink-700", icon: "✉️" },
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions / Feed */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <span className="mr-2">⚡</span> Quick System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-bold">Next Event Scheduled</p>
                        <p className="text-sm text-slate-400">Regular Awareness Session</p>
                      </div>
                      <span className="px-3 py-1 bg-green-900/40 text-green-400 rounded-full text-xs font-bold border border-green-800/50">ACTIVE</span>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-bold">New Suggestion Received</p>
                        <p className="text-sm text-slate-400">Check Contact Messages for Event Ideas</p>
                      </div>
                      <span className="text-slate-400 text-xs">Recently</span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-900/20 border border-primary-800/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Admin Shortcuts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab('events')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-all border border-slate-700 shadow-sm">
                      <div className="text-2xl mb-1">📅</div>
                      <span className="text-xs">New Event</span>
                    </button>
                    <button onClick={() => setActiveTab('blog')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-all border border-slate-700 shadow-sm">
                      <div className="text-2xl mb-1">✍️</div>
                      <span className="text-xs">Post Blog</span>
                    </button>
                    <button onClick={() => setActiveTab('volunteers')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-all border border-slate-700 shadow-sm">
                      <div className="text-2xl mb-1">🤝</div>
                      <span className="text-xs">Check Regs</span>
                    </button>
                    <button onClick={() => setActiveTab('contacts')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-center transition-all border border-slate-700 shadow-sm">
                      <div className="text-2xl mb-1">✉️</div>
                      <span className="text-xs">Inbox</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setVolunteerSubTab('ngo')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${volunteerSubTab === 'ngo' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  NGO Pillar Applicants
                </button>
                <button 
                  onClick={() => setVolunteerSubTab('event')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${volunteerSubTab === 'event' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Event-Specific Regs
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">{volunteerSubTab === 'ngo' ? 'Program' : 'Event'}</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {volunteerSubTab === 'ngo' ? (
                      volunteers.map(v => (
                        <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-bold">{v.full_name}</td>
                          <td className="px-6 py-4 text-sm text-slate-400">{v.email}<br/>{v.phone}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-md border border-blue-800/50">{v.program}</span>
                          </td>
                          <td className="px-6 py-4 capitalize">
                             <select 
                               value={v.status} 
                               onChange={(e) => handleUpdateStatus('volunteers', v.id, e.target.value)}
                               className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs outline-none"
                             >
                               <option value="pending">Pending</option>
                               <option value="reviewed">Reviewed</option>
                               <option value="active">Active</option>
                             </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete('volunteers', v.id)} className="text-rose-500 hover:text-rose-400 ml-4 font-bold">🗑️</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      eventRegs.map(e => (
                        <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-bold">{e.full_name}</td>
                          <td className="px-6 py-4 text-sm text-slate-400">{e.email}<br/>{e.phone}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-primary-400">{e.event_title}</td>
                          <td className="px-6 py-4">
                             <select 
                               value={e.status} 
                               onChange={(e_target) => handleUpdateStatus('event_registrations', e.id, e_target.target.value)}
                               className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs outline-none"
                             >
                               <option value="pending">Pending</option>
                               <option value="confirmed">Confirmed</option>
                               <option value="attended">Attended</option>
                               <option value="no-show">No Show</option>
                             </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete('event_registrations', e.id)} className="text-rose-500 hover:text-rose-400 font-bold">🗑️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">Manual Record Entry</h3>
                <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Donor Name" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newDonation.donor_name} onChange={e => setNewDonation({...newDonation, donor_name: e.target.value})} />
                  <input type="email" placeholder="Email" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newDonation.donor_email} onChange={e => setNewDonation({...newDonation, donor_email: e.target.value})} />
                  <input type="number" placeholder="Amount" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newDonation.amount} onChange={e => setNewDonation({...newDonation, amount: e.target.value})} />
                  <button type="submit" className="bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all">Record Donation</button>
                </form>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden ring-1 ring-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Donor</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Frequency</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id} className="border-t border-slate-800">
                        <td className="px-6 py-4"><strong>{d.donor_name}</strong><br/><span className="text-xs text-slate-500">{d.donor_email}</span></td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">₹{d.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 uppercase text-xs font-bold">{d.frequency}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{new Date(d.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete('donations', d.id)} className="text-rose-500 font-bold">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`p-6 rounded-2xl border transition-all ${m.status === 'resolved' ? 'bg-slate-900 shadow-inner border-slate-800 opacity-60' : 'bg-slate-800/50 shadow-xl border-slate-700'}`}>
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase mr-2 ${m.subject?.toLowerCase().includes('suggest') ? 'bg-purple-900 text-purple-400' : 'bg-primary-900 text-primary-400'}`}>
                         {m.subject || 'GENERAL'}
                       </span>
                       <h4 className="font-bold text-lg inline-block">{m.name}</h4>
                       <p className="text-xs text-slate-400">{m.email} • {new Date(m.created_at).toLocaleString()}</p>
                     </div>
                     <div className="flex space-x-2">
                       {m.status !== 'resolved' && (
                         <button 
                           onClick={() => handleUpdateStatus('contacts', m.id, 'resolved')}
                           className="px-3 py-1 bg-green-900 border border-green-800 text-green-400 text-xs font-bold rounded-lg hover:bg-green-800"
                         >
                           Mark Resolved
                         </button>
                       )}
                       <button onClick={() => handleDelete('contacts', m.id)} className="bg-rose-900/30 text-rose-500 p-2 rounded-lg">🗑️</button>
                     </div>
                   </div>
                   <p className="text-slate-300 leading-relaxed italic">"{m.message}"</p>
                </div>
              ))}
              {messages.length === 0 && <div className="text-center py-20 text-slate-600">No messages yet.</div>}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sticky top-0">
                <h3 className="text-2xl font-bold mb-6">Schedule New Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <input type="text" placeholder="Event Title" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  <input type="datetime-local" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  <input type="text" placeholder="Location" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  <textarea placeholder="Description..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 h-32" required value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} />
                  <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all shadow-lg">Launch Event</button>
                </form>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Initiatives List</h3>
                {events.map(e => (
                  <div key={e.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{e.title}</h4>
                      <div className="flex space-x-3 items-center">
                        <button 
                          className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors bg-primary-400/10 px-3 py-1.5 rounded-lg border border-primary-400/20" 
                          onClick={() => setEditingEvent(e)}
                        >
                          Manage Gallery & Report
                        </button>
                        <button onClick={() => handleDelete('events', e.id)} className="text-rose-500 hover:scale-110 transition-transform">🗑️</button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center mb-4">
                      <span className="mr-3">📅 {new Date(e.event_date).toLocaleDateString()}</span>
                      <span>📍 {e.location}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${e.status === 'upcoming' ? 'bg-green-900/40 text-green-400 border border-green-800/50' : e.status === 'past' || e.status === 'completed' ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-slate-800 text-slate-400'}`}>
                        {e.status}
                      </span>
                      {e.gallery_urls && e.gallery_urls.length > 0 && (
                        <span className="text-[10px] text-slate-500 font-bold uppercase">📸 {e.gallery_urls.length} Photos</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Event Modal */}
          {editingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Manage Event</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{editingEvent.title}</p>
                  </div>
                  <button onClick={() => setEditingEvent(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <form id="edit-event-form" onSubmit={handleUpdateEvent} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:border-primary-500 transition-all font-medium" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                        <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:border-primary-500 transition-all font-medium" value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Event Status</label>
                      <div className="flex gap-3">
                        {['upcoming', 'completed', 'cancelled'].map(status => (
                          <button 
                            key={status}
                            type="button"
                            onClick={() => setEditingEvent({...editingEvent, status})}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${editingEvent.status === status ? 'bg-primary-600 border-primary-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Photo Gallery (Upload Event Photos)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-slate-950 rounded-[2rem] border border-slate-800 min-h-[120px]">
                        {editingEvent.gallery_urls?.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeGalleryImage(url)}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-800 hover:border-primary-500 hover:bg-primary-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group ${uploadingImage ? 'animate-pulse pointer-events-none' : ''}`}>
                          <input type="file" className="hidden" accept="image/*" onChange={handleUploadEventImage} />
                          {uploadingImage ? (
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸</span>
                              <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-primary-500">Add Photo</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Post-Event Report / Summary</label>
                      <div className="bg-slate-800 border border-slate-700 rounded-[2rem] overflow-hidden min-h-[250px]">
                        <ReactQuill 
                          theme="snow" 
                          value={editingEvent.report_html || ""} 
                          onChange={(val) => setEditingEvent({...editingEvent, report_html: val})}
                          modules={quillModules}
                          className="h-full border-none text-white"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-6 border-t border-slate-800 flex gap-4 bg-slate-900/50">
                  <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 py-4 border-2 border-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Cancel</button>
                  <button type="submit" form="edit-event-form" className="flex-[2] py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary-900/20 transition-all active:scale-95">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Manage Services / Courses</h3>
                <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input type="text" placeholder="Title (e.g. Digital Literacy)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} />
                    <input type="text" placeholder="Icon Emoji (e.g. 💻)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newService.icon} onChange={e => setNewService({...newService, icon: e.target.value})} />
                    <input type="text" placeholder="Schedule" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newService.schedule} onChange={e => setNewService({...newService, schedule: e.target.value})} />
                    <input type="text" placeholder="Image URL" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" value={newService.image_url} onChange={e => setNewService({...newService, image_url: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <textarea placeholder="Description..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none h-24" required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
                    <textarea placeholder="Highlights (Comma separated)..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none h-24" required value={newService.highlights} onChange={e => setNewService({...newService, highlights: e.target.value})} />
                    <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all">Publish Service</button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
                    <div className="text-4xl mb-4">{s.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{s.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{s.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{s.schedule}</span>
                      <button onClick={() => handleDelete('services', s.id)} className="text-rose-500 hover:scale-110 transition-transform">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-8">
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Add Digital Resource</h3>
                  <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Title (e.g. Maths PDF)" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none md:col-span-2" required value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
                    <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})}>
                      <option>PDF</option>
                      <option>ZIP</option>
                      <option>PNG</option>
                      <option>JPG</option>
                    </select>
                    <input type="text" placeholder="Size (e.g. 2.5 MB)" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newResource.size} onChange={e => setNewResource({...newResource, size: e.target.value})} />
                    <input type="text" placeholder="Source URL / Link" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none md:col-span-3" required value={newResource.file_url} onChange={e => setNewResource({...newResource, file_url: e.target.value})} />
                    <button type="submit" className="bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all">Add To Library</button>
                  </form>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden ring-1 ring-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Resource</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {resources.map(r => (
                      <tr key={r.id}>
                        <td className="px-6 py-4 font-bold">{r.title}</td>
                        <td className="px-6 py-4 text-xs font-mono">{r.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{r.size}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete('resources', r.id)} className="text-rose-500">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="grid lg:grid-cols-2 gap-8">
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Write New Article</h3>
                  <form onSubmit={handleAddBlog} className="space-y-4">
                    <input type="text" placeholder="Article Title" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})}>
                        <option>Education</option>
                        <option>Environment</option>
                        <option>Health</option>
                        <option>Rights</option>
                      </select>
                      <input type="text" placeholder="Author" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Image URL" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" value={newBlog.image_url} onChange={e => setNewBlog({...newBlog, image_url: e.target.value})} />
                    
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden min-h-[300px]">
                      <ReactQuill
                        theme="snow"
                        value={newBlog.content}
                        onChange={(content) => setNewBlog({ ...newBlog, content })}
                        modules={quillModules}
                        placeholder="Write your article content here..."
                        className="text-slate-100"
                      />
                    </div>

                    <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all">Publish</button>
                  </form>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-bold">Manage Articles</h3>
                  {blogPosts.map(bp => (
                    <div key={bp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center group">
                      <div>
                        <h4 className="font-bold line-clamp-1 text-sm">{bp.title}</h4>
                      </div>
                      <button onClick={() => handleDelete('blog_posts', bp.id)} className="text-rose-500">🗑️</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
             <div className="max-w-4xl">
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold mb-6">New Success Story</h3>
                  <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Person's Name" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} />
                    <input type="text" placeholder="Role/Class" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none" required value={newTestimonial.role} onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})} />
                    <textarea placeholder="Testimonial..." className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none h-32" required value={newTestimonial.content} onChange={e => setNewTestimonial({...newTestimonial, content: e.target.value})} />
                    <button type="submit" className="md:col-span-2 py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all">Publish</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {testimonials.map(t => (
                   <div key={t.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative group">
                     <button onClick={() => handleDelete('testimonials', t.id)} className="absolute top-4 right-4 text-rose-500">🗑️</button>
                     <p className="text-slate-300 text-sm italic mb-4">"{t.content}"</p>
                     <p className="font-bold">{t.name}</p>
                   </div>
                 ))}
               </div>
             </div>
          )}


          {activeTab === 'state_events' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
                   <h3 className="text-xl font-bold mb-6 flex items-center">
                     <span className="w-8 h-8 bg-primary-600/20 text-primary-400 rounded-lg flex items-center justify-center mr-3 text-lg">📍</span>
                     Add State Initiative / Event
                   </h3>
                   <form onSubmit={handleAddStateEvent} className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select State</label>
                         <select
                            required
                            value={newStateEvent.state}
                            onChange={(e) => setNewStateEvent({...newStateEvent, state: e.target.value})}
                            className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                         >
                            {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Title</label>
                         <input
                            required
                            type="text"
                            placeholder="e.g. Legal Awareness Drive"
                            value={newStateEvent.title}
                            onChange={(e) => setNewStateEvent({...newStateEvent, title: e.target.value})}
                            className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
                         <input
                            required
                            type="date"
                            value={newStateEvent.date}
                            onChange={(e) => setNewStateEvent({...newStateEvent, date: e.target.value})}
                            className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium color-scheme-dark"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location (City/District)</label>
                         <input
                            type="text"
                            placeholder="e.g. Lucknow"
                            value={newStateEvent.location}
                            onChange={(e) => setNewStateEvent({...newStateEvent, location: e.target.value})}
                            className="w-full h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                         />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Details</label>
                         <textarea
                            rows={3}
                            placeholder="Briefly describe the impact or what happened..."
                            value={newStateEvent.desc}
                            onChange={(e) => setNewStateEvent({...newStateEvent, desc: e.target.value})}
                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                         />
                      </div>
                      <div className="md:col-span-2">
                         <button type="submit" className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-900/20 transition-all active:scale-[0.98]">
                            Add Initiative
                         </button>
                      </div>
                   </form>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                   {stateEvents.map(se => (
                      <div key={se.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group">
                         <button onClick={() => handleDelete('state_events', se.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                         <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-primary-600/10 text-primary-400 text-[10px] font-black uppercase rounded-lg border border-primary-600/20">
                               {se.state}
                            </span>
                            <span className="text-slate-500 text-[10px] font-bold">{se.event_date}</span>
                         </div>
                         <h4 className="font-bold text-slate-100 mb-2">{se.title}</h4>
                         {se.location && <p className="text-xs text-primary-400 mb-2">📍 {se.location}</p>}
                         <p className="text-xs text-slate-400 leading-relaxed">{se.description}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {loading && (
             <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
