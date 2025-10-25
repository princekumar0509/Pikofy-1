// lib/expense-categories.js
import {
  Coffee,
  ShoppingBag,
  Utensils,
  Plane,
  Car,
  Home,
  Film,
  ShoppingCart,
  Ticket,
  Wifi,
  Droplets,
  GraduationCap,
  Heart,
  Stethoscope,
  Gift,
  Smartphone,
  MoreHorizontal,
  CreditCard,
  Baby,
  Music,
  Book,
  DollarSign,
} from "lucide-react";

// Object containing all categories with their respective icons
export const EXPENSE_CATEGORIES = {
  foodDrink: {
    id: "foodDrink",
    name: "Food & Drink",
    icon: Utensils,
  },
  coffee: {
    id: "coffee",
    name: "Coffee",
    icon: Coffee,
  },
  groceries: {
    id: "groceries",
    name: "Groceries",
    icon: ShoppingCart,
  },
  shopping: {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
  },
  travel: {
    id: "travel",
    name: "Travel",
    icon: Plane,
  },
  transportation: {
    id: "transportation",
    name: "Transportation",
    icon: Car,
  },
  housing: {
    id: "housing",
    name: "Housing",
    icon: Home,
  },
  entertainment: {
    id: "entertainment",
    name: "Entertainment",
    icon: Film,
  },
  tickets: {
    id: "tickets",
    name: "Tickets",
    icon: Ticket,
  },
  utilities: {
    id: "utilities",
    name: "Utilities",
    icon: Wifi,
  },
  water: {
    id: "water",
    name: "Water",
    icon: Droplets,
  },
  education: {
    id: "education",
    name: "Education",
    icon: GraduationCap,
  },
  health: {
    id: "health",
    name: "Health",
    icon: Stethoscope,
  },
  personal: {
    id: "personal",
    name: "Personal",
    icon: Heart,
  },
  gifts: {
    id: "gifts",
    name: "Gifts",
    icon: Gift,
  },
  technology: {
    id: "technology",
    name: "Technology",
    icon: Smartphone,
  },
  bills: {
    id: "bills",
    name: "Bills & Fees",
    icon: CreditCard,
  },
  baby: {
    id: "baby",
    name: "Baby & Kids",
    icon: Baby,
  },
  music: {
    id: "music",
    name: "Music",
    icon: Music,
  },
  books: {
    id: "books",
    name: "Books",
    icon: Book,
  },
  other: {
    id: "other",
    name: "Other",
    icon: MoreHorizontal,
  },
  general: {
    id: "general",
    name: "General Expense",
    icon: DollarSign,
  },
};

// Helper function to get category by ID
export const getCategoryById = (categoryId) => {
  return EXPENSE_CATEGORIES[categoryId] || EXPENSE_CATEGORIES.other;
};

// Get array of all categories (useful for dropdowns)
export const getAllCategories = () => {
  return Object.values(EXPENSE_CATEGORIES);
};

// Get icon for a category
export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.icon;
};

// Auto-suggest category based on description keywords
export const suggestCategoryFromDescription = (description) => {
  if (!description) return null;
  
  const lowerDesc = description.toLowerCase();
  
  // Food & Drink keywords
  if (lowerDesc.match(/\b(lunch|dinner|breakfast|restaurant|meal|food|eat|pizza|burger|sushi|chinese|indian|italian|mexican|thai)\b/)) {
    return "foodDrink";
  }
  
  // Coffee keywords
  if (lowerDesc.match(/\b(coffee|cafe|starbucks|latte|espresso|cappuccino|tea)\b/)) {
    return "coffee";
  }
  
  // Groceries keywords
  if (lowerDesc.match(/\b(grocery|groceries|supermarket|walmart|target|costco|market|vegetables|fruits|milk|bread)\b/)) {
    return "groceries";
  }
  
  // Shopping keywords
  if (lowerDesc.match(/\b(shopping|clothes|clothing|shoes|fashion|mall|store|buy|bought|purchase)\b/)) {
    return "shopping";
  }
  
  // Travel keywords
  if (lowerDesc.match(/\b(flight|hotel|vacation|trip|travel|airport|airline|booking|airbnb)\b/)) {
    return "travel";
  }
  
  // Transportation keywords
  if (lowerDesc.match(/\b(uber|lyft|taxi|cab|bus|train|metro|gas|fuel|parking|toll)\b/)) {
    return "transportation";
  }
  
  // Housing keywords
  if (lowerDesc.match(/\b(rent|mortgage|housing|apartment|house|maintenance|repair)\b/)) {
    return "housing";
  }
  
  // Entertainment keywords
  if (lowerDesc.match(/\b(movie|cinema|theater|concert|show|netflix|spotify|entertainment|game|gaming)\b/)) {
    return "entertainment";
  }
  
  // Tickets keywords
  if (lowerDesc.match(/\b(ticket|tickets|event|festival|sports|stadium)\b/)) {
    return "tickets";
  }
  
  // Utilities keywords
  if (lowerDesc.match(/\b(internet|wifi|phone|mobile|electricity|electric|utility|utilities)\b/)) {
    return "utilities";
  }
  
  // Water keywords
  if (lowerDesc.match(/\b(water|bill)\b/)) {
    return "water";
  }
  
  // Education keywords
  if (lowerDesc.match(/\b(tuition|school|college|university|education|course|class|book|textbook)\b/)) {
    return "education";
  }
  
  // Health keywords
  if (lowerDesc.match(/\b(doctor|hospital|medical|medicine|pharmacy|health|dental|dentist|clinic)\b/)) {
    return "health";
  }
  
  // Gifts keywords
  if (lowerDesc.match(/\b(gift|present|birthday|anniversary|wedding)\b/)) {
    return "gifts";
  }
  
  // Technology keywords
  if (lowerDesc.match(/\b(phone|laptop|computer|tablet|electronics|tech|software|gadget)\b/)) {
    return "technology";
  }
  
  // Bills keywords
  if (lowerDesc.match(/\b(bill|fee|charge|payment|subscription)\b/)) {
    return "bills";
  }
  
  // Baby keywords
  if (lowerDesc.match(/\b(baby|kids|children|diaper|formula|toys)\b/)) {
    return "baby";
  }
  
  // Music keywords
  if (lowerDesc.match(/\b(music|concert|album|cd|vinyl|instrument)\b/)) {
    return "music";
  }
  
  // Books keywords
  if (lowerDesc.match(/\b(book|books|novel|reading|library|bookstore)\b/)) {
    return "books";
  }
  
  return null; // No match found
};