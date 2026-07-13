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
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              ACADEMIC STATS
            </span>
            <div className="text-sm font-black text-slate-800">
              {completedLessons.length} / {lessons.length} Modules Read
            </div>
            <span className="block text-[10px] text-slate-400 font-mono">
              Status: {completedLessons.length === lessons.length ? "HYPERTROPHY PROFESSOR" : "STUDENT SCIENTIST"}
            </span>
          </div>

          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Lessons List selector */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-3">
            CURRICULUM MODULES
          </span>

          <div className="space-y-1.5">
            {lessons.map((lesson) => {
              const isActive = lesson.id === activeLessonId;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 border-blue-100 text-blue-600 font-bold"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-xs font-bold block">{lesson.title}</span>
                    <span className="text-[9px] font-mono text-slate-450 flex items-center gap-1 block">
                      <Clock className="h-3 w-3" /> {lesson.duration}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-650 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Syllabus details block & FAQ accordion */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeLesson ? (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  {activeLesson.duration} SCIENTIFIC MODULE
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">{activeLesson.title}</h2>
              </div>

              <button
                onClick={() => toggleLessonComplete(activeLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  completedLessons.includes(activeLesson.id)
                    ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {completedLessons.includes(activeLesson.id) ? "Module Completed" : "Mark as Read"}
              </button>
            </div>

            {/* Core Text Body */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-4 font-medium">
              {activeLesson.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Scientific citation note */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-blue-600 uppercase tracking-widest font-black">ILLUSTRATION PROTOCOL DETAIL</span>
                <p className="text-[10px] text-slate-600 font-mono">
                  {activeLesson.illustrationText}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center py-20 flex-1">
            <BookOpen className="h-8 w-8 text-slate-350 animate-pulse mx-auto mb-2" />
            <div className="text-xs text-slate-500 font-bold">Select a lesson...</div>
          </div>
        )}

        {/* Hypertrophy science FAQ accordions */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-0.5 border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5" />
              FREQUENTLY ASKED TRAINING SCIENCE QUESTIONS
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">Hypertrophy FAQ Portal</h3>
          </div>

          <div className="space-y-2">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4.5 w-4.5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white font-medium">
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
