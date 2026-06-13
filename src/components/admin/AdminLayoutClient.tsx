'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { playSound } from '@/lib/sounds'
import { 
  LayoutGrid, 
  Gem, 
  FolderKanban, 
  HeartHandshake, 
  MessageCircle, 
  CircleHelp, 
  UsersRound, 
  Mail, 
  TrendingUp, 
  Settings, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Database,
  Flame,
  LineChart,
  ClipboardList,
  Sliders,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AdminLayoutClientProps {
  children: React.ReactNode
  userEmail: string
  handleLogout: () => Promise<void>
}

export default function AdminLayoutClient({ 
  children, 
  userEmail, 
  handleLogout 
}: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileMenuOpen(false)
    }
  }, [pathname, isMobileMenuOpen])

  // Listen for new messages globally in admin panel
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('admin-message-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        () => {
          playSound('notification')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/hero', label: 'Home Hero', icon: Flame },
    { href: '/admin/services', label: 'Services', icon: Gem },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/clients', label: 'Clients', icon: HeartHandshake },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageCircle },
    { href: '/admin/review-submissions', label: 'Review Submissions', icon: ClipboardList },
    { href: '/admin/faq', label: 'FAQ', icon: CircleHelp },
    { href: '/admin/team', label: 'Team', icon: UsersRound },
    { href: '/admin/results', label: 'Results Stats', icon: LineChart },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/admin/about', label: 'About Page', icon: FileText },
    { href: '/admin/plans', label: 'Plans', icon: Sliders },
    { href: '/admin/contact', label: 'Contact', icon: Phone },
  ]

  // Get active menu item label
  const activeItem = menuItems.find(item => item.href === pathname) || menuItems[0]

  return (
    <div className="bg-[#111111] min-h-screen text-white font-sans flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r border-white/5 bg-[#121212]/40 backdrop-blur-md sticky top-0 h-screen shrink-0 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`h-20 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center px-0 flex-col py-2' : 'justify-between px-4'} gap-2 relative`}>
          <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'flex-col gap-1' : ''}`}>
            <div className={`flex items-center justify-center shrink-0 ${isSidebarCollapsed ? 'h-8 w-8' : 'h-10 w-10'}`}>
              <img src="/icon-light.png" alt="Flamnow Icon" className="h-full w-full object-contain drop-shadow-sm" />
            </div>
            {!isSidebarCollapsed && (
              <div className="whitespace-nowrap">
                <h1 className="text-sm font-black uppercase tracking-tight font-display">
                  FLAMNOW HQ
                </h1>
                <p className="text-[9px] font-bold tracking-widest text-[#ED3F27] uppercase font-mono">
                  ADMIN CONSOLE
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ${
              isSidebarCollapsed ? 'mt-1' : ''
            }`}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 relative group ${
                  isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                } ${
                  isActive 
                    ? 'text-[#ED3F27] bg-[#ED3F27]/5 border border-[#ED3F27]/10 shadow-[0_0_15px_rgba(237,63,39,0.05)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#ED3F27]' : 'text-white/60 group-hover:text-white'}`} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
                {isActive && !isSidebarCollapsed && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 rounded-r-full bg-[#ED3F27]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && isSidebarCollapsed && (
                  <div className="absolute left-0 w-1 h-4 rounded-r-full bg-[#ED3F27]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer User Badge & Logout */}
        <div className={`p-4 border-t border-white/5 bg-[#121212]/20 space-y-3 ${isSidebarCollapsed ? 'flex flex-col items-center px-2' : ''}`}>
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2 border border-white/5 bg-white/[0.01] px-3 py-2 rounded-xl text-xs text-white/60">
              <UserCheck className="h-4 w-4 text-[#ED3F27] shrink-0" />
              <span className="font-mono text-[10px] truncate" title={userEmail}>
                {userEmail}
              </span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center text-white/60" title={userEmail}>
              <UserCheck className="h-4 w-4 text-[#ED3F27]" />
            </div>
          )}

          <form action={handleLogout} className="w-full">
            <button 
              type="submit"
              title="Exit Console"
              className={`flex items-center justify-center border border-border bg-[#121212] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSidebarCollapsed ? 'w-10 h-10 mx-auto' : 'w-full gap-2 py-2.5'
              }`}
            >
              <LogOut className="h-4 w-4" />
              {!isSidebarCollapsed && <span>Exit Console</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden h-20 px-6 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center shrink-0">
              <img src="/icon-light.png" alt="Flamnow Icon" className="h-full w-full object-contain" />
            </div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-tight font-display">
              FLAMNOW HQ
            </h1>
            <p className="text-[8px] font-bold tracking-widest text-[#ED3F27] uppercase font-mono">
              CONSOLE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 bg-[#121212] px-2.5 py-1 rounded-lg">
            {activeItem.label}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-10 w-10 border border-border bg-[#121212] rounded-xl flex items-center justify-center text-white/60 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#121212] border-r border-white/5 z-50 flex flex-col md:hidden pt-20"
            >
              {/* Drawer Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive 
                          ? 'text-[#ED3F27] bg-[#ED3F27]/5 border border-[#ED3F27]/10' 
                          : 'text-white/60 hover:text-white hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#ED3F27]' : 'text-white/60'}`} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
<div className="flex items-center gap-2 border border-white/5 bg-white/[0.01] px-3 py-2 rounded-xl text-xs text-white/60">
                  <UserCheck className="h-4 w-4 text-[#ED3F27]" />
                  <span className="font-mono text-[10px] truncate">{userEmail}</span>
                </div>

                <form action={handleLogout}>
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 border border-border bg-[#121212] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Console</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <main className="flex-1 min-h-[calc(100vh-80px)] md:min-h-screen overflow-x-hidden p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
