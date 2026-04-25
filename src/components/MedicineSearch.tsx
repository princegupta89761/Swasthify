import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pill, AlertCircle, Loader2, Info, CheckCircle2, XCircle, ListChecks, Activity, Droplets, Zap, Store, ShoppingCart } from "lucide-react";
import { ai } from "@/services/gemini";
import ReactMarkdown from "react-markdown";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "motion/react";
import { medicineDatabase, Medicine, MedicineShop } from "@/services/medicineData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MedicineSearch({ language, onAddToCart }: { language: string; onAddToCart: (medicine: Medicine, shop?: MedicineShop) => void }) {
  const t = translations[language] || translations.en;
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  const handleSearch = async (medicineName?: string) => {
    const searchName = medicineName || query;
    if (!searchName.trim()) return;
    
    // Check if it's in our local database first
    const localMed = medicineDatabase.find(m => m.name.toLowerCase().includes(searchName.toLowerCase()));
    if (localMed) {
      setSelectedMed(localMed);
      setInfo(null);
      setQuery(searchName);
      return;
    }

    setIsLoading(true);
    setSelectedMed(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide detailed medical information about the medicine: ${searchName}. 
        Include: 
        1. Features (Chemical composition, class)
        2. Uses (What it treats)
        3. Advantages (Benefits)
        4. Disadvantages (Side effects, risks)
        5. Dosage and Precautions. 
        Respond in ${language} language. 
        Format each section clearly so it can be parsed. Use headers like # Features, # Uses, # Advantages, # Disadvantages, # Dosage.
        Add a disclaimer that this is for informational purposes only.`
      });
      
      setInfo(response.text || "Could not find information for this medicine.");
      setQuery(searchName);
    } catch (error) {
      console.error("Medicine search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSection = (content: string, title: string) => {
    const regex = new RegExp(`# ${title}([\\s\\S]*?)(?=# |$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  const categorizedMedicines = {
    tablet: medicineDatabase.filter(m => m.type === 'tablet'),
    syrup: medicineDatabase.filter(m => m.type === 'syrup'),
    powder: medicineDatabase.filter(m => m.type === 'powder'),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" id="medicine-search-view">
      <div className="text-center mb-12">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Pill className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold font-display mb-4">Pharma Guide & Search</h2>
        <p className="text-muted-foreground">Explore our medicine database or search for specific details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-none rounded-[2.5rem] p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              {t.quickSearch}
            </h3>
            <div className="flex flex-col gap-3">
              <Input 
                placeholder={t.medicinePlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 rounded-2xl bg-secondary/20 border-none"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={() => handleSearch()} className="rounded-2xl h-12 font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.search}
              </Button>
            </div>
          </Card>

          <Card className="glass-card border-none rounded-[2.5rem] p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              Categories
            </h3>
            <Tabs defaultValue="tablet" className="w-full">
              <TabsList className="grid grid-cols-3 gap-2 bg-secondary/20 p-1 rounded-2xl h-12">
                <TabsTrigger value="tablet" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Tablets</TabsTrigger>
                <TabsTrigger value="syrup" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Syrups</TabsTrigger>
                <TabsTrigger value="powder" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Powders</TabsTrigger>
              </TabsList>
              
              {(['tablet', 'syrup', 'powder'] as const).map((type) => (
                <TabsContent key={type} value={type} className="mt-4 space-y-2">
                  {categorizedMedicines[type].map((med) => (
                    <Button 
                      key={med.id} 
                      variant="ghost" 
                      className="w-full justify-start rounded-xl hover:bg-primary/10 text-sm py-6 h-auto"
                      onClick={() => handleSearch(med.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          {type === 'tablet' ? <Pill className="w-4 h-4 text-primary" /> : type === 'syrup' ? <Droplets className="w-4 h-4 text-primary" /> : <Zap className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{med.name}</p>
                          <p className="text-[10px] text-muted-foreground">{med.disease}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {(selectedMed || info) ? (
              <motion.div
                key={selectedMed ? selectedMed.id : 'ai-info'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary p-3 rounded-2xl">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{selectedMed ? selectedMed.name : query}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedMed ? `${selectedMed.type} for ${selectedMed.disease}` : 'AI Generated Medical Profile'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {selectedMed ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-secondary/20 rounded-2xl">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Composition</h4>
                            <p className="font-medium">{selectedMed.composition}</p>
                          </div>
                          <div className="p-4 bg-secondary/20 rounded-2xl">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Dosage</h4>
                            <p className="font-medium">{selectedMed.dosage}</p>
                          </div>
                        </div>
                        
                        <Accordion className="w-full space-y-4">
                          <AccordionItem value="uses" className="border-none bg-secondary/10 rounded-3xl px-6">
                            <AccordionTrigger className="hover:no-underline py-6">
                              <span className="text-lg font-bold">Uses & Benefits</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-muted-foreground">
                              {selectedMed.disease} treatment and management.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="sideEffects" className="border-none bg-secondary/10 rounded-3xl px-6">
                            <AccordionTrigger className="hover:no-underline py-6">
                              <span className="text-lg font-bold">Side Effects</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-muted-foreground">
                              {selectedMed.sideEffects}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="p-6 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-3xl flex gap-4">
                          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                          <p className="text-sm text-amber-700 dark:text-amber-400 italic">
                            Disclaimer: This information is for educational purposes. Always consult a doctor before starting any medication.
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-primary/10">
                          <h4 className="font-bold flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" />
                            Available at Partner Shops
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedMed.shops.map((shop, idx) => (
                              <div key={idx} className="p-4 bg-secondary/10 rounded-2xl flex justify-between items-center group hover:bg-secondary/20 transition-colors">
                                <div>
                                  <p className="font-bold text-sm">{shop.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{shop.deliveryTime}</p>
                                  <p className="text-primary font-bold mt-1">₹{shop.price.toFixed(2)}</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="rounded-xl h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => onAddToCart(selectedMed, shop)}
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Buy
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Accordion className="w-full space-y-4">
                          {[
                            { id: "features", title: t.features, icon: ListChecks, color: "text-blue-500" },
                            { id: "uses", title: t.uses, icon: Pill, color: "text-violet-500" },
                            { id: "advantages", title: t.advantages, icon: CheckCircle2, color: "text-emerald-500" },
                            { id: "disadvantages", title: t.disadvantages, icon: XCircle, color: "text-red-500" },
                            { id: "dosage", title: t.dosage, icon: Activity, color: "text-amber-500" },
                          ].map((section) => {
                            const content = getSection(info!, section.title) || getSection(info!, section.id);
                            if (!content) return null;
                            return (
                              <AccordionItem key={section.id} value={section.id} className="border-none bg-secondary/10 rounded-3xl px-6">
                                <AccordionTrigger className="hover:no-underline py-6">
                                  <div className="flex items-center gap-4">
                                    <div className={`${section.color} bg-current/10 p-2 rounded-xl`}>
                                      <section.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg font-bold">{section.title}</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                  <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                        <div className="p-6 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-3xl flex gap-4">
                          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                          <div className="text-sm text-amber-700 dark:text-amber-400 italic">
                            <ReactMarkdown>{getSection(info!, "Disclaimer") || info!.split("Disclaimer")[1] || "Informational purposes only."}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-secondary/5 rounded-[2.5rem] border-2 border-dashed border-primary/10">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                  <Search className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t.searchResults}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t.noProductsFoundDesc}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
