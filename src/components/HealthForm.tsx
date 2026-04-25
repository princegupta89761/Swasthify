import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthData } from "@/services/gemini";
import { Loader2, Send } from "lucide-react";

import { translations } from "@/lib/translations";

interface HealthFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading: boolean;
  language: string;
}

export default function HealthForm({ onSubmit, isLoading, language }: HealthFormProps) {
  const t = translations[language] || translations.en;
  const [formData, setFormData] = useState<HealthData>({
    age: 25,
    gender: "male",
    weight: 70,
    height: 175,
    bloodPressure: "120/80",
    glucoseLevel: 90,
    symptoms: "",
    activityLevel: "moderate",
    sleepHours: 7,
  });

  const handleChange = (field: keyof HealthData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto glass-card border-none shadow-xl" id="health-form-card">
      <CardHeader>
        <CardTitle className="text-2xl">Health Assessment</CardTitle>
        <CardDescription>
          Enter your current health details for a personalized AI risk prediction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          className="space-y-6" 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          id="health-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={formData.age ?? ""} 
                onChange={(e) => handleChange("age", e.target.value === "" ? undefined : parseInt(e.target.value))} 
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(v) => handleChange("gender", v)} defaultValue={formData.gender}>
                <SelectTrigger id="gender" className="rounded-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={formData.weight ?? ""} 
                onChange={(e) => handleChange("weight", e.target.value === "" ? undefined : parseInt(e.target.value))} 
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={formData.height ?? ""} 
                onChange={(e) => handleChange("height", e.target.value === "" ? undefined : parseInt(e.target.value))} 
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp">Blood Pressure (e.g. 120/80)</Label>
              <Input 
                id="bp" 
                value={formData.bloodPressure} 
                onChange={(e) => handleChange("bloodPressure", e.target.value)} 
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
              <Input 
                id="glucose" 
                type="number" 
                value={formData.glucoseLevel ?? ""} 
                onChange={(e) => handleChange("glucoseLevel", e.target.value === "" ? undefined : parseInt(e.target.value))} 
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select onValueChange={(v) => handleChange("activityLevel", v)} defaultValue={formData.activityLevel}>
                <SelectTrigger id="activity" className="rounded-full">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep (hrs/day)</Label>
              <Input 
                id="sleep" 
                type="number" 
                value={formData.sleepHours ?? ""} 
                onChange={(e) => handleChange("sleepHours", e.target.value === "" ? undefined : parseInt(e.target.value))} 
                className="rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">Current Symptoms (Optional)</Label>
            <Input 
              id="symptoms" 
              placeholder="e.g. Headache, fatigue, chest pain..." 
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              className="rounded-full"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-full text-lg font-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                Analyze with SwasthAI
                <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
