# Project Name: BMP SHOP (E-Commerce Admin Dashboard)
**Hackathon:** The "Living" App (48 Hours)
**Team:** BMP
**Vertical:** E-Commerce
**Goal:** พัฒนาระบบ MVP จัดการร้านค้าที่มี Dashboard สรุปยอดขาย, ระบบจัดการออเดอร์, และฟีเจอร์ AI แนะนำสินค้า (BYOK) โดยมุ่งเน้น Performance Score (Lighthouse ≥ 90)

---

## 🛠 Tech Stack
* **Framework:** Next.js (App Router - React)
* **Styling:** Tailwind CSS (เพื่อความรวดเร็วและ Responsive)
* **Icons:** Lucide-react
* **Charts:** Recharts (สำหรับทำ Dashboard KPI)
* **State Management:** React Hooks พื้นฐาน (useState, useEffect) + LocalStorage (สำหรับเก็บ API Key)
* **AI Integration:** `@google/genai` (Gemini API)

---

## 📂 Directory Structure (Next.js App Router)

```text
BMP_AiHackThon2026_Round1/
│
├── public/                 <-- เก็บไฟล์ Static เช่น โลโก้
├── src/
│   ├── app/
│   │   ├── layout.tsx      <-- โครงสร้างหลัก (Sidebar, Header, AI Key Input)
│   │   ├── page.tsx        <-- 1. Dashboard (KPIs, Charts สรุปยอดขาย)
│   │   ├── orders/
│   │   │   ├── page.tsx    <-- 2. List & Search (ตารางออเดอร์ + Filter)
│   │   │   └── [id]/
│   │   │       └── page.tsx<-- 3. Detail Page (รายละเอียดของแต่ละออเดอร์)
│   │   └── api/
│   │       └── ai/
│   │           └── route.ts<-- API Route สำหรับเรียกใช้งาน Gemini (ซ่อน Logic)
│   │
│   ├── components/
│   │   ├── ui/             <-- Reusable UI (Button, Card, Table, Input)
│   │   ├── layout/         <-- Sidebar, Header, ByokModal (ช่องใส่ API Key)
│   │   ├── charts/         <-- Component กราฟต่างๆ (Recharts)
│   │   └── ai/             <-- AiAdvisorCard (แสดงผลลัพธ์จาก AI)
│   │
│   ├── data/               <-- 🗂️ นำไฟล์ JSON จาก Hackathon มาวางที่นี่
│   │   ├── users.json
│   │   ├── products.json
│   │   └── orders.json
│   │
│   └── lib/                <-- Helper Functions
│       ├── utils.ts        <-- ฟังก์ชันจัด Format วันที่, ตัวเลขเงิน
│       └── dataFetch.ts    <-- Logic จำลองการดึงและ Join ข้อมูล (Orders + Users + Products)
│
├── Project.md              <-- ไฟล์นี้ (เอกสารอ้างอิงโปรเจกต์)
├── tailwind.config.ts
└── package.json