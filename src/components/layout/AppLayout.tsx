import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const AppLayout = ({
  children,
  showNav = true,
  showHeader = true,
  className = "",
}: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showHeader && <Header />}
      <main className={showNav ? "pb-24" : ""}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
};
