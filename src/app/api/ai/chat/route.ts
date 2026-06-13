import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCombinedOrders, getProducts, getUsers } from "@/lib/dataFetch";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Gather store summary
    const orders = getCombinedOrders();
    const products = getProducts();
    const users = getUsers();
    
    // Create a simplified version of all orders to feed to the AI so it can answer anything!
    const simplifiedOrders = orders.map(o => ({
      id: o.order_id,
      date: o.timestamp,
      user: o.user?.name,
      status: o.status,
      total: o.total_price,
      items: o.items.map(i => ({ 
        name: i.product?.name, 
        category: i.product?.category,
        price: i.product?.price,
        qty: i.qty 
      }))
    }));

    const systemPrompt = `
      You are an expert E-Commerce AI Assistant for BMP SHOP.
      You help the shop admin analyze data and answer questions about the shop.
      
      Here is the COMPLETE RAW DATA of all orders in the shop in JSON format:
      ${JSON.stringify(simplifiedOrders)}

      Additional Shop Info:
      - Total Products Catalog: ${products.length}
      - Total Registered Users: ${users.length}

      Rules:
      1. Answer the admin's question strictly based on the provided JSON data above. You can calculate totals, find the max/min, or sort by date if needed.
      2. Be polite, concise, and professional.
      3. If they ask something completely outside of the shop's context, answer generally but remind them you are a shop assistant.
      4. ALWAYS reply in Thai language (ภาษาไทย).
      5. Use markdown format for readability (like bolding numbers, creating lists, or small tables).
    `;

    // Convert client messages to Gemini's expected format if needed
    // The gemini-2.5-flash chat API expects parts and role.
    // However, since we are doing a simple prompt based request for the hackathon,
    // we can just format the conversation history into the prompt string or use the chat session.
    
    const conversation = messages.map(m => `${m.role === 'user' ? 'Admin' : 'AI'}: ${m.content}`).join('\n\n');
    
    const fullPrompt = `${systemPrompt}\n\n--- Conversation History ---\n${conversation}\n\nAI:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return NextResponse.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
