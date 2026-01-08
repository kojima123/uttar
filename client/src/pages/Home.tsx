import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Twitter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { BodyArea, BodySide, saveRecord, getSettings, saveSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBodyLabel } from "@/lib/i18n";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<BodyArea | null>(null);
  const [selectedSide, setSelectedSide] = useState<BodySide | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [autoTweet, setAutoTweet] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const settings = getSettings();
    setAutoTweet(settings.autoTweet);
  }, []);

  const toggleAutoTweet = () => {
    const newValue = !autoTweet;
    setAutoTweet(newValue);
    saveSettings({ autoTweet: newValue });
  };

  const handleSelect = (area: BodyArea, side: BodySide) => {
    setSelectedArea(area);
    setSelectedSide(side);
  };

  const handleRecord = () => {
    if (!selectedArea || !selectedSide) return;

    setIsRecording(true);
    
    // Simulate a gentle delay for "calmness"
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      saveRecord({
        date: today,
        area: selectedArea,
        side: selectedSide,
      });

      toast.success(t.home.recorded, {
        description: `${today} - ${getBodyLabel(language, selectedSide, selectedArea)}`,
      });

      if (autoTweet) {
        const settings = getSettings();
        const text = encodeURIComponent(settings.tweetTemplate);
        window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
      }

      setSelectedArea(null);
      setSelectedSide(null);
      setIsRecording(false);
    }, 800);
  };

  const BodyPart = ({ area, side, className }: { area: BodyArea, side: BodySide, className: string }) => {
    const isSelected = selectedArea === area && selectedSide === side;
    
    return (
      <button
        onClick={() => handleSelect(area, side)}
        className={cn(
          "absolute rounded-full transition-all duration-500 cursor-pointer",
          isSelected 
            ? "bg-primary/60 shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-110 z-10" 
            : "bg-white/5 hover:bg-white/10 border border-white/5",
          className
        )}
        aria-label={getBodyLabel(language, side, area)}
      >
        {isSelected && (
          <motion.div
            layoutId="glow"
            className="absolute inset-0 rounded-full bg-primary/30 blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="pt-12 px-6 mb-8 relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-primary font-serif tracking-widest drop-shadow-lg">{t.app.title}</h1>
          <p className="text-muted-foreground text-sm mt-2 font-light tracking-wide">{t.app.subtitle}</p>
        </div>
        <button
          onClick={toggleAutoTweet}
          className={cn(
            "p-3 rounded-full transition-all duration-300 border",
            autoTweet 
              ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
              : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
          )}
          aria-label={t.settings.autoTweet}
        >
          <Twitter className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto">
        <div className="relative w-[300px] h-[550px] flex items-center justify-center">
          {/* Silhouette Image */}
          <img 
            src="/images/body_silhouette.png" 
            alt="Body Silhouette" 
            className="absolute inset-0 w-full h-full object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />

          {/* Interaction Points - Adjusted positions based on standard silhouette */}
          {/* Arms */}
          <BodyPart area="arm" side="left" className="top-[22%] left-[15%] w-12 h-20" />
          <BodyPart area="arm" side="right" className="top-[22%] right-[15%] w-12 h-20" />

          {/* Abdomen */}
          <BodyPart area="abdomen" side="left" className="top-[32%] left-[35%] w-10 h-16" />
          <BodyPart area="abdomen" side="right" className="top-[32%] right-[35%] w-10 h-16" />

          {/* Thighs */}
          <BodyPart area="thigh" side="left" className="top-[50%] left-[28%] w-14 h-24" />
          <BodyPart area="thigh" side="right" className="top-[50%] right-[28%] w-14 h-24" />
        </div>

        <AnimatePresence>
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 w-full px-6"
            >
              <button
                onClick={handleRecord}
                disabled={isRecording}
                className="w-full glass-button py-4 rounded-xl text-lg font-serif tracking-widest text-primary shadow-[0_0_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isRecording ? t.home.recording : t.home.record}
                </span>
                {!isRecording && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation />
    </div>
  );
}
