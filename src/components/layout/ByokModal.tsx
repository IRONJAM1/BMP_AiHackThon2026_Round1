"use client";

import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function ByokModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setIsSaved(true);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsSaved(false);
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <Key size={16} className={isSaved ? "text-green-500" : "text-slate-400"} />
        <span>{isSaved ? "API Key Saved" : "Set API Key"}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg p-4 z-50">
          <h3 className="font-semibold text-sm mb-2">Gemini API Key</h3>
          <p className="text-xs text-slate-500 mb-4">
            Enter your Google Gemini API Key to enable AI features. It is stored locally in your browser.
          </p>
          <div className="space-y-3">
            <Input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
            />
            <div className="flex justify-end space-x-2">
              {isSaved && (
                <Button variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              )}
              <Button onClick={handleSave}>
                Save Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
