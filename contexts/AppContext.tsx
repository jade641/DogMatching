// Enhanced Context with proper state management
import { createContext, ReactNode, useCallback, useContext, useReducer } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { AppState, Conversation, Dog, LoadingState, MatchResult, Notification, Owner, Screen } from "../types";

// Re-export types for convenience
export type { Dog, Owner, Screen };

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

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

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

export const FONT = "Roboto_400Regular";

// Dog images from Unsplash
const IMGS = {
  bella: "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=600&fit=crop",
  choco: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&fit=crop",
  luna: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&fit=crop",
  rex: "https://images.unsplash.com/photo-1539692177343-b2b990faef15?w=600&fit=crop",
  kiko: "https://images.unsplash.com/photo-1721781010133-8eb0e9b23daf?w=600&fit=crop",
  yuki: "https://images.unsplash.com/photo-1693615774176-a5560f55ac49?w=600&fit=crop",
  ganda: "https://images.unsplash.com/photo-1693615774176-a5560f55ac49?w=600&fit=crop",
  bruno: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop",
  max: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&fit=crop",
  rocky: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&fit=crop",
};

export { IMGS };

// Action types for reducer
type AppAction =
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'SET_USER'; payload: Owner | null }
  | { type: 'SET_SELECTED_DOG'; payload: Dog | null }
  | { type: 'SET_MATCH_RESULTS'; payload: MatchResult[] }
  | { type: 'SET_LOADING'; payload: { key: string; state: LoadingState } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] };

// Enhanced app state
interface EnhancedAppState extends AppState {
  history: Screen[];
  loadingStates: Record<string, LoadingState>;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

const initialState: EnhancedAppState = {
  screen: "landing" as Screen,
  selectedDog: null,
  currentUser: null,
  isAuthenticated: false,
  matchResults: [],
  conversations: [],
  notifications: [],
  history: ["landing"],
  loadingStates: {},
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'en'
  }
};

// Reducer function
function appReducer(state: EnhancedAppState, action: AppAction): EnhancedAppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return {
        ...state,
        screen: action.payload,
        history: [...state.history, action.payload].slice(-10) // Keep last 10 screens
      };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: !!action.payload
      };
    case 'SET_SELECTED_DOG':
      return {
        ...state,
        selectedDog: action.payload
      };
    case 'SET_MATCH_RESULTS':
      return {
        ...state,
        matchResults: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.state
        }
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload
      };
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: EnhancedAppState;
  navigate: (screen: Screen, data?: any) => void;
  goBack: () => void;
  setUser: (user: Owner | null) => void;
  setSelectedDog: (dog: Dog | null) => void;
  setMatchResults: (results: MatchResult[]) => void;
  setLoading: (key: string, loading: LoadingState) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  isLoading: (key: string) => boolean;
  // Computed values
  screen: Screen;
  selectedDog: Dog | null;
  currentUser: Owner | null;
  userName: string;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useCallback((screen: Screen, data?: any) => {
    dispatch({ type: 'SET_SCREEN', payload: screen });
    if (data && typeof data === 'object' && 'id' in data) {
      dispatch({ type: 'SET_SELECTED_DOG', payload: data as Dog });
    }
  }, []);

  const goBack = useCallback(() => {
    const previousScreen = state.history[state.history.length - 2];
    if (previousScreen) {
      dispatch({ type: 'SET_SCREEN', payload: previousScreen });
    }
  }, [state.history]);

  const setUser = useCallback((user: Owner | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setSelectedDog = useCallback((dog: Dog | null) => {
    dispatch({ type: 'SET_SELECTED_DOG', payload: dog });
  }, []);

  const setMatchResults = useCallback((results: MatchResult[]) => {
    dispatch({ type: 'SET_MATCH_RESULTS', payload: results });
  }, []);

  const setLoading = useCallback((key: string, loading: LoadingState) => {
    dispatch({ type: 'SET_LOADING', payload: { key, state: loading } });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const fullNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const isLoading = useCallback((key: string) => {
    return state.loadingStates[key] === 'loading';
  }, [state.loadingStates]);

  const contextValue: AppContextType = {
    state,
    navigate,
    goBack,
    setUser,
    setSelectedDog,
    setMatchResults,
    setLoading,
    addNotification,
    markNotificationRead,
    isLoading,
    // Computed values for backward compatibility
    screen: state.screen,
    selectedDog: state.selectedDog,
    currentUser: state.currentUser,
    userName: state.currentUser?.name || 'Juan',
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useV3() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useV3 must be used within an AppProvider');
  }
  return context;
}

// Enhanced UI Components with better accessibility and design
export function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
  icon
}: {
  children: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: T.secondary,
          borderColor: T.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: T.primary,
          borderWidth: 2,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: T.primary,
          borderColor: T.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24, minHeight: 56 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20, minHeight: 48 };
    }
  };

  const getTextColor = () => {
    return variant === 'outline' || variant === 'ghost' ? T.primary : '#fff';
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        {
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: icon ? 8 : 0,
          opacity: disabled ? 0.6 : 1,
          ...getVariantStyles(),
          ...getSizeStyles(),
        }
      ]}
    >
      {loading ? (
        <Text style={{ color: getTextColor(), fontWeight: '600' }}>Loading...</Text>
      ) : (
        <>
          {icon}
          <Text style={{
            color: getTextColor(),
            fontWeight: '600',
            fontFamily: FONT,
            fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16
          }}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  secure = false,
  error,
  multiline = false,
  autoCapitalize = 'sentences'
}: {
  label?: string;
  value: string;
  onChange: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  secure?: boolean;
  error?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: T.dark,
          marginBottom: 6,
          fontFamily: FONT
        }}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={secure}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
        style={{
          borderWidth: 1,
          borderColor: error ? T.error : T.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 16 : 12,
          fontSize: 16,
          fontFamily: FONT,
          backgroundColor: T.white,
          minHeight: multiline ? 100 : 48,
          textAlignVertical: multiline ? 'top' : 'center'
        }}
      />
      {error && (
        <Text style={{
          fontSize: 12,
          color: T.error,
          marginTop: 4,
          fontFamily: FONT
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}

// Mock data with proper types
export const MOCK_DOGS: Dog[] = [
  {
    id: "1",
    name: "Bella",
    breed: "Shih Tzu",
    sex: "female",
    age: 3,
    size: "small",
    color: "Brown and White",
    temperament: ["Friendly", "Energetic", "Loyal"],
    location: "Davao City",
    images: [IMGS.bella],
    verificationTier: 2,
    healthRecords: [],
    owner: {
      id: "owner1",
      name: "Maria Santos",
      avatar: "https://via.placeholder.com/100x100/4A90E2/ffffff?text=MS",
      location: "Davao City, Philippines",
      memberSince: "2023-01-15",
      reputation: 4.8,
      totalMatches: 12,
      successfulBreedings: 8,
      verificationStatus: "verified",
      badges: []
    },
    description: "Bella is a loving and energetic Shih Tzu looking for a compatible mate.",
    lastActive: "2024-01-15"
  },
  {
    id: "2",
    name: "Max",
    breed: "Siberian Husky",
    sex: "male",
    age: 4,
    size: "large",
    color: "Grey and White",
    temperament: ["Loyal", "Protective", "Intelligent"],
    location: "Matina, Davao",
    images: [IMGS.max],
    verificationTier: 3,
    healthRecords: [],
    owner: {
      id: "owner2",
      name: "Carlos Reyes",
      avatar: "https://via.placeholder.com/100x100/FF6B6B/ffffff?text=CR",
      location: "Matina, Davao",
      memberSince: "2022-08-20",
      reputation: 4.9,
      totalMatches: 18,
      successfulBreedings: 12,
      verificationStatus: "verified",
      badges: []
    },
    description: "Max is a strong and intelligent Siberian Husky with excellent pedigree.",
    lastActive: "2024-01-16"
  },
  {
    id: "3",
    name: "Luna",
    breed: "Shiba Inu",
    sex: "female",
    age: 2,
    size: "medium",
    color: "Red and White",
    temperament: ["Playful", "Friendly", "Active"],
    location: "Buhangin, Davao",
    images: [IMGS.luna],
    verificationTier: 2,
    healthRecords: [],
    owner: {
      id: "owner3",
      name: "Anna Cruz",
      avatar: "https://via.placeholder.com/100x100/9370DB/ffffff?text=AC",
      location: "Buhangin, Davao",
      memberSince: "2023-03-10",
      reputation: 4.7,
      totalMatches: 8,
      successfulBreedings: 5,
      verificationStatus: "verified",
      badges: []
    },
    description: "Luna is a beautiful and playful Shiba Inu with a great temperament.",
    lastActive: "2024-01-14"
  },
  {
    id: "4",
    name: "Rocky",
    breed: "Beagle",
    sex: "male",
    age: 3,
    size: "medium",
    color: "Tricolor",
    temperament: ["Calm", "Friendly", "Gentle"],
    location: "Toril, Davao",
    images: [IMGS.rocky],
    verificationTier: 1,
    healthRecords: [],
    owner: {
      id: "owner4",
      name: "Jose Garcia",
      avatar: "https://via.placeholder.com/100x100/20B2AA/ffffff?text=JG",
      location: "Toril, Davao",
      memberSince: "2023-06-15",
      reputation: 4.6,
      totalMatches: 5,
      successfulBreedings: 3,
      verificationStatus: "verified",
      badges: []
    },
    description: "Rocky is a calm and gentle Beagle, perfect for breeding.",
    lastActive: "2024-01-13"
  },
];

export const MOCK_VERIFIERS = [
  {
    id: "1",
    name: "Dr. Juan Veterinarian",
    type: "Licensed Veterinarian" as const,
    rating: 4.9,
    experience: "15 years",
    location: "Davao City",
    specialties: ["Breeding Health", "Genetic Testing"],
    avatar: "JV",
    role: "Licensed Veterinarian",
    clinic: "Davao Animal Clinic",
    available: true
  }
];

// Legacy components for backward compatibility
export const Chip = ({ children, active, onPress }: { children: string; active?: boolean; onPress?: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={{
      backgroundColor: active ? T.primary : T.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start'
    }}
  >
    <Text style={{ color: active ? '#fff' : T.primary, fontSize: 12, fontWeight: '600' }}>
      {children}
    </Text>
  </TouchableOpacity>
);

export const VeriBadge = ({ tier }: { tier: 1 | 2 | 3 }) => (
  <View style={{
    backgroundColor: tier === 3 ? T.amber : tier === 2 ? T.teal : T.medium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  }}>
    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
      TIER {tier}
    </Text>
  </View>
);

export const ScoreBar = ({ score }: { score: number }) => (
  <View style={{
    height: 6,
    backgroundColor: T.bg,
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1
  }}>
    <View style={{
      width: `${score}%`,
      height: '100%',
      backgroundColor: score > 80 ? T.success : score > 60 ? T.warning : T.error
    }} />
  </View>
);