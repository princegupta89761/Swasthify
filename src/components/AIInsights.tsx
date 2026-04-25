import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { motion } from "motion/react";
import { translations } from "@/lib/translations";

interface AIInsightsProps {
  insights: string | null;
  language: string;
}

export default function AIInsights({ insights, language }: AIInsightsProps) {
  const t = translations[language] || translations.en;
  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8"
      id="ai-insights-container"
    >
      <Card className="border-primary/20 bg-primary/5 glass-card">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="bg-primary p-2 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">SwasthAI Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">Personalized health predictions and suggestions</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none dark:prose-invert" id="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> {children}</h3>,
                h2: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2 flex items-center gap-2 text-primary">{children}</h4>,
                ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
                li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                p: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                blockquote: ({ children }) => (
                  <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg italic text-amber-500">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {children}
                    </div>
                  </div>
                )
              }}
            >
              {insights}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
