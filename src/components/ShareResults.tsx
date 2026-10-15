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

  const buildCardBlob = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const W = 1080, H = 1920;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#09090b"); bg.addColorStop(1, "#16161d");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#18181f";
      ctx.beginPath(); ctx.roundRect(90, 460, W - 180, 1000, 48); ctx.fill();
      ctx.textAlign = "center";
      const accent = ctx.createLinearGradient(300, 0, 780, 0);
      accent.addColorStop(0, "#6366f1"); accent.addColorStop(1, "#a5b4fc");
      ctx.fillStyle = accent;
      ctx.font = "bold 140px system-ui, sans-serif";
      ctx.fillText("Showey", W / 2, 330);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "48px system-ui, sans-serif";
      ctx.fillText("Guess the Show.", W / 2, 400);
      ctx.fillStyle = "#fafafa";
      ctx.font = "bold 80px system-ui, sans-serif";
      ctx.fillText(`Showey #${gameNumber}`, W / 2, 640);
      ctx.font = "60px system-ui, sans-serif";
      ctx.fillText(`Guessed in ${gameWon ? `${guessCount}/${maxGuesses}` : `X/${maxGuesses}`}`, W / 2, 780);
      ctx.font = "110px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
      ctx.fillText(generateEmojis(), W / 2, 980);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "54px system-ui, sans-serif";
      ctx.fillText("Show me what you got!", W / 2, 1170);
      ctx.fillStyle = "#818cf8";
      ctx.font = "bold 54px system-ui, sans-serif";
      ctx.fillText("showdle.lovable.app", W / 2, 1270);
      ctx.font = "90px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
      ctx.fillText("📺", W / 2, 1400);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("blob failed"))), "image/png");
    });

  const handleCopyCard = async () => {
    const blobPromise = buildCardBlob();
    try {
      // Pass the promise directly so Safari keeps the tap as the user gesture
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      toast({ title: "Story card copied ✅", description: "Paste it into your Instagram story or any chat." });
    } catch {
      try {
        const blob = await blobPromise;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `showey-${gameNumber}.png`; a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Story card saved", description: "Your browser can't copy images, so we downloaded it instead." });
      } catch {
        toast({ title: "Couldn't create story card", variant: "destructive" });
      }
    }
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
      <Button onClick={handleCopyCard} variant="outline" className="w-full max-w-xs">
        Copy Story Card
      </Button>
    </div>
  );
};