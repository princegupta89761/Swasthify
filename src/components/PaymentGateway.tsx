import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  Lock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { translations } from "@/lib/translations";

interface PaymentGatewayProps {
  amount: number;
  onSuccess: (info: { name: string; phone: string; address: string }) => void;
  onCancel: () => void;
  language?: string;
}

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function PaymentGateway({ amount, onSuccess, onCancel, language = "en" }: PaymentGatewayProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", phone: "", address: "" });
  const t = translations[language] || translations.en;

  const handlePayment = () => {
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert(t.fillDeliveryInfo);
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(deliveryInfo);
      }, 2000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card rounded-[2.5rem] p-12 text-center shadow-2xl border-none"
        >
          <div className="bg-emerald-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{t.paymentSuccess}</h3>
          <p className="text-muted-foreground">{t.orderProcessed}</p>
          <div className="mt-8 p-4 bg-emerald-500/10 rounded-2xl">
            <p className="text-sm font-bold text-emerald-600">{t.transactionId}: TXN982347123</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border-none"
      >
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">{t.secureCheckout}</h3>
              <p className="text-[10px] opacity-80">{t.sslEncrypted}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onCancel}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{t.amountToPay}</p>
              <p className="text-4xl font-bold text-primary">₹{amount.toFixed(2)}</p>
            </div>
            <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-primary/10 text-primary border-none">
              {t.orderId} #SW-2026-001
            </Badge>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold ml-1">{t.deliveryInformation}</p>
            <div className="grid grid-cols-1 gap-3">
              <Input 
                placeholder={t.fullName} 
                className="h-12 rounded-xl bg-secondary/20 border-none"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
              />
              <Input 
                placeholder={t.phone} 
                className="h-12 rounded-xl bg-secondary/20 border-none"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
              />
              <Input 
                placeholder={t.deliveryAddress} 
                className="h-12 rounded-xl bg-secondary/20 border-none"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold ml-1">{t.paymentMethod}</p>
            <div className="grid grid-cols-1 gap-3">
              {/* UPI Options */}
              <button 
                onClick={() => setMethod('upi')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  method === 'upi' ? 'border-primary bg-primary/5' : 'border-secondary/20 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${method === 'upi' ? 'bg-primary text-white' : 'bg-secondary/20 text-muted-foreground'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t.upiWallets}</p>
                    <p className="text-[10px] text-muted-foreground">{t.gpayPhonepePaytm}</p>
                  </div>
                </div>
                {method === 'upi' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>

              {/* Card Options */}
              <button 
                onClick={() => setMethod('card')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  method === 'card' ? 'border-primary bg-primary/5' : 'border-secondary/20 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${method === 'card' ? 'bg-primary text-white' : 'bg-secondary/20 text-muted-foreground'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t.creditDebitCard}</p>
                    <p className="text-[10px] text-muted-foreground">{t.visaMastercardRupay}</p>
                  </div>
                </div>
                {method === 'card' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>

              {/* COD Options */}
              <button 
                onClick={() => setMethod('cod')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  method === 'cod' ? 'border-primary bg-primary/5' : 'border-secondary/20 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${method === 'cod' ? 'bg-primary text-white' : 'bg-secondary/20 text-muted-foreground'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t.cashOnDelivery}</p>
                    <p className="text-[10px] text-muted-foreground">{t.payWhenReceive}</p>
                  </div>
                </div>
                {method === 'cod' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {method === 'upi' && (
              <motion.div 
                key="upi-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground ml-1">{t.enterUpiId}</label>
                  <Input 
                    placeholder="username@okaxis" 
                    className="h-12 rounded-xl bg-secondary/20 border-none"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="bg-secondary/20 p-2 rounded-lg flex items-center gap-2 grayscale opacity-50">
                    <img src="https://www.vectorlogo.zone/logos/google_pay/google_pay-icon.svg" className="w-6 h-6" referrerPolicy="no-referrer" />
                  </div>
                  <div className="bg-secondary/20 p-2 rounded-lg flex items-center gap-2 grayscale opacity-50">
                    <img src="https://www.vectorlogo.zone/logos/phonepe/phonepe-icon.svg" className="w-6 h-6" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'card' && (
              <motion.div 
                key="card-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground ml-1">{t.cardNumber}</label>
                  <div className="relative">
                    <Input 
                      placeholder="0000 0000 0000 0000" 
                      className="h-12 rounded-xl bg-secondary/20 border-none pl-12"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground ml-1">{t.expiryDate}</label>
                    <Input 
                      placeholder="MM/YY" 
                      className="h-12 rounded-xl bg-secondary/20 border-none"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground ml-1">{t.cvv}</label>
                    <div className="relative">
                      <Input 
                        placeholder="***" 
                        type="password"
                        maxLength={3}
                        className="h-12 rounded-xl bg-secondary/20 border-none pl-12"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 space-y-4">
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
              disabled={isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                  {t.processing}
                </>
              ) : (
                <>
                  {t.pay} ₹{amount.toFixed(2)}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              {t.paymentSafeEncrypted}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
