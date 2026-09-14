import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendAgentChat } from '../services/api';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    sender: 'agent',
    text: 'Hello! I am your ShelterOps AI Assistant. Ask me about kennel capacity, animal profiles, applicant matches, or current shelter escalations.',
    timestamp: 'Just now',
  },
];

const SUGGESTED_PROMPTS = [
  'Current kennel occupancy stats?',
  'What are the open escalations?',
  'Which animals have special needs?',
  'Summarize recent applicant matches',
];

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendAgentChat(text);
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: 'Unable to reach the ShelterOps chat service at this moment. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="chat-panel-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#292524]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#FDFCF8] shadow-wellness flex flex-col z-10 border-l border-[#E8EFE8] sm:rounded-l-[2.5rem] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#EFEDF4]/40 border-b border-[#E8EFE8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E59F4C] flex items-center justify-center text-[#292524] shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="chat-panel-title" className="text-base font-bold text-[#292524] tracking-tight leading-tight">
                  ShelterOps assistant.
                </h2>
                <span className="font-reenie text-xl text-[#78716C] leading-none">always here</span>
              </div>
              <p className="text-xs text-[#78716C] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Connected to Sunnydale sanctuary records
              </p>
            </div>
          </div>
          <button
            id="close-chat-drawer-btn"
            onClick={onClose}
            className="text-[#78716C] hover:text-[#292524] p-2 rounded-full hover:bg-[#EFEDF4] transition-colors cursor-pointer"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDFCF8]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#EFEDF4] text-[#292524] flex items-center justify-center shrink-0 text-xs mt-0.5 border border-[#ded7e8]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-[1.6rem] px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#292524] text-[#FDFCF8] rounded-tr-xs shadow-wellness'
                      : 'bg-[#EFEDF4]/45 border border-[#EFEDF4] text-[#292524] rounded-tl-xs shadow-wellness'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-[#78716C]' : 'text-[#78716C]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#E59F4C] text-[#292524] flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#EFEDF4] text-[#292524] flex items-center justify-center shrink-0 text-xs mt-0.5 border border-[#ded7e8]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#EFEDF4]/45 border border-[#EFEDF4] rounded-[1.6rem] rounded-tl-xs px-4 py-2.5 text-xs text-[#78716C] flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E59F4C]" />
                <span>Consulting sanctuary registry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-5 py-3 bg-[#EFEDF4]/30 border-t border-[#E8EFE8] flex flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] w-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#E59F4C]" />
            <span>Suggested questions:</span>
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs bg-white hover:bg-[#E8EFE8] border border-[#E8EFE8] text-[#292524] px-3 py-1.5 rounded-full transition-colors text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-[#FDFCF8] border-t border-[#E8EFE8] flex items-center gap-2.5"
        >
          <input
            ref={inputRef}
            id="agent-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ShelterOps a question..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm bg-white border border-[#E8EFE8] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E59F4C] text-[#292524]"
          />
          <button
            id="agent-chat-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-[#292524] hover:bg-black disabled:opacity-40 text-[#FDFCF8] p-2.5 sm:px-4 sm:py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
