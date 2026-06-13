"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Square } from "lucide-react";
import { CombinedOrder } from "@/lib/dataFetch";

// We dispatch a custom event when a mock order is created
export const SIMULATION_EVENT = "new_mock_order";

const MOCK_NAMES = ["สมปอง รักดี", "แก้วตา ดวงใจ", "Manee Jai", "Peter Parker", "Tony Stark", "สมศรี มีสุข"];
const MOCK_PRODUCTS = [
  { id: "prod-001", name: "Wireless Earbuds", category: "Electronics", price: 1200 },
  { id: "prod-002", name: "Running Shoes", category: "Sports", price: 2500 },
  { id: "prod-003", name: "Coffee Mug", category: "Home", price: 350 },
  { id: "prod-004", name: "Moisturizing Cream", category: "Beauty", price: 850 },
  { id: "prod-005", name: "Cotton T-Shirt", category: "Fashion", price: 450 },
];

export function LiveSimulation() {
  const [isActive, setIsActive] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        // Generate random order
        const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
        const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const total = randomProduct.price * qty;

        const STATUSES = ["PAID", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
        const randomStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];

        const newOrder: CombinedOrder = {
          order_id: `live-${Math.floor(Math.random() * 10000)}`,
          user_id: "user-live",
          status: randomStatus,
          timestamp: new Date().toISOString(),
          total_price: total,
          items: [{ product_id: randomProduct.id, qty, product: randomProduct as any }],
          user: { user_id: "user-live", name: randomName, email: "", phone: "", loyalty_points: 0, role: "customer" }
        };

        // Dispatch event so Dashboard can listen
        const event = new CustomEvent(SIMULATION_EVENT, { detail: newOrder });
        window.dispatchEvent(event);

        // Show toast
        setToast({ message: `🎉 ออเดอร์ใหม่! ${randomName} สั่งซื้อ ${randomProduct.name} (฿${total})` });

        setTimeout(() => setToast(null), 4000);

      }, 6000); // Every 6 seconds
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      localStorage.removeItem('live_orders');
      window.dispatchEvent(new Event("clear_mock_orders"));
    } else {
      setIsActive(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        variant="default"
        className={`shadow-sm transition-all ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isActive ? (
          <><Square size={16} className="mr-2" /> Stop</>
        ) : (
          <><Play size={16} className="mr-2" /> Live Simulation</>
        )}
      </Button>

      {/* Simple Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-green-500 p-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in-up z-50">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <DollarSignIcon />
          </div>
          <p className="text-slate-800 font-medium">{toast.message}</p>
        </div>
      )}
    </>
  );
}

function DollarSignIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  )
}
