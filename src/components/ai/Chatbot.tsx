"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Loader2, Bot, User } from "lucide-react";
import { Button } from "../ui/Button";

type Message = {
  role: "user" | "ai";
  content: string;
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "สวัสดีครับ! ผมคือ AI Assistant ประจำร้าน BMP SHOP มีอะไรให้ผมช่วยสรุปข้อมูลหรือวิเคราะห์ยอดขายให้ไหมครับ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setError("กรุณาใส่ Gemini API Key ที่ปุ่มด้านขวาบนก่อนใช้งานครับ");
      return;
    }

    const newMessages = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      setMessages([...newMessages, { role: "ai", content: data.response }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end space-x-2 space-x-reverse`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 ${msg.role === "user" ? "bg-slate-100 text-slate-600 ml-2" : "bg-blue-50 text-blue-600 mr-2"}`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-3.5 rounded-3xl ${msg.role === "user" ? "bg-slate-100 text-slate-800 rounded-br-sm" : "bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm"}`}>
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-blue-700">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-2 flex items-center justify-center shrink-0 mb-1">
                <Bot size={16} />
              </div>
              <div className="px-5 py-3.5 rounded-3xl bg-white border border-slate-100 text-slate-500 rounded-bl-sm shadow-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">กำลังคิด...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="p-4 bg-transparent sticky bottom-0 w-full">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center justify-between shadow-sm">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-6 px-2 text-red-600 hover:bg-red-100 rounded-lg">ปิด</Button>
          </div>
        )}
        <form onSubmit={handleSend} className="relative w-full max-w-3xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full bg-white border border-slate-200 flex items-center px-2 py-2">
          <input 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-slate-700 py-3 text-base"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading} 
            className="shrink-0 w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-black transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <ArrowUp size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
