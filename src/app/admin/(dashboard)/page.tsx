import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Shield, 
  LogOut, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  Activity, 
  Layers, 
  UserCheck, 
  Clock, 
  Mail 
} from 'lucide-react'
import { signOutAdmin } from '@/app/actions/auth'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // 1. Fetch authenticated user details
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Extra safety redirection: If session is empty, redirect to login
  if (!user) {
    redirect('/admin/login')
  }

  // 3. Fetch summary stats from Supabase
  const { count: contactCount } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })

  const { count: eventCount } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })

  // 4. Fetch the 5 most recent contact inquiries
  const { data: recentMessages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Server action to trigger signout
  const handleLogout = async () => {
    'use server'
    await signOutAdmin()
    redirect('/admin/login')
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            HQ Dashboard Overview
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Real-time operations, analytics events, and workspace parameters.
          </p>
        </div>
        
        <div className="flex items-center gap-2 border border-white/5 bg-white/[0.02] px-3.5 py-1.5 rounded-full text-xs text-white/60 w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase text-white/80">
            System Online
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1: Contact Messages */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#ED3F27]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#ED3F27]/5 blur-2xl group-hover:bg-[#ED3F27]/10 transition-all duration-300" />
          <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 text-[#ED3F27]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">Inquiries</p>
          <h3 className="text-3xl font-black mt-1 font-display tracking-tight text-white">{contactCount ?? 0}</h3>
        </div>

        {/* Card 2: Projects */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#00E5FF]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#00E5FF]/5 blur-2xl group-hover:bg-[#00E5FF]/10 transition-all duration-300" />
          <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 text-[#00E5FF]">
            <Briefcase className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">Case Studies</p>
          <h3 className="text-3xl font-black mt-1 font-display tracking-tight text-white">{projectCount ?? 0}</h3>
        </div>

        {/* Card 3: Services */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#BF5AF2]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#BF5AF2]/5 blur-2xl group-hover:bg-[#BF5AF2]/10 transition-all duration-300" />
          <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 text-[#BF5AF2]">
            <Layers className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">Services</p>
          <h3 className="text-3xl font-black mt-1 font-display tracking-tight text-white">{serviceCount ?? 0}</h3>
        </div>

        {/* Card 4: Events Logged */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#FF9F0A]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#FF9F0A]/5 blur-2xl group-hover:bg-[#FF9F0A]/10 transition-all duration-300" />
          <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 text-[#FF9F0A]">
            <Activity className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">Events Traced</p>
          <h3 className="text-3xl font-black mt-1 font-display tracking-tight text-white">{eventCount ?? 0}</h3>
        </div>
      </section>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Form Inquiries Table - 8 Columns */}
        <section className="lg:col-span-8 bg-[#121212] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#ED3F27]" />
              <h3 className="text-sm font-black uppercase tracking-wider font-display text-white">
                Latest Inbox Submissions
              </h3>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#ED3F27] bg-[#ED3F27]/10 px-2 py-0.5 rounded font-mono">
              REAL-TIME
            </span>
          </div>

          {recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-4 hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        {msg.company} • <span className="font-mono text-[10px]">{msg.email}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-white/30 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {msg.services && msg.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {msg.services.map((srv: string) => (
                        <span 
                          key={srv} 
                          className="text-[9px] font-bold bg-[#ED3F27]/5 text-[#ED3F27] border border-[#ED3F27]/10 px-2 py-0.5 rounded"
                        >
                          {srv}
                        </span>
                      ))}
                      {msg.budget && (
                        <span className="text-[9px] font-bold bg-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/10 px-2 py-0.5 rounded">
                          {msg.budget}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-white/60 leading-relaxed border-t border-white/5 pt-2.5 mt-2">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-white/[0.005]">
              <MessageSquare className="h-8 w-8 text-white/20 mb-2" />
              <p className="text-xs text-white/60">No contact messages received yet.</p>
              <p className="text-[10px] text-white/20 mt-1">Configure your contact page to call the submit Server Action.</p>
            </div>
          )}
        </section>

        {/* Administration Guidelines - 4 Columns */}
        <section className="lg:col-span-4 bg-[#121212] border border-white/5 p-6 rounded-2xl h-fit">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
            <Settings className="h-4 w-4 text-[#FF9F0A]" />
            <h3 className="text-sm font-black uppercase tracking-wider font-display text-white">
              HQ Parameters
            </h3>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-white/60">
            <div>
              <p className="font-bold text-white mb-1">🔐 Row Level Security (RLS)</p>
              <p>All tables are locked down. Public inserts are permitted on `contact_messages` and `analytics_events` so clients can write logs directly, but SELECT/UPDATE operations require verified admin status.</p>
            </div>
            
            <div className="border-t border-white/5 pt-4">
              <p className="font-bold text-white mb-1">💼 Case Studies & Services</p>
              <p>Write permissions for `projects` and `services` are locked down. You can seed them directly via the SQL editor or by building an admin interface utilizing the admin client.</p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="font-bold text-white mb-1">📊 Event Tracking</p>
              <p>Analytics events track visitor interaction on the frontend. Use these logs to compute conversation rates, page dwell times, and campaign attribution.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
