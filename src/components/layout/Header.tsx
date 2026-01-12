import { Waves } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40 safe-area-inset-top">
      <div className="flex items-center justify-center gap-2 px-5 py-4">
        <div className="w-8 h-8 ocean-gradient rounded-lg flex items-center justify-center">
          <Waves className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">PrawnVision AI</h1>
      </div>
    </header>
  );
};
