import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareResultsProps {
  guessCount: number;
  maxGuesses: number;
  gameWon: boolean;
  gameNumber: number;
}

export const ShareResults = ({ guessCount, maxGuesses, gameWon, gameNumber }: ShareResultsProps) => {
  const { toast } = useToast();

  const generateEmojis = () => {
    const emojis = [];
    for (let i = 0; i < guessCount - 1; i++) {
      emojis.push('❌');
    }
    if (gameWon) {
      emojis.push('🎬');
    } else {
      emojis.push('❌');
    }
    return emojis.join('');
  };

  const generateShareText = () => {
    const emojis = generateEmojis();
    const result = gameWon ? `${guessCount}/${maxGuesses}` : `X/${maxGuesses}`;
    
    return `Showey #${gameNumber}
Guessed in ${result}
${emojis}

Show me what you got!
https://showdle.lovable.app
📺`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        });
      } catch (error) {
        // If sharing fails, fall back to clipboard
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const shareText = generateShareText();
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Your results have been copied. Share them with your friends!",
        variant: "default",
      });
    }).catch(() => {
      toast({
        title: "Share your results",
        description: shareText,
        variant: "default",
      });
    });
  };

  const copyQuiet = async (title: string, description: string) => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast({ title, description });
    } catch {
      // ignore
    }
  };

  const handleFacebook = async () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://showdle.lovable.app")}`;
    const win = window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
    await copyQuiet("Results copied ✅", "Paste them into your Facebook post.");
    if (!win) window.location.href = fbUrl;
  };

  const handleInstagram = async () => {
    await copyQuiet("Results copied ✅", "Paste them into your Instagram story or message.");
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.open(isMobile ? "instagram://app" : "https://www.instagram.com/", "_blank");
  };

  return (
    <div className="text-center space-y-4">
      <div className="showdle-card p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">
          {gameWon ? '🎉 Congratulations!' : '😔 Better luck tomorrow!'}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="font-mono text-lg">
            <div>Showey #{gameNumber}</div>
            <div>Guessed in {gameWon ? `${guessCount}/${maxGuesses}` : `X/${maxGuesses}`}</div>
            <div className="text-2xl mt-2">{generateEmojis()}</div>
          </div>
          <div className="text-muted-foreground mt-4">
            Show me what you got!<br />
            <a 
              href="https://showdle.lovable.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              showdle.lovable.app
            </a>
            <div className="text-2xl mt-1">📺</div>
          </div>
        </div>
      </div>
      <Button onClick={handleShare} variant="game" className="w-full max-w-xs">
        Share Results
      </Button>
      <div className="flex gap-2 justify-center">
        <Button onClick={handleFacebook} variant="outline" className="flex-1 max-w-[9rem]">
          Facebook
        </Button>
        <Button onClick={handleInstagram} variant="outline" className="flex-1 max-w-[9rem]">
          Instagram
        </Button>
      </div>
    </div>
  );
};