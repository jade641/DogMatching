import {
  Bell,
  CheckCircle,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  PawPrint,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { districtOf, FONT, FONT_BOLD, shadow, T, timeAgo } from "../constants/theme";
import { useApp, useSession } from "../contexts/AppContext";
import { useAsync } from "../hooks/useAsync";
import * as api from "../services/api";
import type { MatchPreferences } from "../services/compatibility";
import { TEMPERAMENT_OPTIONS } from "../services/compatibility";
import type { RankedMatch, Size } from "../types";
import { BreedInput, ColorCombobox, MatchCard, MyDogSelector } from "./DogWidgets";
import { FloatingMatchResults } from "./FloatingMatchResults";
import { Avatar, Btn, Card, Chip, EmptyState, ErrorView, Header, Loading, SectionTitle } from "./ui";

function NoDogPrompt() {
  const { navigate } = useApp();
  return (
    <Card style={{ marginHorizontal: 20, marginBottom: 20 }}>
      <EmptyState
        icon={PawPrint}
        title="Add your first dog"
        message="Create your dog's profile so PawMatch can score compatible breeding partners for you."
        actionLabel="Add Dog Profile"
        onAction={() => navigate("add-dog")}
      />
    </Card>
  );
}

/* ── Home Dashboard (Figure 10) ─────────────────────────────────── */
export function HomeScreen() {
  const { navigate, myDogs, activeDog, setActiveDogId, notifications, unreadCount, openNotification, lastNotification } =
    useApp();
  const session = useSession();
  const insets = useSafeAreaInsets();
  const firstName = session.user.full_name.split(" ")[0] || session.user.full_name;
  const district = districtOf(session.user.location);

  const requests = useAsync(() => api.listMyRequests(), [lastNotification?.id]);
  const verifiedNearby = useAsync(
    () => api.countVerifiedDogs(session.user.id, district ?? undefined),
    [session.user.id, district],
  );
  const top = useAsync(
    async () => (activeDog ? (await api.recommendMatches(activeDog, {}, 3)).results : []),
    [activeDog?.id],
  );

  const incomingPending = (requests.data ?? []).filter(
    (r) => r.recipient_user_id === session.user.id && r.status === "pending",
  ).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const refresh = () => {
    requests.reload(true);
    verifiedNearby.reload(true);
    top.reload(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: 12,
          backgroundColor: T.white,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <PawPrint size={20} color={T.primary} strokeWidth={2} />
          <Text style={{ fontSize: 18, color: T.primary, fontFamily: FONT_BOLD }}>PawMatch</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <TouchableOpacity onPress={() => navigate("requests")} accessibilityRole="button" accessibilityLabel="Requests and messages" hitSlop={8}>
            <MessageCircle size={21} color={T.dark} strokeWidth={1.6} />
            {incomingPending > 0 && <Dot />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("notifications")} accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={8}>
            <Bell size={21} color={T.dark} strokeWidth={1.6} />
            {unreadCount > 0 && <Dot />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("owner-profile")} accessibilityRole="button" accessibilityLabel="My profile">
            <Avatar name={session.user.full_name} size={34} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={T.primary} />}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 21, color: T.dark, fontFamily: FONT_BOLD }}>
            {greeting}, {firstName}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 2, color: T.medium, fontFamily: FONT }}>
            Here&apos;s what&apos;s new for your dogs today.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 20, flexDirection: "row", gap: 12 }}>
          {[
            { Icon: Heart, n: incomingPending, t: "New Match Requests", go: () => navigate("requests") },
            { Icon: CheckCircle, n: verifiedNearby.data ?? 0, t: district ? `Verified in ${district}` : "Verified Dogs", go: () => navigate("match") },
            { Icon: Bell, n: unreadCount, t: "Unread Alerts", go: () => navigate("notifications") },
          ].map((s) => (
            <TouchableOpacity
              key={s.t}
              onPress={s.go}
              style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: T.white, alignItems: "center", ...shadow }}
            >
              <s.Icon size={22} color={T.primary} strokeWidth={1.5} />
              <Text style={{ fontSize: 19, marginTop: 4, color: T.primary, fontFamily: FONT_BOLD }}>{s.n}</Text>
              <Text style={{ fontSize: 11, marginTop: 2, textAlign: "center", color: T.medium, lineHeight: 15, fontFamily: FONT }}>
                {s.t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {myDogs.length === 0 ? (
          <NoDogPrompt />
        ) : (
          <>
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigate("filter")}
                style={{ borderRadius: 22, padding: 18, backgroundColor: T.primary, overflow: "hidden", gap: 8 }}
              >
                <View
                  style={{
                    position: "absolute",
                    right: -24,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "rgba(255,255,255,0.12)",
                  }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="#fff" strokeWidth={2} />
                  <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontFamily: FONT_BOLD, letterSpacing: 0.6 }}>
                    BREEDING MATCH
                  </Text>
                </View>
                <Text style={{ fontSize: 19, lineHeight: 25, color: "#fff", fontFamily: FONT_BOLD }}>
                  Set your preferred traits and instantly see the 3 best candidates.
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Text style={{ color: "#fff", fontFamily: FONT_BOLD }}>Open Matcher</Text>
                  <ChevronRight size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <View style={{ paddingHorizontal: 20 }}>
                <SectionTitle
                  title="Your Top Matches Today"
                  right={
                    <TouchableOpacity onPress={() => navigate("match")}>
                      <Text style={{ fontSize: 12, color: T.primary, fontFamily: FONT_BOLD }}>Browse all →</Text>
                    </TouchableOpacity>
                  }
                />
                {myDogs.length > 1 && (
                  <View style={{ marginBottom: 12 }}>
                    <MyDogSelector dogs={myDogs} activeId={activeDog?.id} onSelect={setActiveDogId} />
                  </View>
                )}
              </View>
              {top.loading ? (
                <Loading />
              ) : top.error ? (
                <ErrorView message={top.error} onRetry={() => top.reload()} />
              ) : (top.data ?? []).length === 0 ? (
                <Card style={{ marginHorizontal: 20 }}>
                  <EmptyState
                    icon={Search}
                    title="No compatible dogs yet"
                    message={`No ${activeDog?.sex === "male" ? "female" : "male"} dogs are listed yet. Check back soon — you'll be alerted when a compatible match joins.`}
                  />
                </Card>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 6 }}>
                  {(top.data ?? []).map((m, i) => (
                    <MatchCard
                      key={m.dog.id}
                      match={m}
                      width={270}
                      banner={i === 0 ? `Top Match for ${activeDog?.name}` : undefined}
                      onView={() => navigate("match-profile", { dogId: m.dog.id })}
                      onRequest={() => navigate("send-request", { dogId: m.dog.id })}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}

        <View style={{ paddingHorizontal: 20 }}>
          <SectionTitle
            title="Recent Activity"
            right={
              notifications.length > 0 ? (
                <TouchableOpacity onPress={() => navigate("notifications")}>
                  <Text style={{ fontSize: 12, color: T.primary, fontFamily: FONT_BOLD }}>See all →</Text>
                </TouchableOpacity>
              ) : undefined
            }
          />
          {notifications.length === 0 ? (
            <Text style={{ color: T.medium, fontFamily: FONT, fontSize: 13 }}>
              No activity yet. Requests, messages and verification results will appear here.
            </Text>
          ) : (
            <View style={{ gap: 10 }}>
              {notifications.slice(0, 4).map((n) => (
                <Card key={n.id} onPress={() => openNotification(n)} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: T.primaryLight, alignItems: "center", justifyContent: "center" }}>
                    <Bell size={16} color={T.primary} strokeWidth={1.75} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: T.dark, fontFamily: n.read ? FONT : FONT_BOLD }}>{n.title}</Text>
                    <Text style={{ fontSize: 12, marginTop: 2, color: T.medium, fontFamily: FONT }} numberOfLines={2}>
                      {n.body}
                    </Text>
                    <Text style={{ fontSize: 11, marginTop: 4, color: T.light, fontFamily: FONT }}>{timeAgo(n.created_at)}</Text>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Dot() {
  return (
    <View
      style={{
        position: "absolute",
        top: -3,
        right: -4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: T.error,
        borderWidth: 1.5,
        borderColor: T.white,
      }}
    />
  );
}

/* ── Browse / Search (Figure 12, FR4) ───────────────────────────── */
const SIZES: Size[] = ["small", "medium", "large"];

export function MatchScreen() {
  const { navigate, myDogs, activeDog, setActiveDogId } = useApp();
  const session = useSession();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [size, setSize] = useState<Size | null>(null);
  const district = districtOf(session.user.location);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const dogs = useAsync(
    () =>
      api.browseDogs({
        excludeOwnerId: session.user.id,
        search: debounced,
        sex: activeDog ? (activeDog.sex === "male" ? "female" : "male") : undefined,
        size: size ?? undefined,
        verifiedOnly,
        location: nearMe ? (district ?? "Davao") : undefined,
      }),
    [debounced, verifiedOnly, nearMe, size, activeDog?.id, district],
  );

  const ranked: RankedMatch[] = useMemo(() => {
    const scored = api.scoreDogs(activeDog, dogs.data ?? []);
    return activeDog ? scored.sort((a, b) => b.compatibility.exact - a.compatibility.exact) : scored;
  }, [dogs.data, activeDog]);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: Math.max(insets.top, 16) + 8, paddingBottom: 12, backgroundColor: T.white, gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 14,
              height: 46,
              borderRadius: 12,
              backgroundColor: T.bg,
              borderWidth: 1,
              borderColor: T.border,
            }}
          >
            <Search size={18} color={T.medium} strokeWidth={1.5} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search dogs, breeds, colors..."
              placeholderTextColor={T.light}
              style={{ flex: 1, fontSize: 14, color: T.dark, fontFamily: FONT }}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            onPress={() => navigate("filter")}
            accessibilityRole="button" accessibilityLabel="Open breeding matcher"
            style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: T.primary, alignItems: "center", justifyContent: "center" }}
          >
            <SlidersHorizontal size={20} color="#fff" strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="Verified" icon={ShieldCheck} active={verifiedOnly} onPress={() => setVerifiedOnly((v) => !v)} />
          <Chip label={district ? `Near Me (${district})` : "Near Me"} icon={MapPin} active={nearMe} onPress={() => setNearMe((v) => !v)} />
          {SIZES.map((s) => (
            <Chip key={s} label={s[0].toUpperCase() + s.slice(1)} icon={Ruler} active={size === s} onPress={() => setSize(size === s ? null : s)} />
          ))}
          <Chip label="Requests" icon={MessageCircle} onPress={() => navigate("requests")} />
        </ScrollView>
        {myDogs.length > 1 && <MyDogSelector dogs={myDogs} activeId={activeDog?.id} onSelect={setActiveDogId} />}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => dogs.reload(true)} tintColor={T.primary} />}
        keyboardShouldPersistTaps="handled"
      >
        {activeDog ? (
          <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>
            Showing {activeDog.sex === "male" ? "female" : "male"} dogs ranked by compatibility with {activeDog.name}.
          </Text>
        ) : (
          <NoDogPrompt />
        )}
        {dogs.loading ? (
          <Loading />
        ) : dogs.error ? (
          <ErrorView message={dogs.error} onRetry={() => dogs.reload()} />
        ) : ranked.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No dogs found"
            message="Try a different search or remove some filters."
          />
        ) : (
          ranked.map((m, i) => (
            <MatchCard
              key={m.dog.id}
              match={m}
              banner={activeDog && i === 0 && !debounced ? `Top Match for ${activeDog.name}` : undefined}
              onView={() => navigate("match-profile", { dogId: m.dog.id })}
              onRequest={() => navigate("send-request", { dogId: m.dog.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ── Breeding Matcher (Figure 11) ───────────────────────────────── */
type Prefs = { breed: string; color: string; size: Size | "any"; temperament: string; verifiedOnly: boolean };
const EMPTY_PREFS: Prefs = { breed: "", color: "", size: "any", temperament: "", verifiedOnly: false };

export function FilterScreen() {
  const { navigate, goBack, myDogs, activeDog, setActiveDogId } = useApp();
  const [prefs, setPrefs] = useState<Prefs>(EMPTY_PREFS);
  const [results, setResults] = useState<RankedMatch[] | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const run = async () => {
    if (!activeDog) return;
    setLoading(true);
    setError(undefined);
    try {
      const preferences: MatchPreferences = {
        breed: prefs.breed || undefined,
        color: prefs.color && prefs.color !== "Mixed / Multiple colors" ? prefs.color : undefined,
        size: prefs.size,
        temperament: prefs.temperament || undefined,
        verifiedOnly: prefs.verifiedOnly,
      };
      const { results: r } = await api.recommendMatches(activeDog, preferences, 3);
      setResults(r);
      setSelectedDogId(r[0]?.dog.id ?? null);
    } catch (e) {
      setError(api.errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPrefs(EMPTY_PREFS);
    setResults(null);
    setSelectedDogId(null);
    setError(undefined);
  };

  const label = (text: string, Icon: typeof PawPrint) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <Icon size={15} color={T.dark} strokeWidth={1.75} />
      <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT_BOLD }}>{text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header
        title="Breeding Matcher"
        subtitle="Enter your ideal traits, then choose from the top 3 dogs."
        onBack={goBack}
        right={
          <TouchableOpacity
            onPress={reset}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: T.primaryLight }}
          >
            <RefreshCw size={14} color={T.primaryDark} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: T.primaryDark, fontFamily: FONT_BOLD }}>Reset</Text>
          </TouchableOpacity>
        }
      />

      {myDogs.length === 0 ? (
        <NoDogPrompt />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <Card style={{ gap: 4 }}>
            <MyDogSelector dogs={myDogs} activeId={activeDog?.id} onSelect={(id) => { setActiveDogId(id); setResults(null); }} label="Find a partner for" />
            {activeDog && (
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, marginTop: 8 }}>
                Only {activeDog.sex === "male" ? "female" : "male"} dogs are considered — sex compatibility is a
                biological requirement for breeding.
              </Text>
            )}
          </Card>

          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Search size={16} color={T.dark} strokeWidth={1.8} />
              <Text style={{ fontSize: 15, color: T.dark, fontFamily: FONT_BOLD }}>Tell us what you want</Text>
            </View>

            {label("Breed", PawPrint)}
            <BreedInput value={prefs.breed} onChange={(v) => update("breed", v)} placeholder="Any breed — e.g. Shih Tzu" />

            {label("Color", Palette)}
            <ColorCombobox value={prefs.color} onChange={(v) => update("color", v)} placeholder="Any color" />

            {label("Height / Build", Ruler)}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
              {(["any", ...SIZES] as const).map((s) => (
                <Chip key={s} label={s === "any" ? "Any" : s[0].toUpperCase() + s.slice(1)} active={prefs.size === s} onPress={() => update("size", s)} />
              ))}
            </ScrollView>

            {label("Temperament", Heart)}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
              <Chip label="Any" active={!prefs.temperament} onPress={() => update("temperament", "")} />
              {TEMPERAMENT_OPTIONS.map((t) => (
                <Chip key={t} label={t} active={prefs.temperament === t} onPress={() => update("temperament", t)} />
              ))}
            </ScrollView>

            {label("Verification", ShieldCheck)}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 18 }}>
              <Chip label="Any dog" active={!prefs.verifiedOnly} onPress={() => update("verifiedOnly", false)} />
              <Chip label="Verified only" active={prefs.verifiedOnly} onPress={() => update("verifiedOnly", true)} />
            </View>

            <Btn title="Show my 3 best matches" icon={Sparkles} loading={loading} disabled={!activeDog} onPress={run} />
          </Card>

          {error ? (
            <ErrorView message={error} onRetry={run} />
          ) : results === null ? (
            <Card style={{ gap: 6 }}>
              <Text style={{ fontSize: 16, color: T.dark, fontFamily: FONT_BOLD }}>Ready when you are.</Text>
              <Text style={{ fontSize: 13, lineHeight: 18, color: T.medium, fontFamily: FONT }}>
                Tap the button above and the three most compatible dogs will appear here.
              </Text>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <EmptyState
                icon={Plus}
                title="No dogs match these traits"
                message="Loosen a filter (for example breed or color) and try again."
              />
            </Card>
          ) : (
            <FloatingMatchResults
              matches={results}
              forDogName={activeDog?.name ?? "your dog"}
              selectedDogId={selectedDogId}
              onSelectDog={setSelectedDogId}
              onViewDog={(m) => navigate("match-profile", { dogId: m.dog.id })}
              onRequestDog={(m) => navigate("send-request", { dogId: m.dog.id })}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
