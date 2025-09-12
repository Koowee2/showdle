import { useState, useEffect } from "react";
import { GameFrame } from "./GameFrame";
import { GuessInput } from "./GuessInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data structure - replace with Supabase data later
const mockGameData = {
  id: "2024-01-15",
  show_name: "Breaking Bad",
  answer: "Breaking Bad",
  frames: [
    "https://images.unsplash.com/photo-1489599510025-e4fb9bb1c3a5?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=225&fit=crop", 
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=225&fit=crop"
  ]
};

export const GameBoard = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameData] = useState(mockGameData);
  const { toast } = useToast();

  const handleGuess = (guess: string) => {
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);

    // Check if guess is correct (case-insensitive)
    const isCorrect = guess.toLowerCase() === gameData.answer.toLowerCase();
    
    if (isCorrect) {
      setGameWon(true);
      toast({
        title: "Congratulations!",
        description: `You guessed "${gameData.answer}" correctly!`,
        variant: "default",
      });
    } else {
      // Reveal next frame if available
      if (currentFrame < gameData.frames.length - 1) {
        setCurrentFrame(currentFrame + 1);
        toast({
          title: "Keep trying!",
          description: "That's not quite right. Here's another frame.",
          variant: "destructive",
        });
      } else {
        // Game over - all frames revealed
        toast({
          title: "Game Over",
          description: `The answer was "${gameData.answer}". Better luck tomorrow!`,
          variant: "destructive",
        });
      }
    }
  };

  const resetGame = () => {
    setCurrentFrame(0);
    setGuesses([]);
    setGameWon(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Game Statistics */}
      <div className="text-center space-y-2">
        <div className="flex justify-center gap-6 text-sm">
          <span className="text-muted-foreground">
            Frame: <span className="text-foreground font-medium">{currentFrame + 1}/5</span>
          </span>
          <span className="text-muted-foreground">
            Guesses: <span className="text-foreground font-medium">{guesses.length}</span>
          </span>
        </div>
      </div>

      {/* Game Frames */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {gameData.frames.map((frame, index) => (
          <GameFrame
            key={index}
            src={frame}
            isRevealed={index <= currentFrame}
            status={gameWon ? 'correct' : (guesses.length > 0 && index === currentFrame && !gameWon) ? 'incorrect' : null}
            frameNumber={index + 1}
          />
        ))}
      </div>

      {/* Game Input */}
      <div className="flex flex-col items-center space-y-4">
        {!gameWon && currentFrame < gameData.frames.length ? (
          <GuessInput
            onGuess={handleGuess}
            disabled={gameWon}
            placeholder={`Guess the TV show... (${guesses.length + 1}/${gameData.frames.length})`}
          />
        ) : null}
        
        {gameWon && (
          <div className="text-center space-y-4">
            <div className="showdle-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-success mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-muted-foreground">
                You guessed <span className="text-foreground font-medium">"{gameData.answer}"</span> in {guesses.length} attempt{guesses.length !== 1 ? 's' : ''}!
              </p>
            </div>
            <Button onClick={resetGame} variant="game">
              Play Again
            </Button>
          </div>
        )}

        {!gameWon && currentFrame >= gameData.frames.length - 1 && guesses.length > 0 && (
          <div className="text-center space-y-4">
            <div className="showdle-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-error mb-2">
                Game Over
              </h3>
              <p className="text-muted-foreground">
                The answer was <span className="text-foreground font-medium">"{gameData.answer}"</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Come back tomorrow for a new challenge!
              </p>
            </div>
            <Button onClick={resetGame} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Previous Guesses */}
      {guesses.length > 0 && (
        <div className="showdle-card p-4 rounded-lg">
          <h4 className="font-medium mb-3">Your Guesses:</h4>
          <div className="flex flex-wrap gap-2">
            {guesses.map((guess, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  guess.toLowerCase() === gameData.answer.toLowerCase()
                    ? 'bg-success text-success-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};