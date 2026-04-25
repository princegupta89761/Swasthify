import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Activity, Shield, Zap, ArrowRight, Play, X, Video } from "lucide-react";
import { translations } from "@/lib/translations";
import { useState } from "react";

export default function Hero({ onStart, language }: { onStart: () => void, language: string }) {
  const t = translations[language] || translations.en;

  return (
    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-background" id="hero-section">
      {/* Background Elements removed for cleaner look */}

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
              <Zap className="w-3 h-3" />
              <span>{t.nextGenMonitoring}</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-bold font-display leading-[1.1] mb-6 tracking-tight">
              Swasthify <br />
              <span className="gradient-text">{t.healthcareAI}</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="rounded-full h-16 px-10 text-lg font-bold group shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                onClick={onStart}
              >
                {t.startJourney}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 justify-center lg:justify-start opacity-70">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t.hipaaCompliant}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t.realTimeSync}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t.consultation247}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(30,64,175,0.3)] border-8 border-white/10 dark:border-slate-800/50">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
                alt="Healthcare AI" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 z-20 glass-card p-6 rounded-3xl shadow-2xl hidden sm:block border-none"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-2xl">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Heart Rate</p>
                  <p className="text-2xl font-bold">72 BPM</p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-green-500/30 rounded-full" />)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Specialist Card */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 z-20 glass-card p-4 rounded-3xl shadow-2xl hidden sm:block border-none"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src="https://i.pravatar.cc/100?u=doc" className="w-12 h-12 rounded-2xl object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <p className="text-xs font-bold">Dr. Sarah</p>
                  <p className="text-[10px] text-muted-foreground">{t.specialist}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { title: t.aiDiagnostics, desc: t.aiDiagnosticsDesc, icon: Zap, color: "text-blue-500" },
            { title: t.support247, desc: t.support247Desc, icon: Video, color: "text-violet-500" },
            { title: t.secureRecords, desc: t.secureRecordsDesc, icon: Shield, color: "text-emerald-500" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-[2.5rem] border-none hover:translate-y-[-5px] transition-transform"
            >
              <div className={`${feature.color} bg-current/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
