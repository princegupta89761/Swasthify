import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Search, 
  Store, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Filter,
  ArrowRight,
  Star,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { medicineDatabase, Medicine, MedicineShop } from "@/services/medicineData";
import { translations } from "@/lib/translations";

interface PharmacyMarketplaceProps {
  language: string;
  onAddToCart: (medicine: Medicine, shop: MedicineShop) => void;
}

export default function PharmacyMarketplace({ language, onAddToCart }: PharmacyMarketplaceProps) {
  const t = translations[language] || translations.en;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedShop, setSelectedShop] = useState<string>("All");

  const categories: { id: Medicine['category']; label: string }[] = [
    { id: "Prescription", label: t.catPrescription },
    { id: "OTC", label: t.catOTC },
    { id: "First-Aid", label: t.catFirstAid },
    { id: "Personal Care", label: t.catPersonalCare },
    { id: "Medical Devices", label: t.catMedicalDevices },
    { id: "Baby Care", label: t.catBabyCare },
    { id: "Supplements", label: t.catSupplements },
    { id: "Wellness", label: t.catWellness }
  ];
  const shops = ["All", "Zeno Health", "Wellness Forever", "Apollo Pharmacy", "Netmeds", "PharmEasy"];

  const filteredMedicines = medicineDatabase.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         med.disease.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    const matchesShop = selectedShop === "All" || med.shops.some(s => s.name === selectedShop);
    
    return matchesSearch && matchesCategory && matchesShop;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" id="pharmacy-marketplace">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold font-display mb-2">{t.pharmacyMarketplace}</h2>
          <p className="text-muted-foreground">{t.pharmacyMarketplaceDesc}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
            <Tag className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">{medicineDatabase.length} {t.productsAvailable}</span>
          </div>
          <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
            <Store className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-emerald-500">{shops.length - 1} {t.partnerShops}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-none rounded-[2.5rem] p-6 sticky top-24 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  {t.search}
                </h3>
                <Input 
                  placeholder={t.searchProducts} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl bg-secondary/20 border-none h-12"
                />
              </div>

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  {t.allCategories}
                </h3>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl justify-start h-10"
                    onClick={() => setSelectedCategory("All")}
                  >
                    {t.allCategories}
                  </Button>
                  {categories.map(cat => (
                    <Button 
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl justify-start h-10"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  {t.partnerShops}
                </h3>
                <select 
                  className="w-full h-12 rounded-xl bg-secondary/20 border-none text-sm px-3 focus:ring-2 focus:ring-primary/20"
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                >
                  {shops.map(shop => (
                    <option key={shop} value={shop}>{shop === "All" ? t.shopAll : shop}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMedicines.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={med.image} 
                        alt={med.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-none capitalize">
                          {med.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{med.name}</h3>
                        <p className="text-white/70 text-[10px] line-clamp-1">{med.disease}</p>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] text-muted-foreground ml-1">4.5</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <Tag className="w-3 h-3" />
                            <span className="text-xs">{t.fromPrice} ₹{Math.min(...med.shops.map(s => s.price)).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t.availableAt}</p>
                          <div className="space-y-2">
                            {med.shops.map((shop, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center justify-between p-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors group/shop"
                              >
                                <div className="flex items-center gap-2">
                                  <Store className="w-3 h-3 text-primary" />
                                  <div>
                                    <p className="text-[10px] font-bold">{shop.name}</p>
                                    <p className="text-[8px] text-muted-foreground">{shop.deliveryTime}</p>
                                  </div>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <p className="font-bold text-xs text-primary">₹{shop.price.toFixed(2)}</p>
                                  <Button 
                                    size="icon" 
                                    className="h-7 w-7 rounded-lg opacity-0 group-hover/shop:opacity-100 transition-opacity"
                                    onClick={() => onAddToCart(med, shop)}
                                  >
                                    <ShoppingCart className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-24 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.noProductsFound}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t.noProductsFoundDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
