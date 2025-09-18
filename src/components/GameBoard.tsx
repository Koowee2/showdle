import { useState, useEffect } from "react";
import { format } from "date-fns";
import { GameFrame } from "./GameFrame";
import { GuessInput } from "./GuessInput";
import { ShareResults } from "./ShareResults";
import { useToast } from "@/hooks/use-toast";
import { useGameStats } from "@/hooks/useGameStats";
import { supabase } from "@/integrations/supabase/client";

interface ShowData {
  id: number;
  Show_Name: string;
  Answer: string;
  Frame_url_1: string;
  Frame_url_2: string;
  Frame_url_3: string;
  Frame_url_4: string;
  Frame_url_5: string;
  date: string;
}

export const GameBoard = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameData, setGameData] = useState<ShowData | null>(null);
  const [showNames, setShowNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const { toast } = useToast();
  const { updateStats } = useGameStats();
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedGuessCount, setCompletedGuessCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodaysGame = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        console.log('Looking for game on date:', today);
        
        // Fetch today's game
        const { data: showData, error } = await supabase
          .from('Show')
          .select('*')
          .eq('date', today)
          .maybeSingle();

        if (error) {
          console.error('Error fetching game:', error);
          return;
        }

        console.log('Show data found:', showData);

        if (showData) {
          setGameData(showData);
          const completionKey = `showdle-completion-${showData.date || today}`;
          const saved = localStorage.getItem(completionKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setGameWon(!!parsed.won);
              setGameCompleted(true);
              setCompletedGuessCount(typeof parsed.guesses === 'number' ? parsed.guesses : null);
              setStatsUpdated(true);
              setCurrentFrame(4);
            } catch (e) {
              console.error('Error parsing saved completion:', e);
            }
          }
        }

        // Fetch all show names for autocomplete
        const { data: allShows, error: showsError } = await supabase
          .from('Show')
          .select('Show_Name');

        if (showsError) {
          console.error('Error fetching show names:', showsError);
          return;
        }

        if (allShows) {
          const names = allShows.map(show => show.Show_Name).filter(Boolean);
          setShowNames(names);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysGame();
  }, []);

  const handleGuess = (guess: string) => {
    if (!gameData) return;
    
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);

    // Check if guess is correct (case-insensitive)
    const correctAnswer = (gameData.Answer || gameData.Show_Name || '').toLowerCase();
    const isCorrect = guess.toLowerCase() === correctAnswer;
    
    if (isCorrect) {
      setGameWon(true);
      if (!statsUpdated) {
        updateStats(true);
        setStatsUpdated(true);
      }
      // Persist completion for today
      if (!gameCompleted) {
        const completionKey = `showdle-completion-${gameData.date || format(new Date(), 'yyyy-MM-dd')}`;
        localStorage.setItem(completionKey, JSON.stringify({ won: true, guesses: newGuesses.length }));
        setGameCompleted(true);
        setCompletedGuessCount(newGuesses.length);
      }
      toast({
        title: "Congratulations!",
        description: `You guessed "${gameData.Answer || gameData.Show_Name || 'the show'}" correctly!`,
        variant: "default",
      });
    } else {
      // Reveal next frame if available
      if (currentFrame < 4) { // 5 frames total (0-4)
        setCurrentFrame(currentFrame + 1);
        toast({
          title: "Keep trying!",
          description: "That's not quite right. Here's another frame.",
          variant: "destructive",
        });
      } else {
        // Game over - all frames revealed
        if (!statsUpdated) {
          updateStats(false);
          setStatsUpdated(true);
        }
        // Persist loss for today
        if (!gameCompleted) {
          const completionKey = `showdle-completion-${gameData.date || format(new Date(), 'yyyy-MM-dd')}`;
          localStorage.setItem(completionKey, JSON.stringify({ won: false, guesses: newGuesses.length }));
          setGameCompleted(true);
          setCompletedGuessCount(newGuesses.length);
        }
        toast({
          title: "Game Over",
          description: `The answer was "${gameData.Answer || gameData.Show_Name || 'the show'}". Better luck tomorrow!`,
          variant: "destructive",
        });
      }
    }
  };


  const getCurrentFrameUrl = () => {
    if (!gameData) return null;
    const frameKeys = ['Frame_url_1', 'Frame_url_2', 'Frame_url_3', 'Frame_url_4', 'Frame_url_5'] as const;
    return gameData[frameKeys[currentFrame]];
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-16">
        <div className="text-muted-foreground">Loading today's game...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-16">
        <div className="showdle-card p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-2">No Game Available</h3>
          <p className="text-muted-foreground">
            No game found for today. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Game Statistics */}
      <div className="text-center space-y-2">
        <div className="flex justify-center gap-6 text-sm">
          <span className="text-muted-foreground">
            Frame: <span className="text-foreground font-medium">{currentFrame + 1}/5</span>
          </span>
          <span className="text-muted-foreground">
            Guesses: <span className="text-foreground font-medium">{completedGuessCount ?? guesses.length}</span>
          </span>
        </div>
      </div>

      {/* Single Frame Display */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <GameFrame
            src={getCurrentFrameUrl()}
            isRevealed={true}
            status={gameWon ? 'correct' : (guesses.length > 0 && !gameWon) ? 'incorrect' : null}
            frameNumber={currentFrame + 1}
          />
        </div>
      </div>

      {/* Game Input */}
      <div className="flex flex-col items-center space-y-4">
        {!gameCompleted && currentFrame < 5 ? (
          <GuessInput
            onGuess={handleGuess}
            disabled={gameCompleted}
            placeholder={`Guess the TV show... (${guesses.length + 1}/5)`}
            suggestions={showNames}
          />
        ) : null}
        
        {/* Win/Loss State Display */}
        {gameCompleted && gameWon && (
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-success mb-2">Correct!</div>
            <div className="text-xl text-muted-foreground">
              You guessed "{gameData.Answer || gameData.Show_Name}" in {completedGuessCount} guess{completedGuessCount !== 1 ? 'es' : ''}!
            </div>
          </div>
        )}
        
        {gameCompleted && !gameWon && (
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-destructive mb-2">Game Over!</div>
            <div className="text-xl text-muted-foreground mb-2">
              The answer was:
            </div>
            <div className="text-3xl font-bold text-foreground">
              {gameData.Answer || gameData.Show_Name}
            </div>
          </div>
        )}
        
        {gameCompleted && (
          <ShareResults 
            guessCount={completedGuessCount ?? guesses.length}
            maxGuesses={5}
            gameWon={gameWon}
            gameNumber={gameData.id}
          />
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
                  guess.toLowerCase() === (gameData.Answer || gameData.Show_Name || '').toLowerCase()
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