import { Info, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SetupNotice = () => {
  return (
    <div className="showdle-card p-6 rounded-lg max-w-2xl mx-auto mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Database className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold">Ready for Daily Games?</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is currently showing demo data. To set up daily TV show games with real data, 
            you'll need to connect your project to Supabase using our native integration. 
            This will enable you to store daily games, track user progress, and manage the game database.
          </p>
        </div>
      </div>
    </div>
  );
};