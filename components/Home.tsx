import {
  Award,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Eye,
  FileText,
  Heart,
  MapPin,
  Palette,
  PawPrint,
  RefreshCw,
  Ruler,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  TrendingUp,
} from "lucide-react-native";
import { ComponentType, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Btn,
  Chip,
  FONT,
  MOCK_DOGS,
  ScoreBar,
  T,
  useV3,
  VeriBadge,
} from "../contexts/AppContext";
import { FloatingMatchResults, RankedDog } from "./FloatingMatchResults";

type FilterChipConfig = {
  label: string;
  active: boolean;
  Icon: ComponentType<any>;
};

/* ── Match Card ───────────────────────────────────────────────── */
export function MatchCard({
  dog,
  isTop,
  onView,
  onRequest,
}: {
  dog: (typeof MOCK_DOGS)[number];
  isTop?: boolean;
  onView: () => void;
  onRequest: () => void;
}) {
  return (
    <View
      style={{
        width: 260,
        backgroundColor: T.white,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {isTop && (
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: T.amber,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Award size={14} color="#fff" strokeWidth={2} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Top Match for Bella
          </Text>
        </View>
      )}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: dog.img }}
          style={{ width: "100%", height: 160 }}
          resizeMode="cover"
        />
      </View>
      <View style={{ padding: 16, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            {dog.name}
          </Text>
          <VeriBadge verified={dog.verified} tier={dog.tier} />
        </View>
        <Text style={{ fontSize: 12, color: T.medium }}>
          {dog.breed} • {dog.age} • {dog.sex}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {dog.temperament.map((t) => (
            <View
              key={t}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: T.bg,
              }}
            >
              <Text style={{ fontSize: 12, color: T.dark }}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: T.teal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>
              {dog.ownerAvatar}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 12, color: T.medium }}>
              {dog.ownerName} •
            </Text>
            <MapPin size={10} color={T.medium} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: T.medium }}>
              {dog.ownerLocation.split(",")[0]}
            </Text>
          </View>
        </View>
        <ScoreBar score={dog.score} />
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginTop: 4,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Syringe size={12} color={T.teal} strokeWidth={2} />
            <Text style={{ fontSize: 11, color: T.medium }}>Vaccinated</Text>
            <Check size={12} color={T.teal} strokeWidth={2.5} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Stethoscope size={12} color={T.teal} strokeWidth={2} />
            <Text style={{ fontSize: 11, color: T.medium }}>Vet OK</Text>
            <Check size={12} color={T.teal} strokeWidth={2.5} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <FileText size={12} color={T.teal} strokeWidth={2} />
            <Text style={{ fontSize: 11, color: T.medium }}>Pedigree</Text>
            <Check size={12} color={T.teal} strokeWidth={2.5} />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <TouchableOpacity
            onPress={onRequest}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: T.teal,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Send size={14} color="#fff" strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#fff",
                fontFamily: FONT,
              }}
            >
              Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onView}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: T.white,
              borderWidth: 1.5,
              borderColor: T.teal,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Eye size={14} color={T.teal} strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: T.teal,
                fontFamily: FONT,
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ── Home Screen ─────────────────────────────────────────────── */
export function HomeScreen() {
  const { navigate, userName } = useV3();
  const hour = new Date().getHours();
  const g =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const activity = [
    {
      Icon: Award,
      t: "Bella's vaccination card was verified",
      sub: "Dr. Santos confirmed your document",
    },
    {
      Icon: Heart,
      t: "New match request from Max (Golden Retriever)",
      sub: "88% compatibility • Matina, Davao",
    },
    {
      Icon: Calendar,
      t: "Community meetup this Saturday in Davao City",
      sub: "PawMatch Dog Owners Gathering",
    },
    {
      Icon: Star,
      t: "You received a 5-star reputation review",
      sub: "From Carlo Reyes • Bruno's owner",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 12,
          backgroundColor: T.white,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <PawPrint size={20} color={T.teal} strokeWidth={2} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: T.teal,
              fontFamily: FONT,
            }}
          >
            PawMatch
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigate("notifications")}
            style={{ position: "relative" }}
          >
            <Bell size={20} color={T.dark} strokeWidth={1.5} />
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: T.coral,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("owner-profile")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: T.teal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
              J
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View
          style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            {g}, {userName}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 2, color: T.medium }}>
            Here's what's new for your dogs today.
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
            flexDirection: "row",
            gap: 12,
          }}
        >
          {[
            { Icon: Heart, n: "3", t: "New Match Requests" },
            { Icon: Check, n: "2", t: "Verified Near You" },
            { Icon: Calendar, n: "1", t: "Event This Week" },
          ].map((s) => (
            <View
              key={s.t}
              style={{
                flex: 1,
                borderRadius: 12,
                padding: 12,
                backgroundColor: T.white,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <s.Icon size={24} color={T.teal} strokeWidth={1.5} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  marginTop: 4,
                  color: T.teal,
                }}
              >
                {s.n}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  textAlign: "center",
                  color: T.medium,
                  lineHeight: 16,
                }}
              >
                {s.t}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              borderRadius: 24,
              padding: 18,
              backgroundColor: T.primary,
              overflow: "hidden",
            }}
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
            <View
              style={{
                position: "absolute",
                right: 18,
                bottom: 14,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.16)",
              }}
            />
            <View style={{ gap: 10 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Sparkles size={18} color="#fff" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                  }}
                >
                  Smart Breeding Match
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 26,
                  fontWeight: "800",
                  color: "#fff",
                  fontFamily: FONT,
                }}
              >
                Build your preferred dog profile and instantly see 3 best
                candidates.
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                Choose breed, color, size or height preference, and temperament.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <Btn onClick={() => navigate("filter")}>Open Matcher</Btn>
                </View>
                <TouchableOpacity
                  onPress={() => navigate("filter")}
                  style={{
                    width: 48,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.6)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={18} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontWeight: "700", color: T.dark, fontFamily: FONT }}
            >
              Your Top Matches Today
            </Text>
            <TouchableOpacity onPress={() => navigate("filter")}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: T.teal }}>
                Open Matcher →
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {MOCK_DOGS.slice(0, 3).map((dog, i) => (
              <MatchCard
                key={dog.id}
                dog={dog}
                isTop={i === 0}
                onView={() => navigate("match-profile", dog)}
                onRequest={() => navigate("send-request", dog)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontWeight: "700",
              marginBottom: 12,
              color: T.dark,
              fontFamily: FONT,
            }}
          >
            Recent Activity
          </Text>
          <View style={{ gap: 10 }}>
            {activity.map((a, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: T.white,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: T.tealLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a.Icon size={18} color={T.teal} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: T.dark }}
                  >
                    {a.t}
                  </Text>
                  <Text style={{ fontSize: 12, marginTop: 2, color: T.medium }}>
                    {a.sub}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Match Discovery Screen ──────────────────────────────────── */
export function MatchScreen() {
  const { navigate } = useV3();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 12,
          backgroundColor: T.white,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              height: 48,
              borderRadius: 12,
              backgroundColor: T.bg,
              borderWidth: 1,
              borderColor: T.border,
            }}
          >
            <Search size={18} color={T.medium} strokeWidth={1.5} />
            <TextInput
              placeholder="Search dogs, breeds..."
              placeholderTextColor={T.medium}
              style={{ flex: 1, fontSize: 14, color: T.dark, fontFamily: FONT }}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigate("filter")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: T.teal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings size={20} color="#fff" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        >
          {(
            [
              { label: "Breed", active: true, Icon: PawPrint },
              { label: "Size", active: false, Icon: TrendingUp },
              { label: "Temp", active: false, Icon: Heart },
              { label: "Verified", active: false, Icon: Check },
              { label: "Near Me", active: false, Icon: MapPin },
            ] satisfies FilterChipConfig[]
          ).map(({ label, active, Icon }) => (
            <TouchableOpacity
              key={String(label)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: active ? T.teal : T.white,
                borderWidth: 1,
                borderColor: active ? T.teal : T.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon
                size={14}
                color={active ? "#fff" : T.dark}
                strokeWidth={1.5}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: active ? "#fff" : T.dark,
                  fontFamily: FONT,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          gap: 16,
          paddingBottom: 80,
        }}
      >
        {MOCK_DOGS.map((dog, i) => (
          <View
            key={dog.id}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: T.white,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {i === 0 && (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  backgroundColor: T.amber,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Award size={14} color="#fff" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Top Match for Bella
                </Text>
              </View>
            )}
            <Image
              source={{ uri: dog.img }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
            <View style={{ padding: 16, gap: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                >
                  {dog.name}
                </Text>
                <VeriBadge verified={dog.verified} tier={dog.tier} />
              </View>
              <Text style={{ fontSize: 14, color: T.medium }}>
                {dog.breed} • {dog.age} • {dog.sex}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {dog.temperament.map((t) => (
                  <View
                    key={t}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: T.bg,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: T.dark }}>{t}</Text>
                  </View>
                ))}
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: T.teal,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}
                  >
                    {dog.ownerAvatar}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 12, color: T.medium }}>
                    {dog.ownerName} •
                  </Text>
                  <MapPin size={10} color={T.medium} strokeWidth={2} />
                  <Text style={{ fontSize: 12, color: T.medium }}>
                    {dog.ownerLocation}
                  </Text>
                </View>
              </View>
              <ScoreBar score={dog.score} />
              <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => navigate("send-request", dog)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: T.teal,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Send size={16} color="#fff" strokeWidth={2} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#fff",
                      fontFamily: FONT,
                    }}
                  >
                    Request Match
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigate("match-profile", dog)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: T.white,
                    borderWidth: 1.5,
                    borderColor: T.teal,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Eye size={16} color={T.teal} strokeWidth={2} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: T.teal,
                      fontFamily: FONT,
                    }}
                  >
                    View Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ── Breeding Matcher Screen ────────────────────────────────── */
type FilterPrefs = {
  breed: string;
  color: string;
  size: string;
  temperament: string;
  sex: string;
};

const FILTER_SIZES = ["Any", "Small", "Medium", "Large"];
const FILTER_SEXES = ["Any", "Male", "Female"];
const FILTER_TEMPERAMENTS = [
  "Any",
  "Friendly",
  "Calm",
  "Playful",
  "Active",
  "Independent",
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function rankDog(
  dog: (typeof MOCK_DOGS)[number],
  prefs: FilterPrefs,
): RankedDog {
  let score = dog.score;
  const reasons: string[] = [];

  const breedPref = normalizeText(prefs.breed);
  const colorPref = normalizeText(prefs.color);
  const temperamentPref = normalizeText(prefs.temperament);
  const sizePref = prefs.size;
  const sexPref = prefs.sex;

  if (breedPref) {
    const breedMatch =
      normalizeText(dog.breed).includes(breedPref) ||
      breedPref.includes(normalizeText(dog.breed));
    score += breedMatch ? 24 : -10;
    reasons.push(breedMatch ? "breed match" : "breed close");
  }

  if (colorPref) {
    const colorMatch =
      normalizeText(dog.color).includes(colorPref) ||
      colorPref.includes(normalizeText(dog.color));
    score += colorMatch ? 16 : -6;
    reasons.push(colorMatch ? "color match" : "color close");
  }

  if (sizePref !== "Any") {
    const sizeMatch = dog.size === sizePref;
    score += sizeMatch ? 14 : -6;
    reasons.push(
      sizeMatch ? `${sizePref} build` : `not ${sizePref.toLowerCase()}`,
    );
  }

  if (temperamentPref !== "Any") {
    const temperamentMatch = dog.temperament.some(
      (item) => normalizeText(item) === temperamentPref,
    );
    score += temperamentMatch ? 18 : -5;
    reasons.push(temperamentMatch ? temperamentPref : "temperament close");
  }

  if (sexPref !== "Any") {
    const sexMatch = dog.sex === sexPref;
    score += sexMatch ? 8 : -4;
    reasons.push(sexMatch ? sexPref : `not ${sexPref.toLowerCase()}`);
  }

  return {
    dog,
    score: Math.max(35, Math.min(99, score)),
    reasons: reasons.slice(0, 3),
  };
}

function FilterChipRow({
  label,
  Icon,
  items,
  value,
  onChange,
}: {
  label: string;
  Icon: any;
  items: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon size={16} color={T.dark} strokeWidth={1.7} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: T.dark,
            fontFamily: FONT,
          }}
        >
          {label}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        {items.map((item) => (
          <Chip
            key={item}
            active={value === item}
            onPress={() => onChange(item)}
          >
            {item}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

export function FilterScreen() {
  const { goBack, navigate } = useV3();
  const [prefs, setPrefs] = useState<FilterPrefs>({
    breed: "",
    color: "",
    size: "Any",
    temperament: "Any",
    sex: "Any",
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  const rankedDogs = MOCK_DOGS.map((dog) => rankDog(dog, prefs))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const updatePref = (key: keyof FilterPrefs, value: string) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  };

  const handleGenerate = () => {
    setShowResults(true);
    if (!selectedDogId && rankedDogs[0]) {
      setSelectedDogId(rankedDogs[0].dog.id);
    }
  };

  const handleReset = () => {
    setPrefs({
      breed: "",
      color: "",
      size: "Any",
      temperament: "Any",
      sex: "Any",
    });
    setShowResults(false);
    setSelectedDogId(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: T.white,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: T.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: T.dark }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Breeding Matcher
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, marginTop: 2 }}>
              Enter your ideal traits, then choose from the top 3 dogs.
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleReset}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: T.primaryLight,
            }}
          >
            <RefreshCw size={14} color={T.primaryDark} strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: T.primaryDark,
                fontFamily: FONT,
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 140,
          gap: 16,
        }}
      >
        <View
          style={{
            borderRadius: 28,
            padding: 18,
            backgroundColor: T.primary,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -18,
              top: -16,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Sparkles size={18} color="#fff" strokeWidth={2} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                Smart UI / UX
              </Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                lineHeight: 28,
                fontWeight: "800",
                color: "#fff",
                fontFamily: FONT,
              }}
            >
              Find the best dog matches based on the traits you want.
            </Text>
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Use the fields below to match breed, color, size or height/build,
              temperament, and sex.
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: 24,
            padding: 16,
            backgroundColor: T.white,
            gap: 14,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Search size={16} color={T.dark} strokeWidth={1.8} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Tell us what you want
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ gap: 8 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <PawPrint size={16} color={T.dark} strokeWidth={1.7} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                >
                  Breed
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  height: 52,
                  backgroundColor: T.bg,
                  borderWidth: 1,
                  borderColor: T.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TextInput
                  value={prefs.breed}
                  onChangeText={(text) => updatePref("breed", text)}
                  placeholder="Example: Shih Tzu or Golden Retriever"
                  placeholderTextColor={T.medium}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                />
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Palette size={16} color={T.dark} strokeWidth={1.7} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                >
                  Color
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  height: 52,
                  backgroundColor: T.bg,
                  borderWidth: 1,
                  borderColor: T.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TextInput
                  value={prefs.color}
                  onChangeText={(text) => updatePref("color", text)}
                  placeholder="Example: white, black, golden, brown"
                  placeholderTextColor={T.medium}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: T.dark,
                    fontFamily: FONT,
                  }}
                />
              </View>
            </View>

            <FilterChipRow
              label="Height / Build"
              Icon={Ruler}
              items={FILTER_SIZES}
              value={prefs.size}
              onChange={(value) => updatePref("size", value)}
            />
            <FilterChipRow
              label="Temperament"
              Icon={Heart}
              items={FILTER_TEMPERAMENTS}
              value={prefs.temperament}
              onChange={(value) => updatePref("temperament", value)}
            />
            <FilterChipRow
              label="Sex"
              Icon={Settings}
              items={FILTER_SEXES}
              value={prefs.sex}
              onChange={(value) => updatePref("sex", value)}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
            <View style={{ flex: 1 }}>
              <Btn onClick={handleGenerate}>Show my 3 best matches</Btn>
            </View>
            <TouchableOpacity
              onPress={handleReset}
              style={{
                width: 52,
                borderRadius: 16,
                backgroundColor: T.white,
                borderWidth: 1.5,
                borderColor: T.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RefreshCw size={16} color={T.dark} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            borderRadius: 20,
            padding: 14,
            backgroundColor: T.white,
            borderWidth: 1,
            borderColor: T.border,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: T.dark,
              fontFamily: FONT,
              marginBottom: 8,
            }}
          >
            Current focus
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <Chip active={prefs.breed.length > 0}>
              {prefs.breed || "Any breed"}
            </Chip>
            <Chip active={prefs.color.length > 0}>
              {prefs.color || "Any color"}
            </Chip>
            <Chip active={prefs.size !== "Any"}>
              {prefs.size === "Any" ? "Any height" : prefs.size}
            </Chip>
            <Chip active={prefs.temperament !== "Any"}>
              {prefs.temperament === "Any"
                ? "Any temperament"
                : prefs.temperament}
            </Chip>
            <Chip active={prefs.sex !== "Any"}>
              {prefs.sex === "Any" ? "Any sex" : prefs.sex}
            </Chip>
          </ScrollView>
        </View>

        {showResults ? (
          <FloatingMatchResults
            rankedDogs={rankedDogs}
            selectedDogId={selectedDogId}
            onSelectDog={setSelectedDogId}
            onViewDog={(dog: RankedDog["dog"]) =>
              navigate("match-profile", dog)
            }
            onRequestDog={(dog: RankedDog["dog"]) =>
              navigate("send-request", dog)
            }
            onContinueSelectedDog={(dog: RankedDog["dog"]) =>
              navigate("conversation", dog)
            }
          />
        ) : (
          <View
            style={{
              borderRadius: 24,
              padding: 18,
              backgroundColor: T.white,
              borderWidth: 1,
              borderColor: T.border,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: T.dark,
                fontFamily: FONT,
              }}
            >
              Ready when you are.
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 18, color: T.medium }}>
              Tap the main button above and the three strongest dogs will appear
              here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
