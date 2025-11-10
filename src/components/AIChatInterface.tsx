// src/components/AIChatInterface.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';
import InlineToolbarEditor from './InlineToolbarEditor';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  'Draft objectives for grade 5 science on ecosystems',
  'Suggest differentiation ideas for mixed abilities',
  'Provide formative assessment checks for this lesson',
];

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response. Your AI integration would go here.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto flex h-full max-w-4xl flex-col">
        {/* Single Card Container */}
        <GlassCard className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-center border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles size={20} className="text-emerald-600 dark:text-emerald-500" />
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">GPTeach AI</h2>
            </div>
          </div>

          {/* Scrollable Messages Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            {messages.length === 0 ? (
              /* Empty State */
              <div className="flex h-full flex-col items-center justify-center px-6 py-12">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Sparkles size={32} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Welcome to GPTeach AI
                </h3>
                <p className="mb-8 max-w-md text-center text-sm text-slate-600 dark:text-slate-400">
                  Your planning companion. Share your lesson focus, grade, or learning outcomes, and I'll help you craft prompts, activities, and assessments.
                </p>
                
                <div className="w-full max-w-md">
                  <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">Quick prompts</p>
                  <div className="flex flex-col gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="flex flex-col">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border-b border-slate-100 px-6 py-6 dark:border-slate-800 ${
                      message.role === 'assistant' ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="mx-auto max-w-3xl">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded ${
                            message.role === 'assistant'
                              ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                              : 'bg-slate-600 text-white dark:bg-slate-400'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <Sparkles size={14} />
                          ) : (
                            <span className="text-xs font-semibold">You</span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {message.role === 'assistant' ? 'GPTeach AI' : 'You'}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto max-w-3xl">
              <div className="relative flex items-center gap-2">
                <div 
                  className="flex-1 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                  onKeyDown={handleKeyPress}
                >
                  <InlineToolbarEditor
                    value={inputValue}
                    onChange={setInputValue}
                    placeholder="Message GPTeach AI..."
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="shrink-0 rounded-xl bg-emerald-600 p-3 text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}