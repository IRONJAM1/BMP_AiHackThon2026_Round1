import { Chatbot } from "@/components/ai/Chatbot";

export default function AiAssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto w-full">
      <Chatbot />
    </div>
  );
}
