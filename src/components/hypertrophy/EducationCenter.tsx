"use client";

import React, { useState } from "react";
import { lessons, faqs } from "@/lib/hypertrophyData";
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Award,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

export default function EducationCenter() {
  const [activeLessonId, setActiveLessonId] = useState<string>("hypertrophy_basics");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const toggleLessonComplete = (id: string) => {
    setCompletedLessons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Academy Lessons Drawer Column */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Achievements Badge */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121A2E]/60 to-[#0A0D16]/90 border border-blue-500/10 shadow-2xl relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              ACADEMIC STATS
            </span>
            <div className="text-sm font-black text-white">
              {completedLessons.length} / {lessons.length} Modules Read
            </div>
            <span className="block text-[10px] text-slate-500 font-mono">
              Status: {completedLessons.length === lessons.length ? "HYPERTROPHY PROFESSOR" : "STUDENT SCIENTIST"}
            </span>
          </div>

          <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Lessons List selector */}
        <div className="p-4 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md space-y-2">
          <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-3">
            ACADEMY CURRICULUM
          </span>

          <div className="space-y-2">
            {lessons.map((l) => {
              const isActive = l.id === activeLessonId;
              const isDone = completedLessons.includes(l.id);

              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonId(l.id)}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-500/10 border-blue-500/35 text-blue-400 font-bold"
                      : "bg-[#090D16]/50 border-slate-800/50 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-bold block">{l.title}</span>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {l.duration} • {l.category}
                    </span>
                  </div>
                  
                  {isDone ? (
                    <CheckCircle className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4.5 w-4.5 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Lesson Reader & FAQs Column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Lesson Reader Card */}
        {activeLesson ? (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header info */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeLesson.category} LESSON MOD
                </span>
                <h2 className="text-2xl font-black text-white">{activeLesson.title}</h2>
              </div>

              <button
                onClick={() => toggleLessonComplete(activeLesson.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase font-mono tracking-widest transition-all ${
                  completedLessons.includes(activeLesson.id)
                    ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {completedLessons.includes(activeLesson.id) ? "Marked as Completed" : "Mark as Completed"}
              </button>
            </div>

            {/* Paragraph Contents */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-medium">
              {activeLesson.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Scientific Illustration text box */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/15 font-mono text-[10px] text-blue-400">
              <span className="font-black block mb-1">DIAGRAM REFERENCE SUMMARY:</span>
              <span className="text-slate-300">{activeLesson.illustrationText}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md text-center py-20">
            <BookOpen className="h-8 w-8 text-slate-700 animate-pulse mx-auto mb-2" />
            <div className="text-xs text-slate-500">Loading module reader...</div>
          </div>
        )}

        {/* FAQs Accordion */}
        <div className="p-6 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md space-y-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5" />
              HYPERTROPHY KNOWLEDGE BASE
            </span>
            <h3 className="text-lg font-black text-white">Scientific Q&A Accordion</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-800/60 bg-[#0B0F19]/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-blue-400" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed font-medium border-t border-slate-850 pt-3 animate-in fade-in slide-in-from-top-1 duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
