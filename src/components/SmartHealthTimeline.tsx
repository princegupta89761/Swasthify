import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface TimelineEntry {
  id: string;
  date: string;
  symptom: string;
  severity: number;
  prediction: string;
  type: "normal" | "warning" | "critical";
}

const mockTimelineData: TimelineEntry[] = [
  { id: "1", date: "2026-04-01", symptom: "Mild Fatigue", severity: 2, prediction: "Low risk, monitor rest", type: "normal" },
  { id: "2", date: "2026-04-03", symptom: "Slight Headache", severity: 3, prediction: "Dehydration likely", type: "normal" },
  { id: "3", date: "2026-04-05", symptom: "Increased Heart Rate", severity: 5, prediction: "Stress detected", type: "warning" },
  { id: "4", date: "2026-04-07", symptom: "Chest Tightness", severity: 7, prediction: "Potential cardiovascular strain", type: "critical" },
  { id: "5", date: "2026-04-09", symptom: "Shortness of Breath", severity: 8, prediction: "High risk of respiratory distress", type: "critical" },
];

const chartData = [
  { day: "04/01", severity: 2, heartRate: 72 },
  { day: "04/03", severity: 3, heartRate: 75 },
  { day: "04/05", severity: 5, heartRate: 88 },
  { day: "04/07", severity: 7, heartRate: 95 },
  { day: "04/09", severity: 8, heartRate: 102 },
];

export default function SmartHealthTimeline({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Simulate emergency prediction logic
    const latest = mockTimelineData[mockTimelineData.length - 1];
    if (latest.type === "critical") {
      const timer = setTimeout(() => setShowWarning(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8" id="health-timeline">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text">{t.riskTimeline}</h1>
          <p className="text-muted-foreground">{t.emergencyPrediction}</p>
        </div>
        <Button variant="destructive" className="rounded-full px-8 py-6 text-lg font-bold animate-pulse shadow-lg shadow-red-500/20">
          <ShieldAlert className="mr-2 h-6 w-6" />
          {t.sos}
        </Button>
      </div>

      {showWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6 flex items-start gap-4 shadow-2xl shadow-red-500/10"
        >
          <div className="bg-red-500 p-3 rounded-2xl">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">{t.preEmergencyWarning}</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {t.abnormalPatterns}: Rising heart rate combined with respiratory symptoms detected over the last 48 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive" className="rounded-full">{t.sos}</Button>
              <Button variant="outline" className="rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                {t.preventiveActions}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Graph */}
        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              {t.emergencyPrediction} Analysis
            </CardTitle>
            <CardDescription>Severity Trend & Heart Rate Correlation</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="severity" 
                  stroke="var(--color-secondary)" 
                  fillOpacity={1} 
                  fill="url(#colorSeverity)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="var(--color-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorHR)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prediction Card */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-accent" />
              {t.futureRisks}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Next 24 Hours
              </h4>
              <p className="text-sm text-muted-foreground">
                High probability of continued respiratory strain. Immediate rest and hydration recommended.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t.preventiveActions}</h4>
              {[
                "Monitor oxygen levels every 2 hours",
                "Avoid strenuous physical activity",
                "Contact Dr. Smith for a follow-up",
                "Keep emergency inhaler accessible"
              ].map((action, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-display px-2">{t.symptoms} History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTimelineData.slice().reverse().map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 ${
                entry.type === 'critical' ? 'bg-red-500/5 border-l-4 border-l-red-500' : 
                entry.type === 'warning' ? 'bg-amber-500/5 border-l-4 border-l-amber-500' : 
                'bg-card border-l-4 border-l-primary'
              }`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      entry.type === 'critical' ? 'bg-red-100 text-red-600' : 
                      entry.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      {entry.type}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{entry.symptom}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          entry.severity > 7 ? 'bg-red-500' : 
                          entry.severity > 4 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${entry.severity * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{entry.severity}/10</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{entry.prediction}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
