import { useState, useEffect } from "react";
import { 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp, 
  Clock, 
  Moon, 
  Flame, 
  Footprints,
  Smartphone,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion } from "motion/react";
import { translations } from "@/lib/translations";

const generateData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    heartRate: 65 + Math.floor(Math.random() * 20),
    steps: Math.floor(Math.random() * 1000),
  }));
};

export default function Dashboard({ language, onNavigate }: { language: string, onNavigate: (view: string) => void }) {
  const [data, setData] = useState(generateData());
  const [liveHeartRate, setLiveHeartRate] = useState(72);
  const [liveSteps, setLiveSteps] = useState(4230);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHeartRate(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        const newVal = Math.max(60, Math.min(100, prev + change));
        
        // Update chart data
        setData(prevData => {
          const newData = [...prevData.slice(1), {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            heartRate: newVal,
            steps: prevData[prevData.length - 1].steps + Math.floor(Math.random() * 2)
          }];
          return newData;
        });
        
        return newVal;
      });
      setLiveSteps(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      title: t.heartRate, 
      value: `${liveHeartRate} ${t.bpm}`, 
      icon: Heart, 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      trend: "+2%",
      desc: t.live
    },
    { 
      title: t.bloodPressure, 
      value: "120/80", 
      icon: Activity, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: t.normal,
      desc: t.synced
    },
    { 
      title: t.bloodGlucose, 
      value: "95 mg/dL", 
      icon: Zap, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      trend: t.stable,
      desc: t.synced
    },
    { 
      title: t.sleep, 
      value: `7.5 ${t.hrs}`, 
      icon: Moon, 
      color: "text-indigo-500", 
      bg: "bg-indigo-500/10",
      trend: "85%",
      desc: t.lastNight
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" id="dashboard-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">{t.realTimeDashboard}</h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Smartphone className="w-4 h-4" />
            <span>{t.syncedMobileDevice}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold animate-pulse">
          <div className="w-2 h-2 bg-primary rounded-full" />
          {t.live}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={stat.action}
            className={stat.action ? "cursor-pointer" : ""}
          >
            <Card className={`overflow-hidden border-none shadow-lg glass-card hover:scale-[1.02] transition-transform ${stat.action ? "ring-2 ring-primary/20" : "cursor-default"}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 
                    stat.trend.startsWith('-') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stat.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-none shadow-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="text-red-500 w-5 h-5" />
              {t.heartRateVariation}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Footprints className="text-emerald-500 w-5 h-5" />
              {t.stepsActivity}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="stepAfter" dataKey="steps" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.aiEstimationDisclaimer}
        </p>
      </div>
    </div>
  );
}
