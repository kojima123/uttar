import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Save, AlertTriangle, Twitter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { getSettings, saveSettings, deleteAllRecords, AppSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({ tweetTemplate: '' });
  const [template, setTemplate] = useState('');

  useEffect(() => {
    const current = getSettings();
    setSettings(current);
    setTemplate(current.tweetTemplate);
  }, []);

  const handleSaveTemplate = () => {
    saveSettings({ tweetTemplate: template });
    setSettings(prev => ({ ...prev, tweetTemplate: template }));
    toast.success("設定を保存しました");
  };

  const handleDeleteAll = () => {
    if (confirm("本当に全てのデータを削除しますか？この操作は取り消せません。")) {
      deleteAllRecords();
      toast.success("全データを削除しました");
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
        <h1 className="text-2xl text-primary font-serif tracking-widest">設定</h1>
      </header>

      <main className="flex-1 px-4 relative z-10 w-full max-w-md mx-auto flex flex-col gap-8">
        
        {/* Tweet Settings */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground px-2 font-light tracking-wide flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            X (Twitter) 投稿設定
          </h2>
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">投稿テンプレート</label>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[80px] resize-none"
                placeholder="投稿内容を入力..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveTemplate}
                className="flex-1 glass-button py-2 rounded-lg text-sm flex items-center justify-center gap-2 text-primary hover:bg-primary/10"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
              <button
                onClick={handleTweet}
                className="flex-1 glass-button py-2 rounded-lg text-sm flex items-center justify-center gap-2 text-foreground hover:bg-white/10"
              >
                <Twitter className="w-4 h-4" />
                テスト投稿
              </button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground px-2 font-light tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            データ管理
          </h2>
          <div className="glass-panel p-5 rounded-2xl border-destructive/20">
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              端末に保存されている全ての記録データを削除します。この操作は元に戻せません。
            </p>
            <button
              onClick={handleDeleteAll}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
              全データを削除する
            </button>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="mt-auto py-6 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground/60 font-light tracking-wider">
            This app is for personal logging only and does not provide medical advice.
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            Uttar v1.0.0
          </p>
        </footer>

      </main>

      <Navigation />
    </div>
  );
}
