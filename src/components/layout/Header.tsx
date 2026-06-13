"use client";

import { Menu } from "lucide-react";
import { ByokModal } from "@/components/layout/ByokModal";
import { Button } from "../ui/Button";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu size={20} />
        </Button>
      </div>
      <div className="flex items-center">
        <ByokModal />
      </div>
    </header>
  );
}
