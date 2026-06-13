"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, X, Bot } from "lucide-react";
import { Button } from "../ui/Button";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    return `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
      isActive 
        ? "bg-white text-blue-600 shadow-sm" 
        : "text-slate-600 hover:bg-white/50 hover:text-blue-600"
    }`;
  };

  return (
    <aside className="w-64 bg-[#F4F0FA] flex flex-col h-full shadow-xl lg:shadow-none">
      <div className="h-32 flex flex-col items-center justify-center px-6 pt-6">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logo.png" alt="BMP SHOP Logo" width={140} height={80} className="object-contain drop-shadow-sm" priority />
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-4 right-4" onClick={onClose} aria-label="Close Navigation Menu">
            <X size={20} />
          </Button>
        )}
      </div>
      <nav className="flex-1 px-4 py-8 space-y-1">
        <Link href="/" onClick={onClose} className={getLinkClass("/")}>
          <LayoutDashboard size={20} />
          <span>Overviews</span>
        </Link>
        <Link href="/orders" onClick={onClose} className={getLinkClass("/orders")}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </Link>
        <Link href="/ai" onClick={onClose} className={getLinkClass("/ai")}>
          <Bot size={20} />
          <span>AI Assistant</span>
        </Link>
      </nav>
    </aside>
  );
}
