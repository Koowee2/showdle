import { Tv, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const GameHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full py-8 text-center relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate('/stats')}
        className="absolute top-8 right-4"
      >
        <BarChart3 className="w-6 h-6" />
      </Button>
      
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Tv className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Showey
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Guess the Show.
      </p>
    </header>
  );
};