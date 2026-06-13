import { Chatbot } from "@/components/ai/Chatbot";

export default function AiAssistantPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
        <p className="text-slate-500">สอบถามข้อมูล ยอดขาย และสถานะออเดอร์ของร้าน BMP SHOP ได้ทันที</p>
      </div>

      <Chatbot />
    </div>
  );
}
