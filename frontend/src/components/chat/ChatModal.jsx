import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  MessageCircle, 
  ChevronDown,
  Film,
  Zap,
  Coffee,
  Flame,
  Brain
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';

const QUICK_PROMPTS = [
  { label: 'Hype Action', icon: Zap, text: 'Recommend me a hype action anime like Solo Leveling or Jujutsu Kaisen ⚡' },
  { label: 'Study Break', icon: Coffee, text: 'What is a chill, relaxing anime for a student study break? 🍿' },
  { label: 'Trending Hits', icon: Flame, text: 'What are the top trending anime on AniPulse right now? 🔥' },
  { label: 'Mind-Bender', icon: Brain, text: 'Recommend a mind-bending psychological thriller like Death Note 🧠' },
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Konnichiwa! 👋 I'm **AniBot**, your personal anime guide on **AniPulse** ✨\n\nLooking for your next binge-worthy series, character power scaling, or a quick study-break anime? Ask me anything or tap one of the ideas below! 🍿",
};

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send conversation history (excluding initial greeting to save tokens)
      const messagesForApi = updatedMessages
        .filter((_, idx) => idx > 0 || updatedMessages.length === 1)
        .map(({ role, content }) => ({ role, content }));

      const res = await sendChatMessage(messagesForApi);

      if (res?.success && res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
        if (!isOpen) setHasUnread(true);
      } else {
        throw new Error(res?.error || 'Failed to get reply from AniBot.');
      }
    } catch (err) {
      console.error('[AniBot UI Error]:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Gomen ne! 🍜 AniBot ran into a temporary hiccup. Please make sure the backend is connected and try asking again! ✨",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Helper to render markdown bold and line breaks cleanly
  const renderFormattedText = (content) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      // Parse markdown bold: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lIdx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-purple-200">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} className="italic text-purple-300">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Toggle AniBot AI Chat"
          className="relative group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-medium shadow-xl shadow-purple-900/40 hover:shadow-purple-700/60 border border-purple-400/40 transition-all duration-300"
        >
          {/* Animated Glow Halo */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-40 blur-md group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-pulse" />

          {/* Icon */}
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <ChevronDown className="w-6 h-6 transition-transform duration-200" />
            ) : (
              <Bot className="w-6 h-6 animate-bounce transition-transform duration-200" />
            )}
          </div>

          {/* Text Badge */}
          <span className="relative text-sm font-semibold tracking-wide hidden sm:inline-block">
            {isOpen ? 'Close AniBot' : 'Ask AniBot ✨'}
          </span>

          {/* Unread Alert Dot */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500 border-2 border-[#0b0f19]" />
            </span>
          )}
        </motion.button>
      </div>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh] bg-[#0c101d]/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#141b2f] via-[#161f36] to-[#121626] border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-inner">
                    <div className="w-full h-full bg-[#0b0f19] rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0b0f19] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-100 text-sm tracking-wide">AniBot</h3>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Groq AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online • Ready to chat
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Clear conversation"
                  className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Thread Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-purple-900/40 scrollbar-track-transparent">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-purple-950/30'
                          : msg.isError
                          ? 'bg-red-950/40 border border-red-500/40 text-red-200 rounded-tl-xs'
                          : 'bg-[#151c2e]/90 border border-slate-700/60 text-slate-200 rounded-tl-xs shadow-sm'
                      }`}
                    >
                      {renderFormattedText(msg.content)}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing / Thinking Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-[#151c2e]/90 border border-slate-700/60 text-slate-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                    <span className="ml-1 text-slate-400 text-[11px]">AniBot is thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 bg-[#0e1424]/60 border-t border-purple-500/10">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> Quick Ideas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => {
                    const IconComponent = prompt.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/30 hover:bg-purple-800/50 text-purple-200 border border-purple-500/20 hover:border-purple-400/40 transition-colors duration-150"
                      >
                        <IconComponent className="w-3 h-3 text-purple-400" />
                        {prompt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-[#0d1222] border-t border-purple-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-[#141b2f] border border-purple-500/30 rounded-xl px-3 py-1.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AniBot about any anime, mood, character..."
                  disabled={isLoading}
                  maxLength={500}
                  className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-[13px] outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 text-center">
                <span className="text-[10px] text-slate-400 tracking-tight">
                  ⚡ Powered by Groq LPU™ & AniPulse
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
