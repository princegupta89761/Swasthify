export interface MedicineShop {
  name: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock';
  deliveryTime: string;
}

export interface Medicine {
  id: string;
  name: string;
  type: 'tablet' | 'syrup' | 'powder' | 'device' | 'hygiene' | 'baby' | 'wellness' | 'first-aid';
  category: 'Prescription' | 'OTC' | 'First-Aid' | 'Personal Care' | 'Medical Devices' | 'Baby Care' | 'Supplements' | 'Wellness';
  disease: string;
  composition: string;
  dosage: string;
  sideEffects: string;
  expiryDate?: string;
  isSupplement?: boolean;
  nutrition?: {
    calories: number;
    protein: number;
    vitamins: string[];
  };
  price: number;
  image: string;
  shops: MedicineShop[];
}

export const medicineDatabase: Medicine[] = [
  // Prescription Medicines
  {
    id: "PRE001",
    name: "Amoxicillin 250mg",
    type: "tablet",
    category: "Prescription",
    disease: "Bacterial Infections",
    composition: "Amoxicillin Trihydrate",
    dosage: "1 tablet 3 times a day",
    sideEffects: "Diarrhea, rash",
    expiryDate: "2026-06-15",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Zeno Health", price: 115.00, availability: 'In Stock', deliveryTime: '4 hours' },
      { name: "Wellness Forever", price: 120.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "PharmEasy", price: 118.00, availability: 'In Stock', deliveryTime: 'Next Day' }
    ]
  },
  {
    id: "PRE002",
    name: "Metformin 500mg",
    type: "tablet",
    category: "Prescription",
    disease: "Type 2 Diabetes",
    composition: "Metformin Hydrochloride",
    dosage: "1 tablet twice daily with meals",
    sideEffects: "Nausea, stomach upset",
    expiryDate: "2027-03-20",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Apollo Pharmacy", price: 82.00, availability: 'In Stock', deliveryTime: '3 hours' },
      { name: "Wellness Forever", price: 85.00, availability: 'In Stock', deliveryTime: '1 hour' }
    ]
  },

  // OTC Medicines
  {
    id: "OTC001",
    name: "Paracetamol 500mg",
    type: "tablet",
    category: "OTC",
    disease: "Fever, Pain",
    composition: "Paracetamol 500mg",
    dosage: "1 tablet every 6 hours",
    sideEffects: "Nausea, allergic reactions",
    expiryDate: "2027-12-01",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Zeno Health", price: 42.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "Wellness Forever", price: 45.00, availability: 'In Stock', deliveryTime: '1 hour' },
      { name: "Apollo Pharmacy", price: 46.00, availability: 'In Stock', deliveryTime: '3 hours' }
    ]
  },
  {
    id: "OTC002",
    name: "Cetirizine 10mg",
    type: "tablet",
    category: "OTC",
    disease: "Allergies, Hay Fever",
    composition: "Cetirizine Dihydrochloride",
    dosage: "1 tablet daily at bedtime",
    sideEffects: "Drowsiness, dry mouth",
    expiryDate: "2026-09-10",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1550572017-4f1b239c922a?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "PharmEasy", price: 32.00, availability: 'In Stock', deliveryTime: 'Next Day' },
      { name: "Apollo Pharmacy", price: 35.00, availability: 'In Stock', deliveryTime: '2 hours' }
    ]
  },

  // First-Aid Supplies
  {
    id: "FA001",
    name: "Adhesive Bandages (20pk)",
    type: "first-aid",
    category: "First-Aid",
    disease: "Minor Cuts, Scrapes",
    composition: "Sterile fabric, adhesive",
    dosage: "Apply to clean, dry wound",
    sideEffects: "Skin irritation (rare)",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1590611380053-da6447011f45?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Wellness Forever", price: 140.00, availability: 'In Stock', deliveryTime: '1 hour' },
      { name: "Apollo Pharmacy", price: 150.00, availability: 'In Stock', deliveryTime: '3 hours' }
    ]
  },
  {
    id: "FA002",
    name: "Antiseptic Liquid 100ml",
    type: "first-aid",
    category: "First-Aid",
    disease: "Wound Disinfection",
    composition: "Chlorhexidine, Cetrimide",
    dosage: "Dilute as directed before use",
    sideEffects: "Stinging sensation",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Zeno Health", price: 90.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "Netmeds", price: 88.00, availability: 'In Stock', deliveryTime: '2 Days' }
    ]
  },

  // Personal Care
  {
    id: "PC001",
    name: "Hand Sanitizer 500ml",
    type: "hygiene",
    category: "Personal Care",
    disease: "Germ Protection",
    composition: "70% Isopropyl Alcohol",
    dosage: "Apply small amount to palms",
    sideEffects: "Dry skin",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Wellness Forever", price: 240.00, availability: 'In Stock', deliveryTime: '1 hour' },
      { name: "PharmEasy", price: 230.00, availability: 'In Stock', deliveryTime: 'Next Day' }
    ]
  },
  {
    id: "PC002",
    name: "N95 Face Masks (5pk)",
    type: "hygiene",
    category: "Personal Care",
    disease: "Respiratory Protection",
    composition: "Multi-layer non-woven fabric",
    dosage: "Wear over nose and mouth",
    sideEffects: "Breathing resistance",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1586942593568-293a1adcd52c?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Apollo Pharmacy", price: 420.00, availability: 'In Stock', deliveryTime: '3 hours' },
      { name: "Zeno Health", price: 400.00, availability: 'In Stock', deliveryTime: '2 hours' }
    ]
  },

  // Medical Devices
  {
    id: "DEV001",
    name: "Digital BP Monitor",
    type: "device",
    category: "Medical Devices",
    disease: "Hypertension Monitoring",
    composition: "Electronic sensor, cuff",
    dosage: "Use as directed by physician",
    sideEffects: "None",
    price: 2450.00,
    image: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Apollo Pharmacy", price: 2300.00, availability: 'In Stock', deliveryTime: '3 hours' },
      { name: "Wellness Forever", price: 2450.00, availability: 'In Stock', deliveryTime: '1 hour' }
    ]
  },
  {
    id: "DEV002",
    name: "Pulse Oximeter",
    type: "device",
    category: "Medical Devices",
    disease: "Oxygen Saturation Check",
    composition: "Infrared sensor",
    dosage: "Clip on finger for 30 seconds",
    sideEffects: "None",
    price: 1200.00,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Netmeds", price: 1100.00, availability: 'In Stock', deliveryTime: '2 Days' },
      { name: "PharmEasy", price: 1150.00, availability: 'In Stock', deliveryTime: 'Next Day' }
    ]
  },

  // Baby Care
  {
    id: "BABY001",
    name: "Baby Diapers (Large, 50pk)",
    type: "baby",
    category: "Baby Care",
    disease: "Infant Hygiene",
    composition: "Absorbent polymer, cotton",
    dosage: "Change every 4-6 hours",
    sideEffects: "Diaper rash (if not changed)",
    price: 850.00,
    image: "https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Wellness Forever", price: 800.00, availability: 'In Stock', deliveryTime: '1 hour' },
      { name: "Apollo Pharmacy", price: 850.00, availability: 'In Stock', deliveryTime: '3 hours' }
    ]
  },

  // Supplements
  {
    id: "SUP001",
    name: "Multivitamin Gold",
    type: "tablet",
    category: "Supplements",
    disease: "General Wellness",
    composition: "Vitamin A, B, C, D, E, Zinc",
    dosage: "1 tablet daily after breakfast",
    sideEffects: "None reported",
    isSupplement: true,
    nutrition: {
      calories: 5,
      protein: 0,
      vitamins: ["A", "B12", "C", "D3", "E"]
    },
    price: 650.00,
    image: "https://images.unsplash.com/photo-1550572017-4f1b239c922a?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Wellness Forever", price: 620.00, availability: 'In Stock', deliveryTime: '1 hour' },
      { name: "Netmeds", price: 600.00, availability: 'In Stock', deliveryTime: '2 Days' }
    ]
  },
  {
    id: "SUP002",
    name: "Whey Protein Pro",
    type: "powder",
    category: "Supplements",
    disease: "Muscle Recovery",
    composition: "Whey Protein Isolate",
    dosage: "1 scoop (30g) with water/milk",
    sideEffects: "Bloating in some cases",
    isSupplement: true,
    nutrition: {
      calories: 120,
      protein: 25,
      vitamins: ["B6", "Calcium"]
    },
    price: 3500.00,
    image: "https://images.unsplash.com/photo-1593094855826-008c8e4fc294?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Wellness Forever", price: 3400.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "Netmeds", price: 3200.00, availability: 'In Stock', deliveryTime: '3 Days' }
    ]
  },

  // Wellness
  {
    id: "WELL001",
    name: "Pain Relief Ointment",
    type: "wellness",
    category: "Wellness",
    disease: "Muscle & Joint Pain",
    composition: "Diclofenac, Menthol",
    dosage: "Apply to affected area 3 times daily",
    sideEffects: "Local skin irritation",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Zeno Health", price: 170.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "Apollo Pharmacy", price: 180.00, availability: 'In Stock', deliveryTime: '3 hours' }
    ]
  },
  {
    id: "WELL002",
    name: "ORS Electrolyte",
    type: "powder",
    category: "Wellness",
    disease: "Dehydration",
    composition: "Sodium Chloride, Potassium Chloride, Dextrose",
    dosage: "Dissolve 1 sachet in 1L water",
    sideEffects: "None",
    expiryDate: "2028-05-20",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1616671285410-9a4030616999?auto=format&fit=crop&q=80&w=400",
    shops: [
      { name: "Zeno Health", price: 22.00, availability: 'In Stock', deliveryTime: '2 hours' },
      { name: "Wellness Forever", price: 25.00, availability: 'In Stock', deliveryTime: '1 hour' }
    ]
  }
];

export const getMedicineByQR = (qrData: string): Medicine | undefined => {
  // Simple mapping: QR data expected to be the ID
  return medicineDatabase.find(m => m.id === qrData || m.name.toLowerCase().includes(qrData.toLowerCase()));
};

export const getMedicinesByType = (type: any) => {
  return medicineDatabase.filter(m => m.type === type);
};

export const getMedicinesByCategory = (category: Medicine['category']) => {
  return medicineDatabase.filter(m => m.category === category);
};
