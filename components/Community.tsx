import Constants from "expo-constants";
import * as Linking from "expo-linking";
import {
  Award,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  FileText,
  Heart,
  HelpCircle,
  Info,
  KeyRound,
  Mail,
  MessageSquare,
  PawPrint,
  Scale,
  Shield,
  Star,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react-native";
import { type ComponentType, useState } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  DAVAO_DISTRICTS,
  DEFAULT_LOCATION,
  districtLocation,
  districtOf,
  FONT,
  FONT_BOLD,
  FONT_MEDIUM,
  formatDate,
  REQUEST_STATUS,
  T,
  timeAgo,
} from "../constants/theme";
import { useApp, useSession } from "../contexts/AppContext";
import { useAsync } from "../hooks/useAsync";
import * as api from "../services/api";
import { WEIGHTS } from "../services/compatibility";
import type { AppNotification, Dog, NotificationType, OwnerProfile } from "../types";
import { Avatar, Btn, Card, Chip, DogImage, EmptyState, ErrorView, Field, Header, ListItem, Loading, showMessage, Stars, Tag, VeriBadge } from "./ui";

/* ── Badges ─────────────────────────────────────────────────────── */
interface BadgeDef {
  Icon: ComponentType<any>;
  label: string;
  hint: string;
  earned: (o: OwnerProfile, dogs: Dog[]) => boolean;
}

const BADGES: BadgeDef[] = [
  { Icon: CheckCircle, label: "Verified Owner", hint: "Get a dog's vaccination card verified", earned: (o) => !!o.verified_at },
  { Icon: Stethoscope, label: "Health Champion", hint: "Reach Tier 2 with any dog", earned: (_, d) => d.some((x) => x.tier >= 2) },
  { Icon: Crown, label: "Pedigree Pro", hint: "Reach Tier 3 with any dog", earned: (_, d) => d.some((x) => x.tier >= 3) },
  { Icon: Heart, label: "First Match", hint: "Complete your first breeding match", earned: (o) => o.completed_matches >= 1 },
  {
    Icon: Award,
    label: "Trusted Breeder",
    hint: "3+ completed matches with a 4.5★ average",
    earned: (o) => o.completed_matches >= 3 && o.review_count >= 3 && o.rating >= 4.5,
  },
  {
    Icon: Calendar,
    label: "Active Member",
    hint: "Be a member for 30 days",
    earned: (o) => Date.now() - new Date(o.created_at).getTime() > 30 * 24 * 3600 * 1000,
  },
];

/* ── Reputation & History (Figure 19) ───────────────────────────── */
export function ReputationScreen() {
  const { navigate, goBack, canGoBack, params, lastNotification } = useApp();
  const session = useSession();
  const userId: string = params.userId ?? session.user.id;
  const isMe = userId === session.user.id;
  const [tab, setTab] = useState<"badges" | "history" | "reviews">("reviews");

  const owner = useAsync(() => api.getOwner(userId), [userId, lastNotification?.id]);
  const reviews = useAsync(() => api.listReviewsFor(userId), [userId, lastNotification?.id]);
  const dogs = useAsync(() => api.listMyDogs(userId), [userId]);
  const history = useAsync(() => (isMe ? api.listMyRequests() : Promise.resolve([])), [isMe]);

  if (owner.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <Header title="Reputation & History" icon={Star} onBack={canGoBack ? goBack : undefined} />
        <Loading />
      </View>
    );
  }
  if (owner.error || !owner.data) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <Header title="Reputation & History" icon={Star} onBack={canGoBack ? goBack : undefined} />
        <ErrorView message={owner.error ?? "This owner profile isn't available."} onRetry={() => owner.reload()} />
      </View>
    );
  }

  const o = owner.data;
  const dogList = dogs.data ?? [];
  const tabs = [
    { id: "badges" as const, label: "Badges", Icon: Award },
    { id: "history" as const, label: isMe ? "History" : "Dogs", Icon: FileText },
    { id: "reviews" as const, label: `Reviews (${o.review_count})`, Icon: MessageSquare },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Reputation & History" icon={Star} onBack={canGoBack ? goBack : undefined} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { owner.reload(true); reviews.reload(true); history.reload(true); }} tintColor={T.primary} />}
      >
        <View style={{ padding: 20, flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: T.white }}>
          <Avatar name={o.display_name} size={64} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ fontSize: 18, color: T.dark, fontFamily: FONT_BOLD }}>{o.display_name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Stars rating={o.rating} />
              <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT_BOLD }}>{o.review_count > 0 ? o.rating.toFixed(1) : "—"}</Text>
            </View>
            <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>
              {o.completed_matches} completed match{o.completed_matches === 1 ? "" : "es"}
              {o.verified_at ? ` • Verified since ${new Date(o.verified_at).getFullYear()}` : " • Not yet verified"}
            </Text>
            <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>{o.location} • Member since {formatDate(o.created_at, { day: undefined })}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", margin: 20, marginBottom: 14, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: T.border }}>
          {tabs.map(({ id, label, Icon }) => (
            <TouchableOpacity
              key={id}
              onPress={() => setTab(id)}
              style={{ flex: 1, paddingVertical: 10, backgroundColor: tab === id ? T.primary : T.white, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
            >
              <Icon size={14} color={tab === id ? "#fff" : T.medium} strokeWidth={1.6} />
              <Text style={{ fontSize: 12, color: tab === id ? "#fff" : T.medium, fontFamily: FONT_BOLD }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {tab === "badges" && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {BADGES.map((b) => {
                const earned = b.earned(o, dogList);
                return (
                  <View
                    key={b.label}
                    style={{
                      width: "48%",
                      padding: 12,
                      borderRadius: 14,
                      backgroundColor: earned ? T.primaryLight : T.white,
                      borderWidth: 1,
                      borderColor: earned ? T.primary + "40" : T.border,
                      gap: 6,
                      opacity: earned ? 1 : 0.6,
                    }}
                  >
                    <b.Icon size={22} color={earned ? T.primary : T.light} strokeWidth={1.6} />
                    <Text style={{ fontSize: 13, color: earned ? T.primaryDark : T.medium, fontFamily: FONT_BOLD }}>{b.label}</Text>
                    <Text style={{ fontSize: 11, color: T.medium, fontFamily: FONT }}>{earned ? "Earned" : b.hint}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {tab === "history" &&
            (isMe ? (
              history.loading ? (
                <Loading />
              ) : (history.data ?? []).length === 0 ? (
                <EmptyState icon={FileText} title="No history yet" message="Your breeding requests and their outcomes will be listed here." />
              ) : (
                (history.data ?? []).map((r) => {
                  const iAmRequester = r.requester_user_id === session.user.id;
                  const other = iAmRequester ? r.dog : r.requester_dog;
                  const status = REQUEST_STATUS[r.status];
                  const Icon = r.status === "completed" || r.status === "accepted" ? CheckCircle : r.status === "pending" ? Clock : XCircle;
                  return (
                    <Card key={r.id} onPress={() => navigate("conversation", { requestId: r.id })} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.primaryLight, alignItems: "center", justifyContent: "center" }}>
                        <Icon size={17} color={T.primary} strokeWidth={1.6} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_MEDIUM }}>
                          {iAmRequester ? "Request to" : "Request from"} {other?.name ?? "a deleted dog"}
                          {other?.breed ? ` (${other.breed})` : ""}
                        </Text>
                        <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>{formatDate(r.created_at)}</Text>
                      </View>
                      <Tag label={status.label} tone={status.tone} />
                    </Card>
                  );
                })
              )
            ) : dogList.length === 0 ? (
              <EmptyState icon={PawPrint} title="No dogs listed" message="This owner hasn't added any dogs yet." />
            ) : (
              dogList.map((d) => (
                <Card key={d.id} onPress={() => navigate("match-profile", { dogId: d.id })} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <DogImage uri={d.img} width={48} height={48} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_BOLD }}>{d.name}</Text>
                    <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>{d.breed}</Text>
                  </View>
                  <VeriBadge tier={d.tier} />
                </Card>
              ))
            ))}

          {tab === "reviews" &&
            (reviews.loading ? (
              <Loading />
            ) : reviews.error ? (
              <ErrorView message={reviews.error} onRetry={() => reviews.reload()} />
            ) : (reviews.data ?? []).length === 0 ? (
              <EmptyState icon={MessageSquare} title="No reviews yet" message="Reviews appear after owners complete a breeding match together." />
            ) : (
              (reviews.data ?? []).map((r) => (
                <Card key={r.id} style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Avatar name={r.reviewer?.display_name ?? "?"} size={40} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_BOLD }}>{r.reviewer?.display_name ?? "PawMatch owner"}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Stars rating={r.rating} size={12} />
                        <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>{formatDate(r.created_at, { day: undefined })}</Text>
                      </View>
                    </View>
                  </View>
                  {r.comment ? <Text style={{ fontSize: 14, lineHeight: 20, color: T.dark, fontFamily: FONT }}>{r.comment}</Text> : null}
                  {r.dog?.name ? <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>re: {r.dog.name}</Text> : null}
                </Card>
              ))
            ))}

          {isMe && (
            <>
              <Btn title="Write a Review" icon={MessageSquare} variant="secondary" onPress={() => navigate("requests")} />
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, textAlign: "center" }}>
                Reviews are written from a conversation once a breeding request has been accepted.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Notifications ──────────────────────────────────────────────── */
const NOTIFICATION_ICONS: Record<NotificationType, ComponentType<any>> = {
  match_request: Heart,
  request_update: CheckCircle,
  message: MessageSquare,
  verification_request: FileText,
  verification_result: Shield,
  review: Star,
  match_alert: PawPrint,
  system: Info,
};

export function NotificationsScreen() {
  const { goBack, canGoBack, notifications, markAllRead, openNotification, reloadNotifications, unreadCount } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await reloadNotifications();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header
        title="Notifications"
        icon={Bell}
        onBack={canGoBack ? goBack : undefined}
        right={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={{ fontSize: 12, color: T.primary, fontFamily: FONT_BOLD }}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={T.primary} />}
      >
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No Notifications" message="You're all caught up! Match requests, messages and verification results will appear here." />
        ) : (
          notifications.map((n: AppNotification) => {
            const Icon = NOTIFICATION_ICONS[n.type] ?? Bell;
            return (
              <Card key={n.id} onPress={() => openNotification(n)} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start", backgroundColor: n.read ? T.white : "#FFF8F5" }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.primaryLight, alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={T.primary} strokeWidth={1.6} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 14, color: T.dark, fontFamily: n.read ? FONT_MEDIUM : FONT_BOLD }}>{n.title}</Text>
                  {n.body ? <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 18 }}>{n.body}</Text> : null}
                  <Text style={{ fontSize: 11, color: T.light, fontFamily: FONT, marginTop: 2 }}>{timeAgo(n.created_at)}</Text>
                </View>
                {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.primary, marginTop: 6 }} />}
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

/* ── Help & About ───────────────────────────────────────────────── */
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "";

export function SettingsScreen() {
  const { goBack, canGoBack, session } = useApp();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const contact = (subject: string) => {
    if (!SUPPORT_EMAIL) {
      showMessage("Support", "Please contact the PawMatch team through your beta tester group chat.");
      return;
    }
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `\n\n---\nApp version: ${version}\nPlatform: ${Platform.OS}\nUser: ${session?.user.email ?? ""}`,
      )}`,
    ).catch(() => showMessage("Support", `Email us at ${SUPPORT_EMAIL}`));
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Help & About" icon={HelpCircle} onBack={canGoBack ? goBack : undefined} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <Card style={{ gap: 8 }}>
          <Text style={{ fontSize: 15, color: T.dark, fontFamily: FONT_BOLD }}>How compatibility is scored</Text>
          <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT, lineHeight: 20 }}>
            PawMatch uses a Weighted Sum Model: breed {WEIGHTS.breed * 100}%, age {WEIGHTS.age * 100}%, sex{" "}
            {WEIGHTS.sex * 100}% and temperament {WEIGHTS.temperament * 100}%.
          </Text>
          <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 20 }}>
            Same breed scores 100, a breed from the same group 70, otherwise 20. Age gaps of up to 1 year score 100, 2
            years 80, 3 years 60 and more 30. Only opposite-sex dogs are recommended. Temperament scores 100 when the
            dogs share traits, 70 when neutral, and 40 when energy levels clash. The top 3 are shown.
          </Text>
        </Card>
        <Card style={{ gap: 8 }}>
          <Text style={{ fontSize: 15, color: T.dark, fontFamily: FONT_BOLD }}>Verification tiers</Text>
          <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT, lineHeight: 20 }}>
            Tier 1: vaccination card verified.{"\n"}Tier 2: plus a veterinary health clearance.{"\n"}Tier 3: plus a pedigree
            certificate or DNA test.
          </Text>
          <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 20 }}>
            Documents are reviewed by licensed veterinarians or certified breeders approved by the PawMatch team. Only
            you and your chosen verifier can open your documents; everyone else sees the badge and the audit trail.
          </Text>
        </Card>
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
          <ListItem icon={Mail} title="Contact support" subtitle={SUPPORT_EMAIL || undefined} onPress={() => contact("PawMatch support")} />
          <ListItem icon={MessageSquare} title="Report a problem or give feedback" onPress={() => contact("PawMatch beta feedback")} />
          <ListItem
            icon={Scale}
            title="Terms & Privacy"
            subtitle="How we handle your data"
            onPress={() =>
              showMessage(
                "Terms & Privacy",
                "PawMatch stores your profile, your dogs' profiles and the documents you submit in order to provide matching and verification. Documents are private to you and the verifier you choose. Do not upload documents you are not authorised to share. This is a beta build for research use by the University of Mindanao PawMatch team.",
              )
            }
            last
          />
        </View>
        <View style={{ alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>PawMatch Mobile • Version {version} (beta)</Text>
          <Text style={{ fontSize: 12, color: T.light, fontFamily: FONT }}>University of Mindanao • Davao City</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Edit profile ───────────────────────────────────────────────── */
export function EditProfileScreen() {
  const { goBack, refreshSession, showToast } = useApp();
  const session = useSession();
  const [name, setName] = useState(session.user.full_name);
  const [phone, setPhone] = useState(session.user.phone ?? "");
  const [district, setDistrict] = useState<string>(districtOf(session.user.location) ?? DEFAULT_LOCATION);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (name.trim().length < 2) {
      showMessage("Name required", "Enter your full name.");
      return;
    }
    setSaving(true);
    try {
      await api.updateMyProfile(name, phone, districtLocation(district));
      await refreshSession();
      showToast("Profile updated", undefined, "success");
      goBack();
    } catch (e) {
      showMessage("Couldn't save", api.errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Edit Profile" icon={User} onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Field label="Full Name" value={name} onChangeText={setName} autoComplete="name" />
        <Field label="Email" value={session.user.email} editable={false} hint="Contact support to change your email address." />
        <Field label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={{ fontSize: 13, color: T.dark, marginBottom: 8, fontFamily: FONT_MEDIUM }}>Location</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {[DEFAULT_LOCATION, ...DAVAO_DISTRICTS].map((d) => (
            <Chip key={d} label={d} active={district === d} onPress={() => setDistrict(d)} />
          ))}
        </View>
        <Btn title="Save Changes" size="large" loading={saving} onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Change password ────────────────────────────────────────────── */
export function ChangePasswordScreen() {
  const { goBack, showToast } = useApp();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      showMessage("Weak password", "Use at least 8 characters with a letter and a number.");
      return;
    }
    if (password !== confirm) {
      showMessage("Passwords don't match", "Re-enter the same password in both fields.");
      return;
    }
    setSaving(true);
    try {
      await api.changePassword(password);
      showToast("Password changed", undefined, "success");
      goBack();
    } catch (e) {
      showMessage("Couldn't change password", api.errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Change Password" icon={KeyRound} onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Field label="New Password" value={password} onChangeText={setPassword} secure autoComplete="new-password" hint="At least 8 characters with a letter and a number" />
        <Field label="Confirm New Password" value={confirm} onChangeText={setConfirm} secure autoComplete="new-password" />
        <Btn title="Update Password" size="large" loading={saving} onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
