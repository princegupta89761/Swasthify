import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Truck, CheckCircle2, Package, Clock, Phone, User, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { translations } from "@/lib/translations";

export default function OrderTracking({ 
  orderId, 
  language = "en", 
  deliveryInfo 
}: { 
  orderId: string; 
  language?: string; 
  deliveryInfo?: { name: string; phone: string; address: string } | null 
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Order Confirmed");
  const t = translations[language] || translations.en;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) setStatus(t.confirmed);
    else if (progress < 50) setStatus(t.packed);
    else if (progress < 75) setStatus(t.onWay);
    else setStatus(t.arrived);
  }, [progress, t]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display mb-2">{t.trackYourOrder}</h2>
        <p className="text-muted-foreground">{t.orderId}: {orderId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Map Simulation */}
          <Card className="glass-card border-none rounded-[2.5rem] h-[400px] relative overflow-hidden bg-secondary/10">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i14!2i8343!3i5465!2m3!1e0!2sm!3i420120488!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-cover" />
            
            {/* Delivery Path Simulation */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 100 300 Q 200 100 400 250 T 600 150"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="10 10"
                className="text-primary/30"
              />
              <motion.circle
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: `${progress}%` }}
                style={{ offsetPath: "path('M 100 300 Q 200 100 400 250 T 600 150')" }}
                r="8"
                className="fill-primary shadow-xl"
              />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/20">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                <p className="font-bold text-sm">{status}</p>
                <p className="text-[10px] text-muted-foreground">{t.liveGpsTracking}</p>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">{t.currentLocation}</p>
                  <p className="text-xs font-bold">{deliveryInfo?.address || "Sector 42, Health City"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">{t.estimatedArrival}</p>
                <p className="text-xs font-bold text-primary">12 {t.mins}</p>
              </div>
            </div>
          </Card>

          {/* Delivery Steps */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: CheckCircle2, label: t.confirmed, active: progress >= 0 },
              { icon: Package, label: t.packed, active: progress >= 25 },
              { icon: Truck, label: t.onWay, active: progress >= 50 },
              { icon: MapPin, label: t.arrived, active: progress >= 100 },
            ].map((step, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  step.active ? 'bg-primary text-white' : 'bg-secondary/20 text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <p className={`text-[10px] font-bold ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none rounded-[2.5rem] p-6 shadow-xl">
            <h3 className="font-bold mb-4">{t.deliveryInformation}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/30 p-2 rounded-xl">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.fullName}</p>
                  <p className="text-sm font-bold">{deliveryInfo?.name || "Guest User"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/30 p-2 rounded-xl">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.phone}</p>
                  <p className="text-sm font-bold">{deliveryInfo?.phone || "+91 98765 43210"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/30 p-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.deliveryAddress}</p>
                  <p className="text-sm font-bold">{deliveryInfo?.address || "123 Medical Drive, Health City"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-none rounded-[2.5rem] p-6 shadow-xl">
            <h3 className="font-bold mb-4">{t.deliveryPartner}</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 overflow-hidden">
                <img src="https://picsum.photos/seed/delivery/100/100" alt="Delivery Partner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold">Rajesh Kumar</p>
                <div className="flex items-center gap-1 text-amber-500">
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold">{t.verifiedPartner}</span>
                </div>
              </div>
            </div>
            <Button className="w-full rounded-xl gap-2 h-12">
              <Phone className="w-4 h-4" /> {t.callPartner}
            </Button>
          </Card>

          <Card className="glass-card border-none rounded-[2.5rem] p-6 shadow-xl">
            <h3 className="font-bold mb-4">{t.orderSummary}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.itemsTotal}</span>
                <span className="font-bold">₹850.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.deliveryFee}</span>
                <span className="font-bold text-emerald-500">{t.free}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-secondary/30 flex justify-between">
                <span className="font-bold">{t.totalAmount}</span>
                <span className="font-bold text-primary text-lg">₹850.00</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
