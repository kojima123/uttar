import { Link, useLocation } from "wouter";
import { Home, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "記録" },
    { href: "/history", icon: Calendar, label: "履歴" },
    { href: "/settings", icon: Settings, label: "設定" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-panel border-t border-white/10 px-6 py-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer",
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}>
                  <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]")} />
                  <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
