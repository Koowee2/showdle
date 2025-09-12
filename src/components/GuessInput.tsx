import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const GuessInput = ({ onGuess, disabled = false, placeholder = "Enter your guess..." }: GuessInputProps) => {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
      setGuess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <Input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="guess-input flex-1"
      />
      <Button 
        type="submit" 
        disabled={!guess.trim() || disabled}
        variant="game"
        size="icon"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};