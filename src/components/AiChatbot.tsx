'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, Bot, User, ArrowRight, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isFallback?: boolean;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Namaste! I am NutriFit AI, your health, swap, and fitness coach. Ask me how to make your favorite Indian cravings healthier, or query diet and exercise tips!' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Healthy swap for Butter Paneer?",
    "Healthy swap for Maggi noodles?",
    "Best evening snacks under 100 kcal?",
    "Suggest a simple 4-day workout plan",
    "Diet tips for weight loss"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build full conversation history for model context
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (res.ok) {
        const data = await res.json();
        
        setIsFallbackMode(!!data.isFallback);
        
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.message || 'Apologies, I encountered an issue parsing the response.',
          isFallback: !!data.isFallback
        }]);
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: 'I could not connect to the server. Running in local fallback mode. Please ask a standard swap query!',
        isFallback: true
      }]);
      setIsFallbackMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Collapsed Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-primary via-emerald-600 to-teal-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative border border-white/20"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-6 w-6 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">AI</span>
          </span>
        </button>
      )}

      {/* Expanded Chat Widget */}
      {isOpen && (
        <div className="flex flex-col w-[340px] sm:w-[380px] h-[500px] rounded-2xl bg-card-app border border-border-app shadow-2xl overflow-hidden glass animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-primary/10 via-emerald-500/10 to-teal-500/10 border-b border-border-app/40">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-wide text-text-app">NutriFit AI Coach</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold leading-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Llama-3-8B Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-app p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Chat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-brand-primary text-brand-primary-fg rounded-tr-none'
                        : 'bg-card-app/60 border border-border-app/50 text-text-app rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && msg.id === 'welcome' && (
                    <div className="mt-2 text-[9px] text-text-muted opacity-80 leading-snug">
                      💡 Tip: Ask for swaps, workouts, or custom meal ideas!
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-brand-primary-fg mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mt-1">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl px-4 py-3 bg-card-app/40 border border-border-app/50 rounded-tl-none">
                  <span className="h-2 w-2 rounded-full bg-brand-primary animate-bounce delay-100"></span>
                  <span className="h-2 w-2 rounded-full bg-brand-primary animate-bounce delay-200"></span>
                  <span className="h-2 w-2 rounded-full bg-brand-primary animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills (Visible when input is empty & no active loading) */}
          {!isLoading && messages.length <= 3 && (
            <div className="px-4 py-2 border-t border-border-app/20 bg-card-app/30">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Quick Prompts</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/10">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 text-[10px] font-medium bg-card-app/80 hover:bg-brand-primary/10 border border-border-app hover:border-brand-primary text-text-app rounded-full px-2.5 py-1 transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Local Fallback Alert Banner */}
          {isFallbackMode && (
            <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-1.5 text-[9px] text-amber-500/90 font-medium flex items-center justify-between">
              <span>Running in Offline Mode (Using rule-based router).</span>
              <span className="opacity-75 text-[8px] uppercase tracking-wider">Configure env</span>
            </div>
          )}

          {/* Footer Input Area */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-border-app/40 bg-card-app/40 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-grow bg-card-app/50 border border-border-app focus:border-brand-primary rounded-xl px-3.5 py-2 text-xs text-text-app focus:outline-none placeholder-text-muted/60 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary text-brand-primary-fg hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:active:scale-100 transition-all shrink-0 shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
