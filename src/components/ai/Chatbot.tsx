"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

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
      setError("กรุณาใส่ Gemini API Key ที่แถบเมนูด้านบนก่อนใช้งานครับ");
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
    <Card className="flex flex-col h-[600px] max-h-[80vh] border-blue-100 shadow-sm">
      <CardHeader className="border-b bg-slate-50 rounded-t-xl pb-4">
        <CardTitle className="text-lg flex items-center text-blue-800">
          <Bot className="w-5 h-5 mr-2 text-blue-600" />
          AI Shop Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-2 space-x-reverse`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white ml-2" : "bg-blue-100 text-blue-600 mr-2"}`}>
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border text-slate-800 rounded-tl-sm shadow-sm"}`}>
                  <div className="prose prose-sm max-w-none prose-p:my-1" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl bg-white border text-slate-500 rounded-tl-sm shadow-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">กำลังคิด...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-6 px-2 text-red-600 hover:bg-red-100">ปิด</Button>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <Input 
              placeholder="พิมพ์คำถามของคุณที่นี่..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="shrink-0 bg-blue-600 hover:bg-blue-700">
              <Send size={18} className="mr-2" />
              ส่ง
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
