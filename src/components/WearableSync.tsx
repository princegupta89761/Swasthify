import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { translations } from "@/lib/translations";

export default function WearableSync({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [isMobileConnected, setIsMobileConnected] = useState(true);

  const startSync = () => {
    setStatus("syncing");
    setProgress(0);
  };

  useEffect(() => {
    if (status === "syncing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("success");
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <Card className="border-none bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] shadow-xl" id="wearable-sync-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Mobile Sync</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Smartphone className={`w-3 h-3 ${isMobileConnected ? 'text-green-500' : 'text-muted-foreground'}`} />
            <span className="text-[10px] font-medium">{isMobileConnected ? t.connected : t.disconnected}</span>
          </div>
        </div>
        <CardDescription>Sync your health data from your smartphone</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <Button variant="default" className="w-full rounded-full h-12 font-bold" onClick={startSync}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Now
          </Button>
        )}

        {status === "syncing" && (
          <div className="space-y-2 mt-2">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Syncing BP, Glucose, and Sleep data...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center gap-2 text-green-600 py-1 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{t.syncSuccess}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStatus("idle")} className="h-8 px-2 text-xs">
              {t.syncAgain}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
