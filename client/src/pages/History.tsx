import { useState, useEffect, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { ja, enUS } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { getRecords, InjectionRecord, deleteRecord } from "@/lib/storage";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBodyLabel } from "@/lib/i18n";
import { calculateBodyPartStatistics, getMostAndLeastUsedParts } from "@/lib/statisticsHelper";
import { StatisticsPieChart } from "@/components/StatisticsPieChart";

export default function History() {
  const [records, setRecords] = useState<InjectionRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRecords, setSelectedRecords] = useState<InjectionRecord[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setSelectedRecords(records.filter(r => r.date === dateStr));
    } else {
      setSelectedRecords([]);
    }
  }, [selectedDate, records]);

  const loadRecords = () => {
    setRecords(getRecords());
  };

  // Calculate statistics for past 30 days
  const statistics = useMemo(() => calculateBodyPartStatistics(records, 30), [records]);
  const { mostUsed, leastUsed } = useMemo(() => getMostAndLeastUsedParts(statistics), [statistics]);

  const handleDelete = (id: string) => {
    if (confirm(t.history.deleteConfirm)) {
      deleteRecord(id);
      loadRecords();
    }
  };

  // Create modifiers for calendar to highlight days with records
  const recordedDays = records.map(r => parseISO(r.date));
  
  return (
    <div className="min-h-screen flex flex-col pb-24 relative">
      <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="pt-12 px-6 mb-6 relative z-10">
        <h1 className="text-2xl text-primary font-serif tracking-widest">{t.history.title}</h1>
      </header>

      <main className="flex-1 px-4 relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Statistics Dashboard */}
        {statistics.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg text-primary font-serif tracking-wide mb-4">
              {language === 'ja' ? '過去30日間の統計' : 'Past 30 Days Statistics'}
            </h2>
            
            <StatisticsPieChart statistics={statistics} />
            
            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {language === 'ja' ? '総注射回数' : 'Total Injections'}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {statistics.reduce((sum: number, s) => sum + s.count, 0)}
                </div>
              </div>
              
              {mostUsed && (
                <div className="glass-panel rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    {language === 'ja' ? '最も使用' : 'Most Used'}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {(() => {
                      const [side, area] = mostUsed.part.split('-');
                      return getBodyLabel(language, side as 'left' | 'right', area as 'arm' | 'abdomen' | 'thigh');
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mostUsed.count} {language === 'ja' ? '回' : 'times'}
                  </div>
                </div>
              )}
              
              {leastUsed && (
                <div className="glass-panel rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    {language === 'ja' ? '最も少ない' : 'Least Used'}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {(() => {
                      const [side, area] = leastUsed.part.split('-');
                      return getBodyLabel(language, side as 'left' | 'right', area as 'arm' | 'abdomen' | 'thigh');
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {leastUsed.count} {language === 'ja' ? '回' : 'times'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        {/* Calendar Card */}
        <div className="glass-panel rounded-2xl p-4">
          <style>{`
            .rdp { --rdp-cell-size: 40px; --rdp-accent-color: var(--primary); --rdp-background-color: var(--primary-foreground); margin: 0; }
            .rdp-day_selected:not([disabled]) { background-color: var(--primary); color: var(--primary-foreground); font-weight: bold; }
            .rdp-day_today { color: var(--primary); font-weight: bold; }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(255,255,255,0.1); }
            .rdp-caption_label { color: var(--foreground); font-family: var(--font-serif); font-size: 1.1rem; }
            .rdp-head_cell { color: var(--muted-foreground); font-weight: normal; }
            .rdp-day { color: var(--foreground); }
            .recorded-day { position: relative; }
            .recorded-day::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: var(--primary);
              opacity: 0.7;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={language === 'ja' ? ja : enUS}
            modifiers={{ recorded: recordedDays }}
            modifiersClassNames={{ recorded: "recorded-day" }}
            className="w-full flex justify-center"
          />
        </div>

        {/* Details List */}
        <div className="flex-1">
          <h2 className="text-sm text-muted-foreground mb-3 px-2 font-light tracking-wide">
            {selectedDate ? format(selectedDate, language === 'ja' ? 'yyyy年M月d日' : 'MMMM d, yyyy', { locale: language === 'ja' ? ja : enUS }) : t.history.selectDate}
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {selectedRecords.length > 0 ? (
                selectedRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-4 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-2 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-1 h-6 rounded-full bg-primary/60" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-serif text-foreground">
                            {getBodyLabel(language, record.side, record.area)}
                          </p>
                          {record.painLevel && (
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              record.painLevel <= 2 ? "bg-green-500/20 text-green-400" :
                              record.painLevel <= 3 ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-red-500/20 text-red-400"
                            )}>
                              {language === 'ja' ? `痛み ${record.painLevel}` : `Pain ${record.painLevel}`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {new Date(record.timestamp).toLocaleTimeString(language === 'ja' ? 'ja-JP' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="削除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
                ) : (
                selectedDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-muted-foreground/50 font-light"
                  >
                    {t.history.noRecords}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
