import { Award, Bell, Calendar, Check, Eye, FileText, Filter, Heart, MapPin, PawPrint, Search, Send, Settings, Star, Stethoscope, Syringe, TrendingUp } from "lucide-react-native";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
    Chip,
    FONT,
    MOCK_DOGS,
    ScoreBar,
    T,
    useV3,
    VeriBadge
} from "../contexts/AppContext";

/* ── Match Card ───────────────────────────────────────────────── */
export function MatchCard({
  dog,
  isTop,
  onView,
  onRequest,
}: {
  dog: (typeof MOCK_DOGS)[0];
  isTop?: boolean;
  onView: () => void;
  onRequest: () => void;
}) {
  return (
    <View style={{ width: 260, backgroundColor: T.white, borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
      {isTop && (
        <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: T.amber, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Award size={14} color="#fff" strokeWidth={2} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff", textAlign: "center" }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: T.dark, fontFamily: FONT }}>
            {dog.name}
          </Text>
          <VeriBadge verified={dog.verified} tier={dog.tier} />
        </View>
        <Text style={{ fontSize: 12, color: T.medium }}>
          {dog.breed} • {dog.age} • {dog.sex}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {dog.temperament.map((t) => (
            <View key={t} style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: T.bg }}>
              <Text style={{ fontSize: 12, color: T.dark }}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>{dog.ownerAvatar}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
            <Text style={{ fontSize: 12, color: T.medium }}>{dog.ownerName} •</Text>
            <MapPin size={10} color={T.medium} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: T.medium }}>{dog.ownerLocation.split(",")[0]}</Text>
          </View>
        </View>
        <ScoreBar score={dog.score} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4, alignItems: "center" }}>
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
            style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
          >
            <Send size={14} color="#fff" strokeWidth={2} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff", fontFamily: FONT }}>
              Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onView}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: T.white, borderWidth: 1.5, borderColor: T.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
          >
            <Eye size={14} color={T.teal} strokeWidth={2} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: T.teal, fontFamily: FONT }}>
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
      {/* Top bar */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 48, paddingBottom: 12, backgroundColor: T.white }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <PawPrint size={20} color={T.teal} strokeWidth={2} />
          <Text style={{ fontSize: 18, fontWeight: "700", color: T.teal, fontFamily: FONT }}>
            PawMatch
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => navigate("notifications")} style={{ position: "relative" }}>
            <Bell size={20} color={T.dark} strokeWidth={1.5} />
            <View style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: T.coral }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("owner-profile")} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: T.teal, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>J</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Greeting */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: T.dark, fontFamily: FONT }}>
            {g}, {userName}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 2, color: T.medium }}>
            Here's what's new for your dogs today.
          </Text>
        </View>

        {/* Quick stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20, flexDirection: "row", gap: 12 }}>
          {[
            { Icon: Heart, n: "3", t: "New Match Requests" },
            { Icon: Check, n: "2", t: "Verified Near You" },
            { Icon: Calendar, n: "1", t: "Event This Week" },
          ].map((s) => (
            <View
              key={s.t}
              style={{ flex: 1, borderRadius: 12, padding: 12, backgroundColor: T.white, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
            >
              <s.Icon size={24} color={T.teal} strokeWidth={1.5} />
              <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 4, color: T.teal }}>
                {s.n}
              </Text>
              <Text style={{ fontSize: 12, marginTop: 2, textAlign: "center", color: T.medium, lineHeight: 16 }}>
                {s.t}
              </Text>
            </View>
          ))}
        </View>

        {/* Top Matches */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", color: T.dark, fontFamily: FONT }}>
              Your Top Matches Today
            </Text>
            <TouchableOpacity onPress={() => navigate("match")}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: T.teal }}>
                See All →
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
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

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontWeight: "700", marginBottom: 12, color: T.dark, fontFamily: FONT }}>
            Recent Activity
          </Text>
          <View style={{ gap: 10 }}>
            {activity.map((a, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, backgroundColor: T.white, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: T.tealLight, alignItems: "center", justifyContent: "center" }}>
                  <a.Icon size={18} color={T.teal} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: T.dark }}>
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
      {/* Search + filter */}
      <View style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 12, backgroundColor: T.white }}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, height: 48, borderRadius: 12, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border }}>
            <Search size={18} color={T.medium} strokeWidth={1.5} />
            <TextInput
              placeholder="Search dogs, breeds..."
              placeholderTextColor={T.medium}
              style={{ flex: 1, fontSize: 14, color: T.dark, fontFamily: FONT }}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigate("filter")}
            style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", justifyContent: "center" }}
          >
            <Settings size={20} color="#fff" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {[
            ["Breed", true, PawPrint],
            ["Size", false, TrendingUp],
            ["Temp", false, Heart],
            ["Verified", false, Check],
            ["Near Me", false, MapPin],
          ].map(([l, a, Icon]) => (
            <TouchableOpacity 
              key={String(l)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: a ? T.teal : T.white,
                borderWidth: 1,
                borderColor: a ? T.teal : T.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 6
              }}
            >
              {/* @ts-ignore */}
              <Icon size={14} color={a ? "#fff" : T.dark} strokeWidth={1.5} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: a ? "#fff" : T.dark, fontFamily: FONT }}>
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Match cards vertical scroll */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 16, paddingBottom: 80 }}>
        {MOCK_DOGS.map((dog, i) => (
          <View
            key={dog.id}
            style={{ borderRadius: 16, overflow: "hidden", backgroundColor: T.white, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}
          >
            {i === 0 && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: T.amber, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Award size={14} color="#fff" strokeWidth={2} />
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff", textAlign: "center" }}>
                  Top Match for Bella
                </Text>
              </View>
            )}
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: dog.img }}
                style={{ width: "100%", height: 180 }}
                resizeMode="cover"
              />
            </View>
            <View style={{ padding: 16, gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: T.dark, fontFamily: FONT }}>
                  {dog.name}
                </Text>
                <VeriBadge verified={dog.verified} tier={dog.tier} />
              </View>
              <Text style={{ fontSize: 14, color: T.medium }}>
                {dog.breed} • {dog.age} • {dog.sex}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {dog.temperament.map((t) => (
                  <View key={t} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: T.bg }}>
                    <Text style={{ fontSize: 12, color: T.dark }}>{t}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>{dog.ownerAvatar}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                  <Text style={{ fontSize: 12, color: T.medium }}>{dog.ownerName} •</Text>
                  <MapPin size={10} color={T.medium} strokeWidth={2} />
                  <Text style={{ fontSize: 12, color: T.medium }}>{dog.ownerLocation}</Text>
                </View>
              </View>
              <ScoreBar score={dog.score} />
              <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => navigate("send-request", dog)}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Send size={16} color="#fff" strokeWidth={2} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff", fontFamily: FONT }}>
                    Request Match
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigate("match-profile", dog)}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: T.white, borderWidth: 1.5, borderColor: T.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                >
                  <Eye size={16} color={T.teal} strokeWidth={2} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: T.teal, fontFamily: FONT }}>
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

/* ── Search & Filter Screen ──────────────────────────────────── */
export function FilterScreen() {
  const { goBack, navigate } = useV3();

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
          <Settings size={18} color={T.dark} strokeWidth={1.5} />
          <Text style={{ fontSize: 16, fontWeight: "700", color: T.dark, fontFamily: FONT }}>
            Filter Matches
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: "600", color: T.coral, fontFamily: FONT }}>
            Reset All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 24, paddingBottom: 120 }}>
        {/* Breed */}
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <PawPrint size={16} color={T.dark} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: T.dark }}>
              Breed
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[
              "Labrador",
              "Aspin",
              "Shih Tzu",
              "German Shepherd",
              "Poodle",
              "Golden Retriever",
            ].map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </View>
        </View>
        {/* Size */}
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <TrendingUp size={16} color={T.dark} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: T.dark }}>
              Size
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["Small", "Medium", "Large", "Extra Large"].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </View>
        </View>
        {/* Age */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Calendar size={16} color={T.dark} strokeWidth={1.5} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: T.dark }}>
                Age Range
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "600", color: T.teal }}>
              6mo — 8 yrs
            </Text>
          </View>
          <View style={{ height: 4, backgroundColor: T.light, borderRadius: 2 }}>
            <View style={{ width: "60%", height: "100%", backgroundColor: T.teal, borderRadius: 2 }} />
          </View>
        </View>
        {/* Sex */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 12, color: T.dark }}>
            Sex
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["Male", "Female", "Any"].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </View>
        </View>
        {/* Temperament */}
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Heart size={16} color={T.dark} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: T.dark }}>
              Temperament
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[
              "Friendly",
              "Calm",
              "Active",
              "Playful",
              "Independent",
            ].map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </View>
        </View>
        {/* Verified toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 12, backgroundColor: T.white, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Award size={20} color={T.teal} strokeWidth={1.5} />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: T.dark }}>
                Verified Only
              </Text>
              <Text style={{ fontSize: 12, color: T.medium }}>
                Show only expert-verified dogs
              </Text>
            </View>
          </View>
          <View style={{ width: 48, height: 24, borderRadius: 12, backgroundColor: T.teal, flexDirection: "row", alignItems: "center", paddingHorizontal: 4 }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff", marginLeft: "auto" }} />
          </View>
        </View>
        {/* Distance */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MapPin size={16} color={T.dark} strokeWidth={1.5} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: T.dark }}>
                Distance
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "600", color: T.teal }}>
              Within 15 km
            </Text>
          </View>
          <View style={{ height: 4, backgroundColor: T.light, borderRadius: 2 }}>
            <View style={{ width: "30%", height: "100%", backgroundColor: T.teal, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 12, marginTop: 4, color: T.medium }}>
            of Davao City center
          </Text>
        </View>
      </ScrollView>
      <View style={{ position: "absolute", bottom: 80, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: T.white, borderTopWidth: 1, borderTopColor: T.border }}>
        <TouchableOpacity
          onPress={() => navigate("match")}
          style={{ width: "100%", paddingVertical: 14, borderRadius: 12, backgroundColor: T.teal, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
        >
          <Filter size={16} color="#fff" strokeWidth={2} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff", fontFamily: FONT }}>
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
