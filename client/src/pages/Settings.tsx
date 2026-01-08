import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Save, AlertTriangle, Twitter, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import { getSettings, saveSettings, deleteAllRecords, AppSettings, Language } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({ tweetTemplate: '', language: 'ja', autoTweet: false });
  const [template, setTemplate] = useState('');
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const current = getSettings();
    setSettings(current);
    setTemplate(current.tweetTemplate);
  }, []);

  const handleSaveTemplate = () => {
    saveSettings({ tweetTemplate: template });
    setSettings(prev => ({ ...prev, tweetTemplate: template }));
    toast.success(t.settings.saved);
  };

  const toggleAutoTweet = () => {
    const newValue = !settings.autoTweet;
    saveSettings({ autoTweet: newValue });
    setSettings(prev => ({ ...prev, autoTweet: newValue }));
  };

  const handleDeleteAll = () => {
    if (confirm(t.settings.deleteAllConfirm)) {
      deleteAllRecords();
      toast.success(t.settings.deletedAll);
    }
  };

  const handleTweet = () => {
    const text = encodeURIComponent(settings.tweetTemplate);
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 relative">
      <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="pt-12 px-6 mb-6 relative z-10">
        <h1 className="text-2xl text-primary font-serif tracking-widest">{t.settings.title}</h1>
      </header>

      <main className="flex-1 px-4 relative z-10 w-full max-w-md mx-auto flex flex-col gap-8">
        
        {/* Language Settings */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground px-2 font-light tracking-wide flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t.settings.language}
          </h2>
          <div className="glass-panel p-2 rounded-2xl flex">
            <button
              onClick={() => setLanguage('ja')}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm transition-all duration-300",
                language === 'ja' ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              日本語
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm transition-all duration-300",
                language === 'en' ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-muted-foreground hover:text-foreground"
              )}
            >
              English
            </button>
          </div>
        </section>

        {/* Tweet Settings */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground px-2 font-light tracking-wide flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            {t.settings.twitter}
          </h2>
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <label className="text-sm text-foreground">{t.settings.autoTweet}</label>
              <button
                onClick={toggleAutoTweet}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.autoTweet ? "bg-primary" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                  settings.autoTweet ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">{t.settings.template}</label>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[80px] resize-none"
                placeholder={t.settings.templatePlaceholder}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveTemplate}
                className="flex-1 glass-button py-2 rounded-lg text-sm flex items-center justify-center gap-2 text-primary hover:bg-primary/10"
              >
                <Save className="w-4 h-4" />
                {t.settings.save}
              </button>
              <button
                onClick={handleTweet}
                className="flex-1 glass-button py-2 rounded-lg text-sm flex items-center justify-center gap-2 text-foreground hover:bg-white/10"
              >
                <Twitter className="w-4 h-4" />
                {t.settings.testTweet}
              </button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground px-2 font-light tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t.settings.dataManagement}
          </h2>
          <div className="glass-panel p-5 rounded-2xl border-destructive/20">
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {t.settings.dataDesc}
            </p>
            <button
              onClick={handleDeleteAll}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
              {t.settings.deleteAll}
            </button>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="mt-auto py-6 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground/60 font-light tracking-wider">
            {t.settings.disclaimer}
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            Uttar v1.1.0
          </p>
        </footer>

      </main>

      <Navigation />
    </div>
  );
}
