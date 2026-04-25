import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Droplets, Stethoscope, GraduationCap, Syringe, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "@/lib/translations";

export default function HealthTools({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // BMI State
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  // Water State
  const [water, setWater] = useState(0);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const tools = [
    { id: "bmi", title: "BMI Calculator", icon: Calculator, color: "text-blue-500", bg: "bg-slate-100 dark:bg-slate-800" },
    { id: "water", title: "Water Tracker", icon: Droplets, color: "text-cyan-500", bg: "bg-slate-100 dark:bg-slate-800" },
    { id: "symptom", title: "Symptom Checker", icon: Stethoscope, color: "text-violet-500", bg: "bg-slate-100 dark:bg-slate-800" },
    { id: "quiz", title: "Health Quiz", icon: GraduationCap, color: "text-amber-500", bg: "bg-slate-100 dark:bg-slate-800" },
    { id: "vaccine", title: "Vaccine Tracker", icon: Syringe, color: "text-emerald-500", bg: "bg-slate-100 dark:bg-slate-800" },
  ];

  return (
    <div className="container mx-auto px-4 py-12" id="health-tools-view">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-display mb-4">Smart Health Tools</h2>
        <p className="text-muted-foreground">Essential utilities to manage your daily wellness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "outline"}
            className={`h-auto py-6 flex-col gap-3 rounded-[2rem] border-none shadow-lg transition-all ${
              activeTool === tool.id ? 'scale-105' : 'hover:scale-105 bg-card'
            }`}
            onClick={() => setActiveTool(tool.id)}
          >
            <div className={`${tool.bg} p-3 rounded-2xl`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <span className="text-xs font-bold">{tool.title}</span>
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTool === "bmi" && (
          <motion.div
            key="bmi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-none rounded-[2.5rem] p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-500/10 p-3 rounded-2xl">
                  <Calculator className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">BMI Calculator</h3>
                  <p className="text-sm text-muted-foreground">Body Mass Index calculation</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Weight (kg)</label>
                  <Input 
                    type="number" 
                    placeholder="70" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/20 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-2">Height (cm)</label>
                  <Input 
                    type="number" 
                    placeholder="175" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/20 border-none"
                  />
                </div>
              </div>
              <Button onClick={calculateBMI} className="w-full h-14 rounded-2xl font-bold text-lg mb-8">Calculate BMI</Button>
              {bmi && (
                <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Your BMI is</p>
                  <h4 className="text-5xl font-bold text-primary mb-4">{bmi}</h4>
                  <p className={`text-lg font-bold ${
                    bmi < 18.5 ? 'text-blue-500' : 
                    bmi < 25 ? 'text-green-500' : 
                    bmi < 30 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {bmi < 18.5 ? 'Underweight' : 
                     bmi < 25 ? 'Normal Weight' : 
                     bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTool === "water" && (
          <motion.div
            key="water"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-none rounded-[2.5rem] p-8 max-w-2xl mx-auto text-center">
              <div className="bg-cyan-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Droplets className="w-10 h-10 text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Water Intake Tracker</h3>
              <p className="text-muted-foreground mb-8">Stay hydrated throughout the day</p>
              
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-8 border-secondary/20" />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-cyan-500/30 rounded-full transition-all duration-500"
                  style={{ height: `${(water / 8) * 100}%` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{water}</span>
                  <span className="text-xs text-muted-foreground">of 8 glasses</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="w-16 h-16 rounded-full text-2xl"
                  onClick={() => setWater(Math.max(0, water - 1))}
                >-</Button>
                <Button 
                  className="w-16 h-16 rounded-full text-2xl bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => setWater(Math.min(20, water + 1))}
                >+</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTool === "symptom" && (
          <motion.div
            key="symptom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-none rounded-[2.5rem] p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-violet-500/10 p-3 rounded-2xl">
                  <Stethoscope className="w-8 h-8 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Symptom Checker</h3>
                  <p className="text-sm text-muted-foreground">Preliminary analysis of your symptoms</p>
                </div>
              </div>
              <div className="space-y-4">
                <Input placeholder="Describe your symptoms (e.g., headache, fever)..." className="h-14 rounded-2xl bg-secondary/20 border-none" />
                <Button className="w-full h-14 rounded-2xl font-bold bg-violet-500 hover:bg-violet-600">Analyze Symptoms</Button>
                <div className="p-4 bg-violet-500/5 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-violet-500 shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    Disclaimer: This tool provides AI-based estimations and is not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTool === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-none rounded-[2.5rem] p-8 max-w-2xl mx-auto text-center">
              <div className="bg-amber-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Health Awareness Quiz</h3>
              <p className="text-muted-foreground mb-8">Test your knowledge about healthy living</p>
              <Button className="w-full h-14 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600">Start Quiz</Button>
            </Card>
          </motion.div>
        )}

        {activeTool === "vaccine" && (
          <motion.div
            key="vaccine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-none rounded-[2.5rem] p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-500/10 p-3 rounded-2xl">
                  <Syringe className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Vaccination Tracker</h3>
                  <p className="text-sm text-muted-foreground">Keep track of your immunization history</p>
                </div>
              </div>
              <div className="space-y-3">
                {["COVID-19", "Influenza", "Hepatitis B"].map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                    <span className="font-bold">{v}</span>
                    <Button variant="ghost" size="sm" className="text-primary">Add Date</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2">
                  Add New Vaccine
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {!activeTool && (
          <motion.div
            key="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChevronRight className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Select a tool above to get started</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
