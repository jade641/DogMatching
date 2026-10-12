import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import * as api from "../services/api";
import type { AppNotification, Dog, Screen, Session } from "../types";

type Params = Record<string, any>;

interface Route {
  screen: Screen;
  params: Params;
}

export interface Toast {
  id: number;
  title: string;
  message?: string;
  tone: "info" | "success" | "error";
  notification?: AppNotification;
}

/** Screens a signed-in user is moved away from automatically after sign-in. */
const SIGNED_OUT_SCREENS: Screen[] = ["boot", "setup-required", "landing", "login", "register", "forgot-password", "verify-email"];
const LANDING_SEEN_KEY = "pawmatch.landingSeen";

export function homeScreenFor(session: Session): Screen {
  return session.verifier && !session.owner ? "vet-dashboard" : "home";
}

interface AppContextValue {
  screen: Screen;
  params: Params;
  canGoBack: boolean;
  navigate: (screen: Screen, params?: Params) => void;
  replace: (screen: Screen, params?: Params) => void;
  goBack: () => void;
  resetTo: (screen: Screen, params?: Params) => void;

  session: Session | null;
  bootError: string | null;
  retryBoot: () => void;
  refreshSession: () => Promise<Session | null>;
  signOut: () => Promise<void>;
  markLandingSeen: () => void;

  myDogs: Dog[];
  dogsLoaded: boolean;
  reloadDogs: () => Promise<Dog[]>;
  activeDog: Dog | null;
  setActiveDogId: (id: string) => void;

  notifications: AppNotification[];
  unreadCount: number;
  lastNotification: AppNotification | null;
  reloadNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
  openNotification: (n: AppNotification) => void;

  toast: Toast | null;
  showToast: (title: string, message?: string, tone?: Toast["tone"]) => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ screen: "boot", params: {} }]);
  const [session, setSession] = useState<Session | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [myDogs, setMyDogs] = useState<Dog[]>([]);
  const [dogsLoaded, setDogsLoaded] = useState(false);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastNotification, setLastNotification] = useState<AppNotification | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const route = stack[stack.length - 1];
  const screenRef = useRef<Screen>(route.screen);
  const sessionUidRef = useRef<string | null>(null);

  useEffect(() => {
    screenRef.current = route.screen;
  }, [route.screen]);

  /* ── Navigation ──────────────────────────────────────────────── */
  const navigate = useCallback((screen: Screen, params: Params = {}) => {
    setStack((s) => [...s, { screen, params }].slice(-30));
  }, []);
  const replace = useCallback((screen: Screen, params: Params = {}) => {
    setStack((s) => [...s.slice(0, -1), { screen, params }]);
  }, []);
  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const resetTo = useCallback((screen: Screen, params: Params = {}) => {
    setStack([{ screen, params }]);
  }, []);

  /* ── Toasts ──────────────────────────────────────────────────── */
  const showToast = useCallback((title: string, message?: string, tone: Toast["tone"] = "info") => {
    setToast({ id: Date.now(), title, message, tone });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  /* ── Session & dogs ──────────────────────────────────────────── */
  const reloadDogs = useCallback(async () => {
    const uid = sessionUidRef.current;
    if (!uid) return [];
    const dogs = await api.listMyDogs(uid);
    setMyDogs(dogs);
    setDogsLoaded(true);
    setActiveDogId((current) => (current && dogs.some((d) => d.id === current) ? current : (dogs[0]?.id ?? null)));
    return dogs;
  }, []);

  const loadSession = useCallback(async () => {
    const s = await api.fetchSession();
    sessionUidRef.current = s?.user.id ?? null;
    setSession(s);
    if (s?.owner) {
      await reloadDogs();
    } else {
      setMyDogs([]);
      setDogsLoaded(true);
    }
    return s;
  }, [reloadDogs]);

  const clearSignedInState = useCallback(() => {
    sessionUidRef.current = null;
    setSession(null);
    setMyDogs([]);
    setDogsLoaded(false);
    setActiveDogId(null);
    setNotifications([]);
    setLastNotification(null);
  }, []);

  const boot = useCallback(async () => {
    if (!isSupabaseConfigured) {
      resetTo("setup-required");
      return;
    }
    setBootError(null);
    resetTo("boot");
    try {
      const s = await loadSession();
      if (s) {
        resetTo(homeScreenFor(s));
      } else {
        const seen = await AsyncStorage.getItem(LANDING_SEEN_KEY).catch(() => null);
        resetTo(seen ? "login" : "landing");
      }
    } catch (e) {
      setBootError(api.errorMessage(e));
    }
  }, [loadSession, resetTo]);

  useEffect(() => {
    boot();
    if (!isSupabaseConfigured) return;

    const { data } = supabase.auth.onAuthStateChange((event, authSession) => {
      if (event === "SIGNED_IN") {
        const uid = authSession?.user.id ?? null;
        if (!uid || uid === sessionUidRef.current) return;
        // Defer: Supabase calls must not run inside the auth callback itself.
        setTimeout(async () => {
          try {
            const s = await loadSession();
            if (s && SIGNED_OUT_SCREENS.includes(screenRef.current)) resetTo(homeScreenFor(s));
          } catch (e) {
            showToast("Couldn't load your profile", api.errorMessage(e), "error");
          }
        }, 0);
      } else if (event === "SIGNED_OUT") {
        clearSignedInState();
        resetTo("login");
      }
    });
    return () => data.subscription.unsubscribe();
  }, [boot, loadSession, resetTo, showToast, clearSignedInState]);

  const refreshSession = useCallback(async () => {
    try {
      return await loadSession();
    } catch (e) {
      showToast("Couldn't refresh your profile", api.errorMessage(e), "error");
      return null;
    }
  }, [loadSession, showToast]);

  const signOut = useCallback(async () => {
    try {
      await api.signOut();
    } catch {
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    }
    clearSignedInState();
    resetTo("login");
  }, [clearSignedInState, resetTo]);

  const markLandingSeen = useCallback(() => {
    AsyncStorage.setItem(LANDING_SEEN_KEY, "1").catch(() => undefined);
  }, []);

  /* ── Notifications (Supabase Realtime) ───────────────────────── */
  const reloadNotifications = useCallback(async () => {
    try {
      setNotifications(await api.listNotifications());
    } catch {
      // Non-critical; the list refreshes on the next visit.
    }
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    reloadNotifications();
    return api.subscribeToNotifications(userId, (n) => {
      setNotifications((list) => [n, ...list.filter((x) => x.id !== n.id)]);
      setLastNotification(n);
      setToast({ id: Date.now(), title: n.title, message: n.body, tone: "info", notification: n });
      if (n.type === "verification_result") reloadDogs().catch(() => undefined);
    });
  }, [userId, reloadNotifications, reloadDogs]);

  const markAllRead = useCallback(async () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    await api.markNotificationsRead().catch(() => undefined);
  }, []);

  const openNotification = useCallback(
    (n: AppNotification) => {
      if (!n.read) {
        setNotifications((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
        api.markNotificationsRead([n.id]).catch(() => undefined);
      }
      const d = n.data ?? {};
      switch (n.type) {
        case "match_request":
        case "request_update":
        case "message":
          if (d.match_request_id) navigate("conversation", { requestId: Number(d.match_request_id) });
          break;
        case "review":
          navigate("reputation");
          break;
        case "verification_request":
          if (d.submission_id) navigate("vet-request-detail", { submissionId: d.submission_id });
          break;
        case "verification_result":
          navigate("verify-status", { dogId: d.dog_id });
          break;
        case "match_alert":
          if (d.for_dog_id) setActiveDogId(d.for_dog_id);
          if (d.dog_id) navigate("match-profile", { dogId: d.dog_id });
          break;
        default:
          navigate("notifications");
      }
    },
    [navigate],
  );

  const activeDog = useMemo(
    () => myDogs.find((d) => d.id === activeDogId) ?? myDogs[0] ?? null,
    [myDogs, activeDogId],
  );

  const value: AppContextValue = {
    screen: route.screen,
    params: route.params,
    canGoBack: stack.length > 1,
    navigate,
    replace,
    goBack,
    resetTo,
    session,
    bootError,
    retryBoot: boot,
    refreshSession,
    signOut,
    markLandingSeen,
    myDogs,
    dogsLoaded,
    reloadDogs,
    activeDog,
    setActiveDogId,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    lastNotification,
    reloadNotifications,
    markAllRead,
    openNotification,
    toast,
    showToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}

/** Signed-in session; only call from screens that require authentication. */
export function useSession(): Session {
  const { session } = useApp();
  if (!session) throw new Error("This screen requires a signed-in user");
  return session;
}
