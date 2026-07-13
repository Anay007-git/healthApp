"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  RotateCcw
} from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export default function AiCoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "coach",
      text: "Hello! I am your AI Hypertrophy Coach, specialized in exercise biomechanics and nutrition science. Ask me anything about lagging muscle groups, workout programming, RPE, or meal schedules.",
      timestamp: "12:00"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCounter, setMsgCounter] = useState(2);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const predefinedQuestions = [
    { q: "My upper chest isn't growing.", id: "upper_chest" },
    { q: "Suggest better back exercises.", id: "back" },
    { q: "Explain RPE & RIR.", id: "rpe" },
    { q: "How much protein should I eat?", id: "protein" }
  ];

  const getCoachResponse = (q: string): string => {
    const norm = q.toLowerCase();
    if (norm.includes("chest") || norm.includes("upper chest")) {
      return "To target your upper chest (clavicular head), you must perform incline press variations at a 30 to 45-degree angle. Lower angles (e.g. 30 degrees) keep shoulder stress minimal while keeping the upper chest loaded. Keep your shoulder blades retracted and depressed at the bottom to maximize pectoralis mechanical stretch, avoiding front-delt compensation.";
    }
    if (norm.includes("back") || norm.includes("rows") || norm.includes("pulldown")) {
      return "A complete back requires training both width (lats) and thickness (traps & rhomboids). For lats width: prioritize single-arm lat pulldowns or wide-grip lat pulldowns, keeping elbows tucked close. For thickness: chest-supported T-Bar rows or dumbbell rows are superior as they eliminate lower back stabilization constraints, letting you row to mechanical failure safely.";
    }
    if (norm.includes("rpe") || norm.includes("rir") || norm.includes("failure")) {
      return "RPE (Rate of Perceived Exertion) is based on RIR (Reps in Reserve). Hypertrophy science confirms that sets must be taken within 1 to 3 RIR of failure (RPE 7-9) to stimulate optimal protein synthesis. Training to absolute structural failure (RPE 10) creates high central fatigue, which can impair overall recovery and weekly set volume.";
    }
    if (norm.includes("protein") || norm.includes("macro") || norm.includes("eat")) {
      return "For hypertrophy, consume 1.6 to 2.2 grams of protein per kilogram of bodyweight daily (roughly 0.8-1g per lb). If you are in a calorie deficit, elevate intake to 2.4-2.6g/kg to preserve lean muscle tissue. Distribute this protein across 3 to 5 meals, spaced 3-5 hours apart, each containing at least 30g of protein to maximize Muscle Protein Synthesis spikes.";
    }
    return "That's an excellent question! Hypertrophy research confirms that the four foundational pillars of muscle growth are: 1. Progressive overload (adding weight or reps), 2. Controlled eccentrics (2-3s lowering phase) loading the muscle under stretch, 3. Consistent training within 1-3 Reps in Reserve, and 4. Systemic recovery (7-9 hours sleep, daily protein cap).";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: msgCounter,
      sender: "user",
      text,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    const nextId = msgCounter + 1;
    setMsgCounter(prev => prev + 2);

    // Simulate coach response latency
    setTimeout(() => {
      const coachMsg: Message = {
        id: nextId,
        sender: "coach",
        text: getCoachResponse(text),
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] items-stretch animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Suggestions column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[#090D16]/60 border border-slate-800/60 backdrop-blur-md flex flex-col gap-6 h-full">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-black flex items-center gap-1.5">
            <BrainCircuit className="h-4 w-4" />
            AI COMPANION CONSOLE
          </span>
          <h3 className="text-lg font-black text-white font-sans">Scientific Queries</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Select a quick-suggest query to ask your AI coach or type your own question in the input prompt.
        </p>

        <div className="flex-1 space-y-2">
          {predefinedQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => handleSend(q.q)}
              className="w-full text-left p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800 hover:border-blue-500/35 hover:bg-blue-500/5 transition-all text-xs font-semibold text-slate-300 flex items-center justify-between group"
            >
              <span>{q.q}</span>
              <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-850 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Chat History
        </button>
      </div>

      {/* Main chat interface column */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-[#090D16]/40 border border-slate-800/60 backdrop-blur-md flex flex-col h-full overflow-hidden">
        {/* Chat HUD */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Hypertrophy AI System v1</span>
            <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ONLINE & COMPLIANT
            </span>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-none">
          {messages.map((m) => {
            const isCoach = m.sender === "coach";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  isCoach ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Avatar icon */}
                {isCoach && (
                  <div className="h-7 w-7 rounded-lg bg-blue-900/40 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                    AI
                  </div>
                )}
                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    isCoach
                      ? "bg-[#0f1626]/80 text-slate-300 border border-slate-850 rounded-tl-none"
                      : "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/5"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[8px] mt-1.5 text-right ${isCoach ? "text-slate-500" : "text-blue-200"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="h-7 w-7 rounded-lg bg-blue-900/40 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0f1626]/80 border border-slate-850 rounded-tl-none flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex gap-2 text-xs font-semibold"
        >
          <input
            type="text"
            placeholder="Type your scientific question..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-[#0e1626] border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
          />
          <button
            type="submit"
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
