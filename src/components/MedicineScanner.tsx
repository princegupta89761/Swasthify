import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ShoppingCart, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Activity,
  X,
  Plus,
  Store
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getMedicineByQR, Medicine, MedicineShop } from "@/services/medicineData";
import { translations } from "@/lib/translations";

interface MedicineScannerProps {
  language: string;
  onMarkTaken: (medicine: Medicine) => void;
  onAddToCart: (medicine: Medicine, shop?: MedicineShop) => void;
}

export default function MedicineScanner({ language, onMarkTaken, onAddToCart }: MedicineScannerProps) {
  const t = translations[language] || translations.en;
  const [scannedMedicine, setScannedMedicine] = useState<Medicine | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          const med = getMedicineByQR(decodedText);
          if (med) {
            setScannedMedicine(med);
            setIsScanning(false);
            if (scannerRef.current) {
              scannerRef.current.clear();
              scannerRef.current = null;
            }
          } else {
            setError("Medicine not found in database. Try scanning TAB001, SYR001, or PWD001.");
          }
        },
        (err) => {
          // Silent error for scanning
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const handleManualSearch = (id: string) => {
    const med = getMedicineByQR(id);
    if (med) {
      setScannedMedicine(med);
      setIsScanning(false);
      setError(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" id="medicine-scanner-view">
      <div className="text-center mb-12">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold font-display mb-4">{t.smartMedicineScanner}</h2>
        <p className="text-muted-foreground">{t.smartMedicineScannerDesc}</p>
      </div>

      {!isScanning && !scannedMedicine && (
        <Card className="glass-card border-none rounded-[2.5rem] p-12 text-center">
          <div className="space-y-6">
            <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t.readyToScan}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t.readyToScanDesc}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-2xl h-14 px-8 font-bold" onClick={() => setIsScanning(true)}>
                <Camera className="mr-2 w-5 h-5" />
                {t.startCameraScanner}
              </Button>
              <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-bold" onClick={() => handleManualSearch("TAB001")}>
                {t.demoScan} (TAB001)
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {isScanning && (
        <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-primary text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {t.scanning}
            </h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsScanning(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="p-8">
            <div id="qr-reader" className="rounded-2xl overflow-hidden border-2 border-dashed border-primary/20" />
            <p className="text-center mt-6 text-sm text-muted-foreground italic">
              {t.scanAutomatically}
            </p>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {scannedMedicine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <QrCode className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-white border-white/30 mb-2 uppercase tracking-widest text-[10px]">
                        {scannedMedicine.type}
                      </Badge>
                      <CardTitle className="text-3xl font-display">{scannedMedicine.name}</CardTitle>
                      <p className="text-white/70 font-medium">{scannedMedicine.disease}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Price</p>
                    <p className="text-3xl font-bold">₹{scannedMedicine.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t.composition}
                      </h4>
                      <p className="text-lg font-medium">{scannedMedicine.composition}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t.dosageInstructions}
                      </h4>
                      <p className="text-lg font-medium">{scannedMedicine.dosage}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {t.sideEffects}
                      </h4>
                      <p className="text-muted-foreground">{scannedMedicine.sideEffects}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {scannedMedicine.expiryDate && (
                      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-amber-500" />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-amber-600">{t.expiryDate}</p>
                          <p className="font-bold text-amber-700">{scannedMedicine.expiryDate}</p>
                        </div>
                      </div>
                    )}

                    {scannedMedicine.isSupplement && scannedMedicine.nutrition && (
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-4">
                        <h4 className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          {t.nutritionalValues}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                            <p className="text-[10px] text-muted-foreground uppercase">Calories</p>
                            <p className="text-xl font-bold">{scannedMedicine.nutrition.calories} kcal</p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                            <p className="text-[10px] text-muted-foreground uppercase">Protein</p>
                            <p className="text-xl font-bold">{scannedMedicine.nutrition.protein}g</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {scannedMedicine.nutrition.vitamins.map(v => (
                            <Badge key={v} variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              Vit {v}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                      <Button size="lg" className="rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20" onClick={() => {
                        onMarkTaken(scannedMedicine);
                        setScannedMedicine(null);
                      }}>
                        <CheckCircle2 className="mr-2 w-6 h-6" />
                        {t.markAsTaken}
                      </Button>
                      
                      <div className="space-y-2 mt-4">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-2">{t.availableAt}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {scannedMedicine.shops.map((shop, idx) => (
                            <Button 
                              key={idx}
                              variant="outline" 
                              className="h-auto py-3 px-4 rounded-2xl justify-between group hover:border-primary/50"
                              onClick={() => {
                                onAddToCart(scannedMedicine, shop);
                                setScannedMedicine(null);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Store className="w-4 h-4 text-primary" />
                                <div className="text-left">
                                  <p className="text-sm font-bold">{shop.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{shop.deliveryTime}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">₹{shop.price.toFixed(2)}</span>
                                <ShoppingCart className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button variant="ghost" className="rounded-2xl mt-2" onClick={() => setScannedMedicine(null)}>
                        {t.scanAnother}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
