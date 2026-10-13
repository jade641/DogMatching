import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as ExpoCrypto from "expo-crypto";
import { AppState, Platform } from "react-native";

// React Native has no WebCrypto; supabase-js needs it to SHA-256 the PKCE code challenge.
if (Platform.OS !== "web") {
  const g = globalThis as { crypto?: { getRandomValues?: Crypto["getRandomValues"]; subtle?: SubtleCrypto } };
  g.crypto ??= {};
  g.crypto.getRandomValues ??= ExpoCrypto.getRandomValues as Crypto["getRandomValues"];
  g.crypto.subtle ??= {
    digest: (algorithm: AlgorithmIdentifier, data: BufferSource) =>
      ExpoCrypto.digest(algorithm as ExpoCrypto.CryptoDigestAlgorithm, data),
  } as SubtleCrypto;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;

// Static web rendering runs without `window`; sessions only exist on the client.
const isStaticRender = Platform.OS === "web" && typeof window === "undefined";

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : "http://localhost:54321",
  isSupabaseConfigured ? SUPABASE_ANON_KEY : "missing-anon-key",
  {
    auth: {
      storage: isStaticRender ? undefined : AsyncStorage,
      autoRefreshToken: !isStaticRender,
      persistSession: !isStaticRender,
      detectSessionInUrl: Platform.OS === "web" && !isStaticRender,
      flowType: "pkce",
    },
  },
);

// Refresh tokens only while the app is in the foreground (recommended for React Native).
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
