import { GameHeader } from "@/components/GameHeader";
import { GameBoard } from "@/components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <GameHeader />
        <main className="flex justify-center">
          <GameBoard />
        </main>
      </div>
    </div>
  );
};

export default Index;
