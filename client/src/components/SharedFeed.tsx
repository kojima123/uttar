import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBodyLabel } from '@/lib/i18n';

export default function SharedFeed() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('community_feed_collapsed');
    return saved === 'true';
  });

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('community_feed_collapsed', String(newState));
  };

  const { t, language } = useLanguage();
  const { data: records, isLoading, error } = trpc.shared.list.useQuery(undefined, {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-serif text-primary tracking-wide">{t.shared.title}</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - community feed is optional
  }

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        className="glass-panel p-3 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all"
        aria-label="Expand community feed"
      >
        <Users className="w-5 h-5 text-primary" />
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-serif text-primary tracking-wide">{t.shared.title}</h2>
        </div>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Minimize community feed"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground/70 mb-4">{t.shared.subtitle}</p>

      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {records && records.length > 0 ? (
            records.map((record, index) => {
              const partLabel = getBodyLabel(language, record.side, record.area);
              const displayName = record.nickname || t.shared.anonymous;
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium text-primary">{displayName}</span>
                    {t.shared.recorded.replace('{part}', partLabel)}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {new Date(record.createdAt).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground/60 text-sm">
              {t.shared.noRecords}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
