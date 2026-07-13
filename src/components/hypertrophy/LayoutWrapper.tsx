"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Dumbbell,
  ClipboardList,
  Flame,
  Utensils,
  LineChart,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  Sparkles,
  Bell,
  Award
} from "lucide-react";

interface LayoutWrapperProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export default function LayoutWrapper({
  currentTab,
  onTabChange,
  children,
}: LayoutWrapperProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Volume alert: Quadriceps volume optimal this week.", type: "success" },
    { id: 2, text: "AI Recommendation: Add Incline DB Press to hit Upper Chest.", type: "tip" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: "overview", name: "Dashboard", icon: LayoutDashboard },
    { id: "anatomy", name: "3D Anatomy", icon: Activity },
    { id: "exercises", name: "Exercise DB", icon: Dumbbell },
    { id: "planner", name: "Workout Planner", icon: ClipboardList },
    { id: "recovery", name: "Recovery & Volume", icon: Flame },
    { id: "nutrition", name: "Macros & Supps", icon: Utensils },
    { id: "progress", name: "Progress Tracker", icon: LineChart },
    { id: "coach", name: "AI Coach", icon: MessageSquare },
    { id: "academy", name: "Sci-Fit Academy", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white font-sans antialiased overflow-x-hidden w-full max-w-full">
      {/* Background Radial Glow */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-[#1e293b]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-blue-900/10 blur-[150px]" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/40 bg-[#0B0F19]/80 backdrop-blur-xl fixed h-screen z-30">
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-slate-800/40 gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-widest bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              HYPERTROPHY AI
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
              Sci-Fi Hypertrophy
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 relative group ${
                  isActive
                    ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/20 border border-transparent"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-blue-500" />
                )}
                <Icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Pro Badge */}
        <div className="p-4 border-t border-slate-800/40">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden flex flex-col gap-2">
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-blue-500/5 blur-xl" />
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scientist Tier</span>
            </div>
            <div className="text-[11px] font-bold text-slate-300 leading-snug">
              Unlock Hypertrophy algorithms & volume limits.
            </div>
            <div className="text-[10px] font-mono text-blue-500 mt-1">STATUS: COMPLIANT</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header HUD */}
        <header className="h-16 border-b border-slate-800/40 bg-[#0B0F19]/60 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current route display */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
              <span>SYSTEMS</span>
              <span>/</span>
              <span className="text-blue-500 font-bold">{currentTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800/80 rounded-full text-[10px] font-mono text-slate-400">
              <Sparkles className="h-3 w-3 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>STREAK: 12 DAYS</span>
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-800/60 bg-slate-900/50 hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-72 rounded-2xl border border-slate-800 bg-[#0e1626] p-4 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-bold text-slate-400">SYSTEM NOTIFICATIONS</span>
                      <button onClick={() => setNotifications([])} className="text-[10px] text-blue-400 hover:underline">Clear all</button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-slate-500 py-2 text-center">No new notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/50 text-[10px] text-slate-300 leading-snug flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                            <span>{n.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs bg-[#0B0F19] border-r border-slate-800 h-full p-6 animate-in slide-in-from-left duration-200 z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Flame className="h-4 w-4" />
                </div>
                <span className="text-xs font-black tracking-widest text-blue-400">HYPERTROPHY AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/20"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-slate-800/60 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">U</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Guest Scientist</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest">Weight: 78kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
