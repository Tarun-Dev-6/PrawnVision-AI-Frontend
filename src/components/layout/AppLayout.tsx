import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export const AppLayout = ({
  children,
  showNav = true,
  className = "",
}: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <main className={showNav ? "pb-24" : ""}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
};
