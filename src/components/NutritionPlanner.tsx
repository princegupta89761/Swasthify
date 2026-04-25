import { useState } from "react";
import { motion } from "motion/react";
import { Utensils, Apple, Coffee, Pizza, Info, Plus, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { translations } from "@/lib/translations";

export default function NutritionPlanner({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [calories, setCalories] = useState(1450);
  const goal = 2200;

  const meals = [
    { name: "Breakfast", calories: 450, icon: Coffee, time: "08:30 AM", items: "Oatmeal with berries, Coffee" },
    { name: "Lunch", calories: 650, icon: Utensils, time: "01:00 PM", items: "Grilled chicken salad, Quinoa" },
    { name: "Snack", calories: 150, icon: Apple, time: "04:30 PM", items: "Green apple, Almonds" },
    { name: "Dinner", calories: 200, icon: Pizza, time: "07:30 PM", items: "Pending..." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-8" id="nutrition-planner">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text">Nutrition & Diet</h1>
          <p className="text-muted-foreground">Track your daily intake and maintain a balanced diet.</p>
        </div>
        <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" />
          Log Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calorie Progress */}
        <Card className="lg:col-span-1 glass-card border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="text-xl">Daily Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-bold">{calories}</h2>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Calories Consumed</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span>Goal: {goal} kcal</span>
                <span>{Math.round((calories/goal) * 100)}%</span>
              </div>
              <Progress value={(calories/goal) * 100} className="h-3 rounded-full" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="font-bold">85g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="font-bold">160g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Fats</p>
                <p className="font-bold">42g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold px-2">Today's Meals</h3>
          <div className="space-y-4">
            {meals.map((meal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-none shadow-lg hover:bg-secondary/10 transition-colors cursor-pointer rounded-3xl group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <meal.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{meal.name}</h4>
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold">{meal.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{meal.items}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{meal.calories} kcal</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-start gap-4">
        <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-primary mb-1">AI Nutrition Tip</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on your activity levels today, we recommend increasing your protein intake by 15g for dinner to aid muscle recovery. Try adding grilled fish or lentils to your meal.
          </p>
        </div>
      </div>
    </div>
  );
}
