import { useState } from "react";
import { motion } from "motion/react";
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { translations } from "@/lib/translations";

interface Goal {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  completed: boolean;
  category: "fitness" | "health" | "nutrition";
}

export default function HealthGoals({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Daily Steps", target: "10,000", current: "7,500", progress: 75, completed: false, category: "fitness" },
    { id: "2", title: "Water Intake", target: "3L", current: "2.5L", progress: 83, completed: false, category: "health" },
    { id: "3", title: "Sleep Duration", target: "8h", current: "7h", progress: 87, completed: false, category: "health" },
    { id: "4", title: "Calorie Intake", target: "2000 kcal", current: "1800 kcal", progress: 90, completed: false, category: "nutrition" },
  ]);

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress } : g));
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8" id="health-goals">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-primary">{t.riskTimeline}</h1>
          <p className="text-muted-foreground">Track and achieve your personalized health targets.</p>
        </div>
        <Button className="rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-6 w-6" />
          Add New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Weekly Progress
            </CardTitle>
            <CardDescription>You've achieved 85% of your goals this week!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl text-center">
                <Award className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">12</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">Goals Met</p>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-3xl text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">Active</p>
              </div>
              <div className="p-6 bg-violet-50 dark:bg-violet-950/20 rounded-3xl text-center">
                <Clock className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-violet-600">3</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">Pending</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Active Goals</h3>
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">{goal.current} / {goal.target}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminders Card */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-secondary" />
              {t.emergencyPrediction}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "08:00 AM", task: "Morning Medication", done: true },
              { time: "10:30 AM", task: "Blood Pressure Check", done: false },
              { time: "01:00 PM", task: "Lunch & Vitamins", done: false },
              { time: "06:00 PM", task: "Evening Walk", done: false },
              { time: "09:00 PM", task: "Sleep Routine", done: false },
            ].map((reminder, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <div className={`p-2 rounded-full ${reminder.done ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-muted-foreground'}`}>
                  {reminder.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${reminder.done ? 'line-through opacity-50' : ''}`}>{reminder.task}</p>
                  <p className="text-[10px] text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Goal List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2rem] ${goal.completed ? 'bg-emerald-500/5' : 'bg-white dark:bg-slate-900'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    goal.category === 'fitness' ? 'bg-blue-500/10 text-blue-500' :
                    goal.category === 'nutrition' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full ${goal.completed ? 'text-emerald-500' : 'text-muted-foreground'}`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    {goal.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </Button>
                </div>
                <h3 className="text-lg font-bold mb-1">{goal.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">Target: {goal.target}</p>
                <div className="flex items-center gap-2">
                  <Progress value={goal.progress} className="flex-grow h-1.5" />
                  <span className="text-[10px] font-bold">{goal.progress}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
