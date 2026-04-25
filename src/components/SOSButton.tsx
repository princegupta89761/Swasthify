import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Phone, MapPin, X, AlertCircle, Plus, Trash2, User, Heart, Smartphone, Siren, Flame, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { translations } from "@/lib/translations";

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export default function SOSButton({ language }: { language: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("emergency_contacts");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Sarah Johnson", relation: "Wife", phone: "+1 234 567 890" },
      { id: "2", name: "Dr. Michael Chen", relation: "Primary Doctor", phone: "+1 987 654 321" }
    ];
  });

  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem("emergency_contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleSOS = () => {
    setIsAlerting(true);
    setTimeout(() => {
      setIsAlerting(false);
      setIsOpen(true);
    }, 2000);
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: "", relation: "", phone: "" });
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSOS}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-colors duration-300 ${
            isAlerting ? 'bg-red-600 animate-ping' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          <ShieldAlert className="text-white w-7 h-7" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-red-500/20 max-h-[90vh] flex flex-col"
            >
              <div className="bg-red-500 p-8 text-center text-white relative shrink-0">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setShowManage(false);
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{t.sos}</h2>
                <p className="text-red-100">Emergency services and contacts have been notified.</p>
              </div>

              <CardContent className="p-8 space-y-6 overflow-y-auto">
                {!showManage ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Siren className="text-red-500 w-5 h-5" />
                        Emergency Services
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        <a href="tel:911" className="flex flex-col items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors">
                          <Phone className="w-5 h-5 text-red-600" />
                          <span className="text-[10px] font-bold">Police</span>
                          <span className="text-xs font-black">911</span>
                        </a>
                        <a href="tel:911" className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 transition-colors">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                          <span className="text-[10px] font-bold">Ambulance</span>
                          <span className="text-xs font-black">911</span>
                        </a>
                        <a href="tel:911" className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 hover:bg-orange-100 transition-colors">
                          <Flame className="w-5 h-5 text-orange-600" />
                          <span className="text-[10px] font-bold">Fire</span>
                          <span className="text-xs font-black">911</span>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <AlertCircle className="text-red-500 w-5 h-5" />
                        Current Status
                      </h3>
                      <div className="bg-secondary/30 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="text-primary w-4 h-4" />
                          <span>123 Medical Drive, Health City</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="text-primary w-4 h-4" />
                          <span>Emergency Dispatch: 911</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{t.emergencyContacts}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowManage(true)}
                          className="text-primary hover:text-primary/80"
                        >
                          {t.manageContacts}
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {contacts.map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                            <div>
                              <p className="font-bold text-sm">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.relation}</p>
                            </div>
                            <a 
                              href={`tel:${contact.phone}`}
                              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsOpen(false)}
                      className="w-full rounded-full py-6 text-lg font-bold bg-red-500 hover:bg-red-600"
                    >
                      I am Safe Now
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{t.manageContacts}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowManage(false)}>
                        Back
                      </Button>
                    </div>

                    <div className="space-y-3 bg-secondary/10 p-4 rounded-2xl">
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder={t.contactName}
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                      <div className="relative">
                        <Heart className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder={t.relationship}
                          value={newContact.relation}
                          onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder={t.phoneNumber}
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                      <Button onClick={addContact} className="w-full rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> {t.addContact}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                          <div>
                            <p className="font-bold text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.relation} • {contact.phone}</p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
