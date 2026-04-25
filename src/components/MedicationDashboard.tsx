import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  History, 
  TrendingUp, 
  Activity, 
  Pill, 
  Droplets, 
  Zap,
  Calendar as CalendarIcon,
  CheckCircle2
} from "lucide-react";
import { Medicine } from "@/services/medicineData";

interface MedicationDashboardProps {
  intakeHistory: { medicine: Medicine; timestamp: Date }[];
}

export default function MedicationDashboard({ intakeHistory }: MedicationDashboardProps) {
  // Process data for charts
  const dailyIntake = intakeHistory.reduce((acc: any, curr) => {
    const day = curr.timestamp.toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    name: day,
    count: dailyIntake[day] || 0
  }));

  const typeData = [
    { name: 'Tablets', value: intakeHistory.filter(h => h.medicine.type === 'tablet').length },
    { name: 'Syrups', value: intakeHistory.filter(h => h.medicine.type === 'syrup').length },
    { name: 'Powders', value: intakeHistory.filter(h => h.medicine.type === 'powder').length },
  ].filter(d => d.value > 0);

  const totalNutrition = intakeHistory.reduce((acc, curr) => {
    if (curr.medicine.isSupplement && curr.medicine.nutrition) {
      acc.calories += curr.medicine.nutrition.calories;
      acc.protein += curr.medicine.nutrition.protein;
    }
    return acc;
  }, { calories: 0, protein: 0 });

  const COLORS = ['#2563EB', '#38BDF8', '#22C55E'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" id="medication-dashboard-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">Medication & Nutrition Dashboard</h2>
          <p className="text-muted-foreground">Track your intake history and nutritional gains from supplements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-none rounded-[2rem] p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Intake</p>
              <h4 className="text-2xl font-bold">{intakeHistory.length}</h4>
            </div>
          </div>
        </Card>

        <Card className="glass-card border-none rounded-[2rem] p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Calories</p>
              <h4 className="text-2xl font-bold text-emerald-600">{totalNutrition.calories} kcal</h4>
            </div>
          </div>
        </Card>

        <Card className="glass-card border-none rounded-[2rem] p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-2xl">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Protein</p>
              <h4 className="text-2xl font-bold text-blue-600">{totalNutrition.protein}g</h4>
            </div>
          </div>
        </Card>

        <Card className="glass-card border-none rounded-[2rem] p-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Daily Avg</p>
              <h4 className="text-2xl font-bold">{(intakeHistory.length / 7).toFixed(1)}</h4>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none rounded-[2.5rem] p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Weekly Intake Trend
            </CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card border-none rounded-[2.5rem] p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Medicine Type Mix
            </CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {typeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Recent Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-primary/5">
            {intakeHistory.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No intake history recorded yet. Use the scanner to log your medicines.
              </div>
            ) : (
              intakeHistory.slice().reverse().map((item, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-bold">{item.medicine.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3">
                    {item.medicine.type}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
