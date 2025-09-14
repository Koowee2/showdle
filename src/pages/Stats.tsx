import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGameStats } from "@/hooks/useGameStats";

const Stats = () => {
  const navigate = useNavigate();
  const { stats } = useGameStats();

  const statItems = [
    { label: "Played", value: stats.played },
    { label: "Won", value: stats.won },
    { label: "Win %", value: `${stats.winPercentage}%` },
    { label: "Current Streak", value: stats.currentStreak },
    { label: "Longest Streak", value: stats.longestStreak },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <header className="w-full py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">Statistics</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        <main className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="showdle-card p-6 rounded-lg space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {statItems.map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-2xl font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stats;