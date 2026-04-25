import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import HealthForm from "@/components/HealthForm";
import AIInsights from "@/components/AIInsights";
import Telemedicine from "@/components/Telemedicine";
import Chatbot from "@/components/Chatbot";
import MedicineSearch from "@/components/MedicineSearch";
import NutritionPlanner from "@/components/NutritionPlanner";
import HealthGoals from "@/components/HealthGoals";
import SOSButton from "@/components/SOSButton";
import HealthRecords from "@/components/HealthRecords";
import WearableSync from "@/components/WearableSync";
import HealthTools from "@/components/HealthTools";
import { HealthData, analyzeHealthRisk } from "@/services/gemini";
import { motion, AnimatePresence } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MedicineScanner from "@/components/MedicineScanner";
import MedicationDashboard from "@/components/MedicationDashboard";
import PharmacyMarketplace from "@/components/PharmacyMarketplace";
import PaymentGateway from "@/components/PaymentGateway";
import OrderTracking from "@/components/OrderTracking";
import { Medicine, MedicineShop } from "@/services/medicineData";
import { Activity, TrendingUp, CheckCircle2, Heart, Plus, Leaf, User, ShoppingCart, Bell, AlertTriangle, X, Pill } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { translations } from "@/lib/translations";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [intakeHistory, setIntakeHistory] = useState<{ medicine: Medicine; timestamp: Date }[]>([]);
  const [cart, setCart] = useState<{ medicine: Medicine; shop: MedicineShop }[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{name: string, phone: string, address: string} | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'info' | 'warning' }[]>([]);
  const t = translations[language] || translations.en;

  // Handle language persistence and auto-detection
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (translations[browserLang]) {
        setLanguage(browserLang);
        localStorage.setItem("language", browserLang);
      }
    }
  }, []);

  // Handle auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      addNotification("Signed out successfully", "info");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleMarkTaken = (medicine: Medicine) => {
    const newEntry = { medicine, timestamp: new Date() };
    
    // Overdose check (same medicine taken more than twice in last 4 hours)
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentIntakes = intakeHistory.filter(h => 
      h.medicine.id === medicine.id && h.timestamp > fourHoursAgo
    );

    if (recentIntakes.length >= 2) {
      addNotification(t.warningOverdose.replace('{medicine}', medicine.name), 'warning');
    }

    setIntakeHistory(prev => [...prev, newEntry]);
    addNotification(t.loggedIntake.replace('{medicine}', medicine.name), 'info');
  };

  const handleAddToCart = (medicine: Medicine, shop?: MedicineShop) => {
    const selectedShop = shop || medicine.shops[0];
    setCart(prev => [...prev, { medicine, shop: selectedShop }]);
    addNotification(t.addedToCart.replace('{medicine}', medicine.name).replace('{shop}', selectedShop.name), 'info');
  };

  const addNotification = (message: string, type: 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message, type }, ...prev]);
    // Keep notifications for 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleHealthSubmit = async (data: HealthData) => {
    setIsLoading(true);
    try {
      const result = await analyzeHealthRisk(data, language);
      setInsights(result || "No insights generated.");
      setCurrentView("insights");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="space-y-20 bg-background">
            <Hero onStart={() => setCurrentView("dashboard")} language={language} />
            <div className="container mx-auto px-4 py-12">
              <MedicineSearch language={language} onAddToCart={handleAddToCart} />
            </div>
            <HealthTools language={language} />
            <section className="container mx-auto px-4 py-20 bg-secondary/20 rounded-[3rem]">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">{t.platformFeatures}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t.platformFeaturesDesc}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: t.realTimeMonitoring, desc: t.realTimeMonitoringDesc },
                  { title: t.aiDiagnostics, desc: t.aiDiagnosticsShortDesc },
                  { title: t.telemedicine, desc: t.telemedicineShortDesc }
                ].map((f, i) => (
                  <div key={i} className="glass-card p-8 rounded-3xl border-none shadow-xl">
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case "dashboard":
        return (
          <div className="space-y-12 pb-20 bg-background min-h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Dashboard language={language} onNavigate={setCurrentView} />
                </div>
                <div className="space-y-8">
                  <WearableSync language={language} />
                  <div className="glass-card p-6 rounded-[2rem] space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      {t.quickActions}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="rounded-xl h-20 flex flex-col gap-2" onClick={() => setCurrentView("nutrition")}>
                        <TrendingUp className="w-5 h-5 text-violet-500" />
                        <span className="text-xs">{t.nutrition}</span>
                      </Button>
                      <Button variant="outline" className="rounded-xl h-20 flex flex-col gap-2" onClick={() => setCurrentView("records")}>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs">{t.records}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-4">
              <HealthForm onSubmit={handleHealthSubmit} isLoading={isLoading} language={language} />
            </div>
          </div>
        );
      case "insights":
        return (
          <div className="container mx-auto px-4 py-12 pb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-display">{t.healthAnalysis}</h2>
              <button 
                onClick={() => setCurrentView("dashboard")}
                className="text-primary hover:underline font-medium"
              >
                {t.backToDashboard}
              </button>
            </div>
            <AIInsights insights={insights} language={language} />
          </div>
        );
      case "telemedicine":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <Telemedicine language={language} />
          </div>
        );
      case "timeline":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <HealthGoals language={language} />
          </div>
        );
      case "nutrition":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <NutritionPlanner language={language} />
          </div>
        );
      case "records":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <HealthRecords language={language} />
          </div>
        );
      case "scanner":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <MedicineScanner 
              language={language} 
              onMarkTaken={handleMarkTaken}
              onAddToCart={handleAddToCart}
            />
          </div>
        );
      case "med-dashboard":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <MedicationDashboard intakeHistory={intakeHistory} />
          </div>
        );
      case "marketplace":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <PharmacyMarketplace 
              language={language} 
              onAddToCart={handleAddToCart} 
            />
          </div>
        );
      case "tracking":
        return (
          <div className="bg-background min-h-[calc(100vh-4rem)]">
            <OrderTracking 
              orderId="SW-2026-001" 
              language={language} 
              deliveryInfo={deliveryInfo}
            />
          </div>
        );
      case "help":
        return (
          <div className="container mx-auto px-4 py-12 space-y-8 min-h-[calc(100vh-4rem)]">
            <h1 className="text-4xl font-bold font-display text-primary">{t.helpMentorGuide}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2rem] border-none shadow-xl">
                <CardHeader>
                  <CardTitle>{t.howToUseSwasthify}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{t.helpDashboard}</p>
                  <p>{t.helpGoals}</p>
                  <p>{t.helpRecords}</p>
                  <p>{t.helpPharmacy}</p>
                  <p>{t.helpTelemedicine}</p>
                </CardContent>
              </Card>
              <Card className="rounded-[2rem] border-none shadow-xl">
                <CardHeader>
                  <CardTitle>{t.mentorSupport}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{t.mentorSupportDesc}</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t.mentorSupportList1}</li>
                    <li>{t.mentorSupportList2}</li>
                    <li>{t.mentorSupportList3}</li>
                    <li>{t.mentorSupportList4}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return <Hero onStart={() => setCurrentView("dashboard")} language={language} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300" id="app-root">
        <Navbar 
          onNavigate={setCurrentView} 
          currentView={currentView}
          theme={theme}
          onToggleTheme={toggleTheme}
          language={language}
          onLanguageChange={handleLanguageChange}
          user={user}
          onSignIn={setUser}
          onSignOut={handleSignOut}
          cartCount={cart.length}
          notifications={notifications}
          onClearNotification={clearNotification}
        />

        {/* Notifications Overlay */}
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] space-y-2 pointer-events-none">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto ${
                  n.type === 'warning' ? 'bg-red-500 text-white' : 'bg-primary text-white'
                }`}
              >
                {n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                <span className="font-medium">{n.message}</span>
                <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}>
                  <X className="w-4 h-4 opacity-50 hover:opacity-100" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Modal / Checkout Simulation */}
        <AnimatePresence>
          {currentView === "cart" && (
            <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg glass-card rounded-[2.5rem] p-8 shadow-2xl border-none"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    {t.pharmacyCart}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentView("dashboard")}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                  {cart.length === 0 ? (
                    <p className="text-center py-12 text-muted-foreground">{t.cartEmpty}</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-xl">
                            <Pill className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold">{item.medicine.name}</p>
                            <p className="text-[10px] text-muted-foreground">{t.partnerShops}: {item.shop.name}</p>
                            <p className="text-xs font-bold text-primary">₹{item.shop.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-primary/10">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>{t.total}</span>
                      <span>₹{cart.reduce((acc, curr) => acc + curr.shop.price, 0).toFixed(2)}</span>
                    </div>
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" onClick={() => {
                      setShowPayment(true);
                    }}>
                      {t.proceedToCheckout}
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Payment Gateway Integration */}
        {showPayment && (
          <PaymentGateway 
            amount={cart.reduce((acc, curr) => acc + curr.shop.price, 0)}
            language={language}
            onSuccess={(info) => {
              setDeliveryInfo(info);
              addNotification(t.orderPlaced, "info");
              setCart([]);
              setShowPayment(false);
              setCurrentView("tracking");
            }}
            onCancel={() => setShowPayment(false)}
          />
        )}
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="fixed top-20 right-6 z-[60] flex flex-col gap-4">
          <Chatbot language={language} />
          <SOSButton language={language} />
        </div>

        <footer className="bg-slate-900 text-white py-16" id="main-footer">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <Plus className="w-10 h-10 text-secondary absolute" strokeWidth={3} />
                    <Leaf className="w-6 h-6 text-primary absolute -bottom-1 -left-1 rotate-12" fill="currentColor" />
                    <User className="w-4 h-4 text-white absolute z-10" fill="currentColor" />
                  </div>
                  <span className="text-xl font-bold font-display text-primary">Swasthify</span>
                </div>
                <p className="text-muted-foreground max-w-sm leading-relaxed">
                  {t.footerDesc}
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">{t.platform}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button onClick={() => setCurrentView("dashboard")} className="hover:text-primary transition-colors">{t.dashboard}</button></li>
                  <li><button onClick={() => setCurrentView("nutrition")} className="hover:text-primary transition-colors">Nutrition Planner</button></li>
                  <li><button onClick={() => setCurrentView("telemedicine")} className="hover:text-primary transition-colors">{t.telemedicine}</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">{t.support}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">{t.helpCenter}</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">{t.privacyPolicy}</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">{t.termsOfService}</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2026 Swasthify. {t.rights}
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
