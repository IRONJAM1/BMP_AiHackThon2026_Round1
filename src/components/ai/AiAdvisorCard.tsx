"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CombinedOrder } from "@/lib/dataFetch";

export function AiAdvisorCard({ order }: { order: CombinedOrder }) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setError("Please set your Gemini API Key in the header first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ order }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate recommendation");
      }

      setRecommendation(data.recommendation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg flex items-center text-blue-800">
          <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
          AI Product Recommendation
        </CardTitle>
        <Button size="sm" onClick={handleGenerate} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {recommendation ? "Regenerate" : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
        {recommendation ? (
          <div className="prose prose-sm max-w-none text-slate-700 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, '<br />') }} />
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">
            Click generate to get AI-powered product recommendations for this customer based on their purchase history.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
