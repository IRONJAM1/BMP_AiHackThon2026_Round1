import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const { order } = await req.json();
    if (!order) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are an expert E-Commerce AI Advisor.
    Review the following customer and order details and provide a short, personalized product recommendation and up-selling strategy for them.
    Format your response in simple HTML suitable for displaying in a React dashboard (e.g., using <b>, <ul>, <li>). Do not use markdown backticks.
    Review the following customer and order details and provide a highly concise and actionable recommendation. Do not write long paragraphs. 
    Format the output exactly like this:
    
    <ul>
      <li><b>พฤติกรรมลูกค้า:</b> (1 sentence summary of their buying habit)</li>
      <li><b>สินค้าที่ควรแนะนำต่อ:</b> (2-3 specific items or categories)</li>
      <li><b>โปรโมชั่นที่ควรเสนอ:</b> (1 actionable marketing tactic e.g. 10% discount, Buy 1 Get 1)</li>
    </ul>

    Customer Details:
    - Name: ${order.user?.name}
    - Role: ${order.user?.role}
    - Loyalty Points: ${order.user?.loyalty_points}

    Order Items:
    ${order.items.map((item: any) => `- ${item.qty}x ${item.product?.name} (${item.product?.category})`).join('\n')}
    
    IMPORTANT: You must write the entire response in Thai (ภาษาไทย). Keep it very short and straight to the point.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ recommendation: response.text });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
