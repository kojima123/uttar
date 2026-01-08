import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Twitter, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SharedFeed from "@/components/SharedFeed";
import { BodyArea, BodySide, saveRecord, getSettings, saveSettings, getNickname } from "@/lib/storage";
import { isBodyPartRecommended } from "@/lib/rotationHelper";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBodyLabel } from "@/lib/i18n";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<BodyArea | null>(null);
  const [selectedSide, setSelectedSide] = useState<BodySide | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [autoTweet, setAutoTweet] = useState(false);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(() => {
    const saved = localStorage.getItem('community_feed_collapsed');
    return saved === 'true';
  });
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [painLevel, setPainLevel] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const { t, language } = useLanguage();
  const addSharedRecord = trpc.shared.add.useMutation();
  const utils = trpc.useUtils();

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
    // Show notes modal instead of immediately recording
    setShowNotesModal(true);
  };

  const handleConfirmRecord = async () => {
    if (!selectedArea || !selectedSide) return;

    // Open window immediately to avoid popup blocker
    if (autoTweet) {
      const settings = getSettings();
      const partLabel = getBodyLabel(language, selectedSide, selectedArea);
      const text = encodeURIComponent(settings.tweetTemplate.replace('{part}', partLabel));
      window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
    }

    setIsRecording(true);
    setShowNotesModal(false);
    
    // Simulate a gentle delay for "calmness"
    setTimeout(async () => {
      const today = new Date().toISOString().split('T')[0];
      saveRecord({
        date: today,
        area: selectedArea,
        side: selectedSide,
        painLevel: painLevel,
        notes: notes || undefined,
      });

      // Send to shared timeline
      try {
        const nickname = getNickname() || t.shared.anonymous;
        await addSharedRecord.mutateAsync({
          nickname,
          area: selectedArea,
          side: selectedSide,
        });
        // Refresh the feed
        utils.shared.list.invalidate();
      } catch (error) {
        console.error('Failed to add shared record:', error);
        // Continue even if sharing fails - local record is saved
      }

      toast.success(t.home.recorded, {
        description: `${today} - ${getBodyLabel(language, selectedSide, selectedArea)}`,
      });

      // Reset form
      setSelectedArea(null);
      setSelectedSide(null);
      setPainLevel(undefined);
      setNotes('');
      setIsRecording(false);
    }, 800);
  };

  const BodyPart = ({ area, side, className }: { area: BodyArea, side: BodySide, className: string }) => {
    const isSelected = selectedArea === area && selectedSide === side;
    const isRecommended = isBodyPartRecommended(side, area);
    
    return (
      <button
        onClick={() => handleSelect(area, side)}
        className={cn(
          "absolute rounded-full transition-all duration-500 cursor-pointer",
          isSelected 
            ? "bg-primary/60 shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-110 z-10" 
            : isRecommended
            ? "bg-green-500/30 hover:bg-green-500/40 border-2 border-green-400/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
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

      <main className="flex-1 flex flex-col relative z-10 w-full mx-auto px-4 overflow-x-auto">
        {/* Minimize/Expand Button - Fixed Top Left */}
        {isFeedCollapsed ? (
          <button
            onClick={() => setIsFeedCollapsed(false)}
            className="absolute top-4 left-4 glass-panel p-3 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all z-20"
            aria-label="Expand community feed"
          >
            <Users className="w-5 h-5 text-primary" />
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <button
            onClick={() => setIsFeedCollapsed(true)}
            className="absolute top-4 left-4 glass-panel p-3 rounded-2xl hover:bg-white/10 transition-all z-20"
            aria-label="Minimize community feed"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Content Section */}
        <div className={cn(
          "flex gap-6 items-start",
          isFeedCollapsed ? "justify-center w-full" : "min-w-max"
        )}>
          {/* Shared Community Feed */}
          {!isFeedCollapsed && (
            <div className="flex-shrink-0">
              <SharedFeed />
            </div>
          )}

          {/* Body Silhouette Section */}
          <div className={cn(
            "flex items-center justify-center",
            isFeedCollapsed && "mx-auto"
          )}>
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

          <AnimatePresence>
            {selectedArea && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-0 right-0 px-6 max-w-md mx-auto"
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
        </div>
          </div>
        </div>
      </main>

      <Navigation />

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-6 rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif text-primary mb-4">
                {language === 'ja' ? '記録の詳細（任意）' : 'Record Details (Optional)'}
              </h3>

              {/* Pain Level */}
              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2">
                  {language === 'ja' ? '痛みレベル' : 'Pain Level'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setPainLevel(painLevel === level ? undefined : level)}
                      className={cn(
                        "flex-1 py-3 rounded-lg transition-all",
                        painLevel === level
                          ? "bg-primary/30 border-2 border-primary text-primary"
                          : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ja' ? '1: 痛みなし - 5: 強い痛み' : '1: No pain - 5: Severe pain'}
                </p>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  {language === 'ja' ? 'メモ' : 'Notes'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ja' ? '気づいたことを記録...' : 'Record your observations...'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setPainLevel(undefined);
                    setNotes('');
                  }}
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-all"
                >
                  {language === 'ja' ? 'キャンセル' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmRecord}
                  disabled={isRecording}
                  className="flex-1 py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-all disabled:opacity-50"
                >
                  {language === 'ja' ? '記録する' : 'Record'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
