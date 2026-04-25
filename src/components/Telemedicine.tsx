import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Calendar, 
  MessageSquare, 
  Star, 
  Clock, 
  Activity, 
  X, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  User, 
  Send, 
  Phone, 
  ShieldAlert,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { translations } from "@/lib/translations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 124,
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=sarah",
    location: "New York, USA"
  },
  {
    name: "Dr. Michael Chen",
    specialty: "General Physician",
    rating: 4.8,
    reviews: 89,
    availability: "Available Tomorrow",
    image: "https://i.pravatar.cc/150?u=michael",
    location: "London, UK"
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Nutritionist",
    rating: 5.0,
    reviews: 56,
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=emily",
    location: "Madrid, Spain"
  },
  {
    name: "Dr. Rajesh Gupta",
    specialty: "Neurologist",
    rating: 4.7,
    reviews: 210,
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=rajesh",
    location: "Mumbai, India"
  },
  {
    name: "Dr. Yuki Tanaka",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 145,
    availability: "Available Tomorrow",
    image: "https://i.pravatar.cc/150?u=yuki",
    location: "Tokyo, Japan"
  },
  {
    name: "Dr. Hans Müller",
    specialty: "Dermatologist",
    rating: 4.8,
    reviews: 92,
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=hans",
    location: "Berlin, Germany"
  }
];

const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

export default function Telemedicine({ language }: { language: string }) {
  const t = translations[language] || translations.en;
  const [activeCall, setActiveCall] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [activeSchedule, setActiveSchedule] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { role: "user", content: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    setChatInput("");
    
    // Simulate doctor response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "doctor", 
        content: "I've received your message. How can I help you further?", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1000);
  };

  const handleBook = () => {
    if (!selectedSlot) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveSchedule(null);
      setSelectedSlot(null);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" id="telemedicine-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">{t.telemedicine}</h2>
          <p className="text-muted-foreground">{t.expertConnectDesc}</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Calendar className="mr-2 h-4 w-4" />
          {t.myAppointments}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="doctors-grid">
        {doctors.map((doctor, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-xl transition-all group glass-card border-none rounded-[2rem]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">({doctor.reviews} {t.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.availability}</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">{t.online}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full rounded-full" onClick={() => {
                  setActiveChat(doctor);
                  setMessages([{ role: "doctor", content: `Hello! I'm ${doctor.name}. How can I help you today?`, time: "10:00 AM" }]);
                }}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t.chat}
                </Button>
                <Button className="w-full rounded-full" onClick={() => setActiveCall(doctor)}>
                  <Video className="mr-2 h-4 w-4" />
                  {t.videoCall}
                </Button>
              </div>
              <Button variant="secondary" className="w-full rounded-full" onClick={() => setActiveSchedule(doctor)}>
                <Calendar className="mr-2 h-4 w-4" />
                {t.scheduleAppointment}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SOS & Emergency Numbers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <Card className="lg:col-span-2 border-2 border-red-500/20 rounded-[2.5rem] bg-background shadow-xl">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-full shadow-lg shadow-red-500/40">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-500">{t.sos}</h3>
                <p className="text-muted-foreground">Need immediate help? Connect with our 24/7 emergency response team.</p>
              </div>
            </div>
            <Button variant="destructive" size="lg" className="rounded-full px-8 h-12 font-bold shadow-xl shadow-red-500/20 animate-pulse">
              {t.callEmergencyNow}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-none rounded-[2.5rem] p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <h3 className="font-bold">{t.emergencyNumbers}</h3>
          </div>
            <div className="space-y-3">
              {[
                { label: t.ambulance, num: "102", icon: Activity },
                { label: t.police, num: "100", icon: ShieldAlert },
                { label: t.fire, num: "101", icon: ShieldAlert },
                { label: t.doctor, num: "108", icon: Phone },
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={`tel:${item.num}`}
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-2xl hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-primary font-bold">{item.num}</span>
                </a>
              ))}
            </div>
        </Card>
      </div>

      {/* Video Call Simulation Modal */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col">
            {/* Header */}
            <div className="p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarImage src={activeCall.image} />
                  <AvatarFallback>{activeCall.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{activeCall.name}</h3>
                  <p className="text-xs text-primary">{t.encryptedVideoCall}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-red-500 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">REC</div>
                <span className="text-sm font-mono">12:45</span>
              </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-grow relative flex items-center justify-center p-4">
              <div className="w-full max-w-5xl aspect-video bg-slate-800 rounded-[3rem] overflow-hidden relative shadow-2xl">
                <img 
                  src={activeCall.image} 
                  alt="Doctor Video" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                      <Video className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-white font-medium">{t.connectingTo} {activeCall.name}...</p>
                  </div>
                </div>

                {/* Self View */}
                <div className="absolute bottom-8 right-8 w-48 aspect-video bg-slate-900 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <User className="w-8 h-8 text-white/20" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <VideoOff className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 rounded text-[10px] text-white">{t.you}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-12 flex justify-center items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className={`w-14 h-14 rounded-full border-2 ${!isMicOn ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="w-20 h-20 rounded-full shadow-2xl shadow-red-500/40"
                onClick={() => setActiveCall(null)}
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`w-14 h-14 rounded-full border-2 ${!isVideoOn ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff />}
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg h-[600px] glass-card rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-none"
            >
              <div className="p-6 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-white/20">
                    <AvatarImage src={activeChat.image} />
                    <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{activeChat.name}</h3>
                    <p className="text-xs text-white/70">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setActiveChat(null)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <ScrollArea className="flex-grow p-6" id="chat-scroll">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                        msg.role === "user" 
                          ? "bg-primary text-white rounded-tr-none" 
                          : "bg-secondary text-secondary-foreground rounded-tl-none"
                      }`}>
                        <p>{msg.content}</p>
                        <span className="text-[10px] opacity-50 mt-1 block">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t bg-background/50">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t.typeMessage} 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="rounded-full h-12 bg-secondary/20 border-none"
                  />
                  <Button size="icon" className="rounded-full w-12 h-12 shrink-0" onClick={handleSendMessage}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scheduling Modal */}
      <AnimatePresence>
        {activeSchedule && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-card rounded-[2.5rem] p-8 shadow-2xl border-none"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{t.scheduleAppointment}</h3>
                  <p className="text-muted-foreground">With {activeSchedule.name}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveSchedule(null)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                    {t.selectSlot}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={`rounded-2xl h-12 font-medium ${selectedSlot === slot ? 'shadow-lg shadow-primary/20' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                  disabled={!selectedSlot || bookingSuccess}
                  onClick={handleBook}
                >
                  {bookingSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      {t.appointmentSuccess}
                    </span>
                  ) : t.bookNow}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
