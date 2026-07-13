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

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: msgCounter,
      sender: "user",
      text,
      timestamp: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setMsgCounter((c) => c + 1);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const responseText = getCoachResponse(text);
      const coachTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const coachMsg: Message = {
        id: msgCounter + 1,
        sender: "coach",
        text: responseText,
        timestamp: coachTime
      };

      setMessages((prev) => [...prev, coachMsg]);
      setMsgCounter((c) => c + 2);
      setIsTyping(false);
    }, 1200);
  };

  const clearChatHistory = () => {
    if (confirm("Reset conversation with your AI Coach?")) {
      setMessages([
        {
          id: 1,
          sender: "coach",
          text: "Hello! I am your AI Hypertrophy Coach, specialized in exercise biomechanics and nutrition science. Ask me anything about lagging muscle groups, workout programming, RPE, or meal schedules.",
          timestamp: "12:00"
        }
      ]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Suggestions Column */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-5 h-fit">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-black flex items-center gap-1.5">
            <BrainCircuit className="h-4 w-4" />
            AI COMPANION HUDS
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">Training Prompt Suggestions</h3>
        </div>

        <div className="space-y-2">
          {predefinedQuestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.q)}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group"
            >
              <span>{item.q}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>

        <button
          onClick={clearChatHistory}
          className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Conversation History
        </button>
      </div>

      {/* Main Console Chat Terminal */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Terminal HUD Header */}
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex">
              <BrainCircuit className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900">BIOMECHANICAL AI COMPANION</span>
              <span className="text-[9px] font-mono text-slate-400">ENGINE V1.0 • ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-mono text-slate-500">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span>KNOWLEDGE LIMIT: JULY 2026</span>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-none">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-500/10"
                    : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[8px] font-mono text-slate-400 mt-1 px-1">
                {msg.sender === "user" ? "USER" : "COACH"} • {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="max-w-[85%] p-3 bg-slate-50 border border-slate-100 text-slate-400 text-xs rounded-2xl rounded-tl-none flex items-center gap-1.5 font-bold">
                <span>AI Coach is compiling biomechanics</span>
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-ping" />
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-ping delay-75" />
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-ping delay-150" />
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Console Prompt Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="flex gap-3 border-t border-slate-100 pt-4 flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Type your anatomical query (e.g. barbell chest sweep or hamstrings eccentric contraction)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="px-5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white shadow-sm flex items-center justify-center transition-colors active:scale-95"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
