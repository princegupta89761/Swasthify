import { Activity, Heart, User, Menu, X, Sun, Moon, Globe, LogIn, LogOut, Leaf, Plus, MessageSquare, ShieldAlert, HelpCircle, QrCode, LayoutDashboard, ShoppingCart, Store, Bell } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";
import { translations } from "@/lib/translations";

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  user: any;
  onSignIn: (user: any) => void;
  onSignOut: () => void;
  cartCount?: number;
  notifications?: { id: string; message: string; type: 'info' | 'warning' }[];
  onClearNotification?: (id: string) => void;
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
];

export default function Navbar({ 
  onNavigate, 
  currentView, 
  theme, 
  onToggleTheme, 
  language, 
  onLanguageChange,
  user,
  onSignIn,
  onSignOut,
  cartCount,
  notifications = [],
  onClearNotification
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const t = translations[language] || translations.en;

  const navItems = [
    { id: "home", label: t.home },
    { id: "dashboard", label: t.dashboard },
    { id: "marketplace", label: "Pharmacy", icon: Store },
    { id: "scanner", label: "Scanner", icon: QrCode },
    { id: "records", label: t.healthRecords },
    { id: "telemedicine", label: t.telemedicine },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md" id="main-nav">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => onNavigate("home")}
              id="logo-container"
            >
              <div className="relative w-12 h-10 flex items-center justify-center">
                {/* Blue Cross */}
                <div className="absolute right-0 w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                   <div className="w-6 h-2 bg-white rounded-full absolute" />
                   <div className="w-2 h-6 bg-white rounded-full absolute" />
                </div>
                {/* Person */}
                <div className="absolute left-4 z-10 flex flex-col items-center">
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-blue-600" />
                  <div className="w-5 h-5 bg-blue-600 rounded-t-full" />
                </div>
                {/* Green Leaf */}
                <div className="absolute left-0 bottom-0 w-8 h-8 text-emerald-500">
                  <Leaf className="w-full h-full fill-current" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-display text-slate-900 dark:text-white leading-none tracking-tighter">Swasthify</span>
                <div className="flex items-center gap-1">
                  <div className="h-[1px] w-4 bg-slate-300" />
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Your Health, Our Priority</span>
                  <div className="h-[1px] w-4 bg-slate-300" />
                </div>
              </div>
            </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4" id="desktop-nav">
            <div className="flex items-center gap-6 mr-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                    currentView === item.id ? "text-primary" : "text-muted-foreground"
                  )}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                  {currentView === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l pl-4">
              {/* AI Assistant Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full gap-2 text-primary hover:bg-primary/10"
                onClick={() => {
                  const chatbotToggle = document.getElementById('chatbot-toggle');
                  if (chatbotToggle) chatbotToggle.click();
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">AI Assistant</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full gap-2 text-red-500 hover:bg-red-50"
                onClick={() => {
                  const sosToggle = document.getElementById('sos-toggle');
                  if (sosToggle) sosToggle.click();
                }}
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden lg:inline">SOS</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative"
                onClick={() => onNavigate("cart")}
              >
                <ShoppingCart className="w-4 h-4" />
                {(cartCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full relative cursor-pointer")}>
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 glass-card border-none p-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    {notifications.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">{notifications.length} New</span>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-8 text-xs text-muted-foreground">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={cn(
                          "p-3 rounded-xl text-xs flex gap-3 group relative",
                          n.type === 'warning' ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-primary/10 text-primary"
                        )}>
                          {n.type === 'warning' ? <ShieldAlert className="w-4 h-4 shrink-0" /> : <Bell className="w-4 h-4 shrink-0" />}
                          <p className="leading-relaxed pr-6">{n.message}</p>
                          <button 
                            onClick={() => onClearNotification?.(n.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => onNavigate("help")}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 rounded-full cursor-pointer")}>
                    <Globe className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold">{currentLang.code}</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 glass-card border-none">
                  {languages.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code} 
                      onClick={() => onLanguageChange(lang.code)}
                      className="gap-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={onToggleTheme} className="rounded-full">
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              {/* User Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full gap-2 cursor-pointer border-primary/20 hover:bg-primary/5")}>
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-bold max-w-[100px] truncate">
                        {user.displayName || user.name || user.email?.split('@')[0] || "User"}
                      </span>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-card border-none p-2">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1">
                      {user.email}
                    </div>
                    <DropdownMenuItem onClick={onSignOut} className="text-destructive rounded-xl focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="font-bold">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full px-4 font-bold"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    {t.signIn}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="rounded-full px-6 gap-2 font-bold shadow-lg shadow-primary/20"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    {t.signUp}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onToggleTheme} className="rounded-full">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <button 
              className="p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              id="mobile-menu-toggle"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top duration-200" id="mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm font-medium rounded-md",
                  currentView === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
                id={`mobile-nav-item-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full rounded-full gap-2 cursor-pointer")}>
                    <Globe className="w-4 h-4" />
                    {currentLang.label}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 glass-card border-none">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => onLanguageChange(lang.code)}>
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {user ? (
                <Button variant="outline" className="w-full rounded-full gap-2" onClick={onSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button className="w-full rounded-full gap-2" onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn className="w-4 h-4" />
                  {t.signIn}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
        onSignIn={onSignIn}
      />
    </>
  );
}


