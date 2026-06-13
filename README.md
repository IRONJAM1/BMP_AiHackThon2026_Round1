# 🚀 BMP SHOP: The "Living" App

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)](https://ai.google.dev/)

Welcome to **BMP SHOP Dashboard**, an AI-powered E-Commerce management platform built for the "The Living App" Hackathon. We transformed static JSON data into a beautiful, insightful, and "living" dashboard that helps merchants easily track sales, manage orders, and analyze customer behaviors using AI.

---

## ✨ Key Features (Hackathon Requirements Met)

1. **📊 Overview Dashboard (Living Data)**
   - Displays real-time KPIs (Total Revenue, Orders, Delivered status).
   - Interactive Pie Chart showing "Sales by Category" using `recharts`.
   - **[BONUS] Live Simulation Mode**: Watch the dashboard come alive with simulated real-time orders continuously streaming in, automatically updating KPIs and charts without refreshing!

2. **📋 Orders & Search**
   - Full list of historical orders.
   - Real-time instant search by Order ID or Customer Name.

3. **🔍 Deep Insights (Order Details)**
   - Click on any order to view detailed customer info and the specific products purchased.

4. **🤖 AI-Powered Assistant (BONUS)**
   - **Bring Your Own Key (BYOK)**: Securely input your Google Gemini API Key.
   - **AI Chatbot**: A dedicated assistant to query your shop's data in Thai (e.g., "Which category sells the best?", "How many orders from John Doe?").
   - **Smart Recommendations**: Auto-generate marketing advice and product upsells based on a specific customer's purchase history directly inside the Order detail page.

5. **📱 PWA / Offline-First (BONUS)**
   - Fully configured as a Progressive Web App (PWA).
   - Installable on Mobile/Desktop directly from the browser.
   - Caches critical assets for lightning-fast loading and offline resilience.

6. **💅 Beautiful & Responsive UI**
   - Clean, modern, "Soft UI" aesthetic.
   - Fully responsive on Mobile and Desktop.
   - Smooth entrance animations.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Lucide Icons
- **Charts**: Recharts
- **AI Integration**: `@google/genai` (Gemini API)
- **Data Source**: Local mock JSON (`ecommerce_orders.json`, `products.json`, `users.json`)

---

## 🚀 How to Run Locally

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Test the AI Features:**
   - Click the **"API Key"** button at the top right of the dashboard.
   - Enter your **Google Gemini API Key**.
   - Navigate to the **AI Assistant** menu or go to an **Order Detail** to start generating insights!

---

## 🏆 Why "Living"?
We designed this app to feel alive. Rather than just showing a static table, the numbers breathe, the AI interacts contextually with your data, and the real-time simulation proves how the architecture gracefully handles continuous data streams. Happy Hacking!
