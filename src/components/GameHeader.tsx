import { Tv } from "lucide-react";

export const GameHeader = () => {
  return (
    <header className="w-full py-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Tv className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Showdle
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Guess the Show.
      </p>
    </header>
  );
};