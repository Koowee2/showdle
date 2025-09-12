import { cn } from "@/lib/utils";

interface GameFrameProps {
  src?: string;
  isRevealed: boolean;
  status?: 'correct' | 'incorrect' | null;
  frameNumber: number;
}

export const GameFrame = ({ src, isRevealed, status, frameNumber }: GameFrameProps) => {
  return (
    <div className={cn(
      "showdle-card aspect-video w-full rounded-lg overflow-hidden relative",
      !isRevealed && "opacity-50",
      status === 'correct' && "frame-correct",
      status === 'incorrect' && "frame-incorrect"
    )}>
      {isRevealed && src ? (
        <img 
          src={src} 
          alt={`Frame ${frameNumber}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 mx-auto">
              <span className="text-primary font-bold">{frameNumber}</span>
            </div>
            {!isRevealed && (
              <p className="text-sm text-muted-foreground">Hidden</p>
            )}
          </div>
        </div>
      )}
      
      {status === 'correct' && (
        <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
          <div className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
            Correct!
          </div>
        </div>
      )}
    </div>
  );
};