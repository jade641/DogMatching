// Placeholder Context component file
// This file is intentionally left blank for now.
import { createContext, ReactNode, useContext, useState } from "react";

/* ── Design Tokens ───────────────────────────────────────────── */
export const T = {
  // Primary Colors - ORANGE AS MAIN COLOR! 🟠
  primary: "#FF7043", // Playful Orange - MAIN COLOR
  primaryLight: "#FFE8E3", // Light orange background
  primaryDark: "#D84315", // Dark orange for text
  
  secondary: "#FFB84D", // Warm Yellow - cheerful and welcoming
  secondaryLight: "#FFF3E0", // Light yellow background
  secondaryDark: "#E69500", // Dark yellow
  
  accent: "#4A90E2", // Soft Blue - calm and trustworthy
  accentLight: "#E3F2FD", // Light blue background
  accentDark: "#2E5C8A", // Dark blue
  
  // Additional Colors
  mintGreen: "#66D9B8", // Mint Green - fresh and nature-associated
  mintGreenLight: "#E8F8F4", // Light mint background
  mintGreenDark: "#3DAA87", // Dark mint
  
  vibrantBlue: "#2196F3", // Vibrant Blue - engaging nod to canine vision
  
  // Neutrals
  dark: "#2C2C2A", // Dark text
  medium: "#888780", // Secondary text
  light: "#D3D1C7", // Border/disabled
  bg: "#F5F5F5", // Neutral white/light gray background
  white: "#FFFFFF",
  border: "#E0E0E0",
  
  // Legacy aliases (for backward compatibility)
  teal: "#FF7043", // Now orange (was blue)
  tealLight: "#FFE8E3", // Light orange
  tealDark: "#D84315", // Dark orange
  amber: "#FFB84D", // Warm yellow
  amberLight: "#FFF3E0",
  coral: "#FF7043", // Orange
  coralLight: "#FFE8E3",
  
  // Shadows
  shadow: "0 2px 8px rgba(0,0,0,0.08)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.10)",
  shadowLg: "0 8px 24px rgba(0,0,0,0.12)",
};

export const FONT = "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif";

/* ── Screen types ────────────────────────────────────────────── */
export type Screen =
  | "landing"
  | "splash"
  | "onboarding"
  | "register"
  | "login"
  | "home"
  | "match"
  | "filter"
  | "match-profile"
  | "send-request"
  | "request-received"
  | "dog-profile"
  | "owner-profile"
  | "verify-upload"
  | "verify-choose"
  | "verify-status"
  | "reputation"
  | "notifications"
  | "events"
  | "settings"
  | "empty-matches"
  | "empty-notif"
  | "empty-verify";

/* ── Types ───────────────────────────────────────────────────── */
export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  color: string;
  temperament: string[];
  score: number;
  verified: boolean;
  tier: 1 | 2 | 3;
  ownerName: string;
  ownerLocation: string;
  ownerAvatar: string;
  img: string;
  rating: number;
  reviews: number;
}

/* ── Mock Data ───────────────────────────────────────────────── */
const IMGS = {
  bella:
    "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=600&fit=crop",
  choco:
    "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&fit=crop",
  luna: "https://images.unsplash.com/photo-1693615775129-f2004d6e3e0b?w=600&fit=crop",
  bruno:
    "https://images.unsplash.com/photo-1637098063179-d73d8034621c?w=600&fit=crop",
  yuki: "https://images.unsplash.com/photo-1721781060617-2c451646fee7?w=600&fit=crop",
  rex: "https://images.unsplash.com/photo-1539692177343-b2b990faef15?w=600&fit=crop",
  kiko: "https://images.unsplash.com/photo-1721781010133-8eb0e9b23daf?w=600&fit=crop",
  ganda:
    "https://images.unsplash.com/photo-1693615774176-a5560f55ac49?w=600&fit=crop",
};
export { IMGS };

export const MOCK_DOGS: Dog[] = [
  {
    id: "d1",
    name: "Bella",
    breed: "Shih Tzu",
    age: "2 yrs",
    sex: "Female",
    size: "Small",
    color: "White & Brown",
    temperament: ["Friendly", "Calm", "Playful"],
    score: 94,
    verified: true,
    tier: 2,
    ownerName: "Maria Santos",
    ownerLocation: "Buhangin, Davao City",
    ownerAvatar: "MS",
    img: IMGS.bella,
    rating: 4.8,
    reviews: 12,
  },
  {
    id: "d2",
    name: "Choco",
    breed: "Golden Retriever",
    age: "3 yrs",
    sex: "Male",
    size: "Large",
    color: "Golden Brown",
    temperament: ["Friendly", "Active", "Playful"],
    score: 87,
    verified: true,
    tier: 2,
    ownerName: "Carlo Reyes",
    ownerLocation: "Matina, Davao City",
    ownerAvatar: "CR",
    img: IMGS.choco,
    rating: 4.5,
    reviews: 8,
  },
  {
    id: "d3",
    name: "Luna",
    breed: "Golden Retriever",
    age: "1.5 yrs",
    sex: "Female",
    size: "Large",
    color: "Light Gold",
    temperament: ["Calm", "Friendly"],
    score: 82,
    verified: false,
    tier: 1,
    ownerName: "Ana Lim",
    ownerLocation: "Toril, Davao City",
    ownerAvatar: "AL",
    img: IMGS.luna,
    rating: 4.2,
    reviews: 5,
  },
  {
    id: "d4",
    name: "Bruno",
    breed: "German Shepherd",
    age: "4 yrs",
    sex: "Male",
    size: "Large",
    color: "Black & Tan",
    temperament: ["Independent", "Calm"],
    score: 79,
    verified: true,
    tier: 3,
    ownerName: "Mark Villanueva",
    ownerLocation: "Agdao, Davao City",
    ownerAvatar: "MV",
    img: IMGS.bruno,
    rating: 4.9,
    reviews: 17,
  },
  {
    id: "d5",
    name: "Yuki",
    breed: "Pomeranian",
    age: "1 yr",
    sex: "Female",
    size: "Small",
    color: "White",
    temperament: ["Playful", "Friendly", "Active"],
    score: 91,
    verified: true,
    tier: 2,
    ownerName: "Jenny Cruz",
    ownerLocation: "Matina, Davao City",
    ownerAvatar: "JC",
    img: IMGS.yuki,
    rating: 4.7,
    reviews: 9,
  },
  {
    id: "d6",
    name: "Rex",
    breed: "Labrador Retriever",
    age: "3 yrs",
    sex: "Male",
    size: "Large",
    color: "Black",
    temperament: ["Friendly", "Active"],
    score: 76,
    verified: true,
    tier: 3,
    ownerName: "Ben Santos",
    ownerLocation: "Buhangin, Davao City",
    ownerAvatar: "BS",
    img: IMGS.rex,
    rating: 4.6,
    reviews: 14,
  },
];

export const MOCK_VERIFIERS = [
  {
    id: "v1",
    name: "Dr. Patricia Reyes",
    role: "Licensed Veterinarian",
    clinic: "Davao Animal Clinic",
    rating: 4.9,
    available: true,
    avatar: "PR",
  },
  {
    id: "v2",
    name: "Dr. Eduardo Tan",
    role: "Certified Breeder",
    clinic: "Mindanao K9 Center",
    rating: 4.8,
    available: true,
    avatar: "ET",
  },
  {
    id: "v3",
    name: "Dr. Angela Flores",
    role: "Licensed Veterinarian",
    clinic: "City Pet Hospital",
    rating: 4.7,
    available: false,
    avatar: "AF",
  },
];

/* ── Context ─────────────────────────────────────────────────── */
interface ContextType {
  screen: Screen;
  selectedDog: Dog | null;
  userName: string;
  navigate: (s: Screen, dog?: Dog) => void;
  goBack: () => void;
}

const Context = createContext<ContextType | null>(null);

export function V3Provider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const navigate = (s: Screen, dog?: Dog) => {
    setHistory((h) => [...h, screen]);
    if (dog) setSelectedDog(dog);
    setScreen(s);
  };

  const goBack = () => {
    const prev = [...history];
    const last = prev.pop();
    setHistory(prev);
    if (last) setScreen(last);
  };

  return (
    <Context.Provider
      value={{ screen, selectedDog, userName: "Juan", navigate, goBack }}
    >
      {children}
    </Context.Provider>
  );
}

export function useV3() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useV3 must be within V3Provider");
  return ctx;
}

/* ── Shared UI components ────────────────────────────────────── */
export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  sm = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  sm?: boolean;
}) {
  const { TouchableOpacity, Text } = require("react-native");
  const styles: Record<string, any> = {
    primary: { backgroundColor: T.teal },
    secondary: {
      backgroundColor: "#fff",
      borderWidth: 1.5,
      borderColor: T.teal,
    },
    danger: { backgroundColor: T.coral },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: T.border,
    },
  };
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        paddingHorizontal: sm ? 16 : 20,
        paddingVertical: sm ? 8 : 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text
        style={{
          fontSize: sm ? 12 : 14,
          fontWeight: "700",
          color:
            variant === "primary" || variant === "danger" ? "#fff" : variant === "secondary" ? T.teal : T.dark,
          fontFamily: FONT,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function Field({
  emoji,
  placeholder,
  type = "text",
  value,
}: {
  emoji: string;
  placeholder: string;
  type?: string;
  value?: string;
}) {
  const { View, Text, TextInput } = require("react-native");
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: T.white,
      }}
    >
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <TextInput
        placeholder={placeholder}
        defaultValue={value}
        secureTextEntry={type === "password"}
        style={{
          flex: 1,
          fontSize: 14,
          color: T.dark,
          fontFamily: FONT,
        }}
        placeholderTextColor={T.medium}
      />
    </View>
  );
}

export function Chip({
  children,
  active,
  onPress,
}: {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  const { TouchableOpacity, Text } = require("react-native");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: active ? T.teal : T.white,
        borderWidth: 1,
        borderColor: active ? T.teal : T.border,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: active ? "#fff" : T.dark,
          fontFamily: FONT,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function VeriBadge({
  verified,
  tier,
}: {
  verified?: boolean;
  tier?: number;
}) {
  const { View, Text } = require("react-native");
  
  if (tier === 3)
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 12,
          backgroundColor: T.amberLight,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#8a5a00",
            fontFamily: FONT,
          }}
        >
          Tier 3
        </Text>
      </View>
    );
  if (verified || tier === 2)
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 12,
          backgroundColor: T.tealLight,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: T.tealDark,
            fontFamily: FONT,
          }}
        >
          Verified
        </Text>
      </View>
    );
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: T.amberLight,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: "#a06000",
          fontFamily: FONT,
        }}
      >
        Pending
      </Text>
    </View>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const { View, Text } = require("react-native");
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: T.teal, fontFamily: FONT }}>
          {score}% Compatible
        </Text>
      </View>
      <View
        style={{
          height: 8,
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: T.light,
        }}
      >
        <View
          style={{
            width: `${score}%`,
            height: "100%",
            borderRadius: 4,
            backgroundColor: T.teal,
          }}
        />
      </View>
    </View>
  );
}

export function TopBar({
  title,
  onBack,
  rightEmoji,
  onRight,
}: {
  title?: string;
  onBack?: () => void;
  rightEmoji?: string;
  onRight?: () => void;
}) {
  const { View, Text, TouchableOpacity } = require("react-native");
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 12,
        backgroundColor: T.white,
        borderBottomWidth: 1,
        borderBottomColor: T.border,
      }}
    >
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: T.bg,
          }}
        >
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
      )}
      {title && (
        <Text
          style={{
            flex: 1,
            fontWeight: "600",
            fontSize: 16,
            color: T.dark,
            fontFamily: FONT,
          }}
        >
          {title}
        </Text>
      )}
      {rightEmoji && onRight && (
        <TouchableOpacity onPress={onRight}>
          <Text style={{ fontSize: 20 }}>{rightEmoji}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

