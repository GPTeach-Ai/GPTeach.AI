// src/components/AIChatInterface.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading, blockquote, etc. for a chat interface
        heading: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: 'Message GPTeach AI...' }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3 min-h-[48px] text-[15px] leading-relaxed',
      },
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!editor || !editor.getText().trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: editor.getHTML(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    editor.commands.clearContent(true); // Clear the editor and focus

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
                  I can help you create organized, effective lesson plans in less time. Tell me your subject, grade level, and objectives to get started.
                </p>
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
                  <EditorContent editor={editor} />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!editor || !editor.getText().trim()}
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