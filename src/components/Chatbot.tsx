import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Loader2, Bot, User, Stethoscope, Search, AlertTriangle, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoogleGenAI } from "@google/genai";
import { translations } from "@/lib/translations";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Chatbot({ language }: { language: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language] || translations.en;
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: t.chatbotGreeting }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update greeting when language changes
    setMessages([{ role: "bot", content: t.chatbotGreeting }]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are Swasthify AI Assistant, a helpful medical AI. Answer the following user query about health, wellness, or the Swasthify platform. 
        User Query: ${userMessage}
        Respond in ${language} language.
        Keep it concise and helpful. Always include a disclaimer that you are an AI and not a doctor.`
      });

      setMessages(prev => [...prev, { role: "bot", content: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" id="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute top-0 right-16 w-[350px] h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold">{t.chatbotTitle}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-grow p-4" id="chat-messages">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary p-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
              
              {messages.length === 1 && (
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-auto py-2 flex flex-col gap-1 rounded-xl"
                    onClick={() => setInput("Check my symptoms")}
                  >
                    <Stethoscope className="w-4 h-4 text-blue-500" />
                    Check Symptoms
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-auto py-2 flex flex-col gap-1 rounded-xl"
                    onClick={() => setInput("Find a doctor near me")}
                  >
                    <Search className="w-4 h-4 text-violet-500" />
                    Find Doctor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-auto py-2 flex flex-col gap-1 rounded-xl"
                    onClick={() => setInput("Information about paracetamol")}
                  >
                    <Pill className="w-4 h-4 text-emerald-500" />
                    Medicine Info
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-auto py-2 flex flex-col gap-1 rounded-xl"
                    onClick={() => setInput("Emergency SOS help")}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Emergency Help
                  </Button>
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  placeholder={t.typeQuery} 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-full"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        size="icon" 
        className="w-14 h-14 rounded-2xl shadow-lg hover:scale-110 transition-transform bg-primary"
        onClick={() => setIsOpen(!isOpen)}
        id="chatbot-toggle"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </Button>
    </div>
  );
}
