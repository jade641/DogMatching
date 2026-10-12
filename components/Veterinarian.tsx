import * as WebBrowser from "expo-web-browser";
import {
  Bell,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  KeyRound,
  LogOut,
  MapPin,
  Search,
  Settings,
  ShieldAlert,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { capitalize, docLabel, FONT, FONT_BOLD, FONT_MEDIUM, formatAge, formatDate, shadow, SUBMISSION_STATUS, T, timeAgo } from "../constants/theme";
import { useApp, useSession } from "../contexts/AppContext";
import { useAsync } from "../hooks/useAsync";
import * as api from "../services/api";
import type { Submission, SubmissionStatus } from "../types";
import {
  Avatar,
  Btn,
  Card,
  confirmAction,
  DogImage,
  EmptyState,
  ErrorView,
  Field,
  Header,
  InfoRow,
  ListItem,
  Loading,
  SectionTitle,
  showMessage,
  Tag,
  VeriBadge,
} from "./ui";

/** Verifier's submission queue, refreshed live as owners submit documents. */
function useQueue() {
  const { lastNotification } = useApp();
  const session = useSession();
  const queue = useAsync(() => api.listVerifierQueue(session.user.id), [session.user.id, lastNotification?.id]);
  useEffect(
    () => api.subscribeToSubmissions(`verifier_user_id=eq.${session.user.id}`, () => queue.reload(true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session.user.id],
  );
  return queue;
}

function PendingApprovalBanner() {
  const session = useSession();
  if (session.verifier?.approved) return null;
  return (
    <View style={{ flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, backgroundColor: T.warningLight, borderWidth: 1, borderColor: T.secondary }}>
      <ShieldAlert size={22} color={T.warning} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_BOLD }}>Account pending approval</Text>
        <Text style={{ fontSize: 12, color: T.dark, fontFamily: FONT, lineHeight: 18 }}>
          The PawMatch team is checking your license ({session.verifier?.license_number || "not provided"}). Owners can
          send you documents once your account is approved.
        </Text>
      </View>
    </View>
  );
}

function SubmissionCard({ s }: { s: Submission }) {
  const { navigate } = useApp();
  const status = SUBMISSION_STATUS[s.status];
  return (
    <Card onPress={() => navigate("vet-request-detail", { submissionId: s.id })} style={{ flexDirection: "row", gap: 12 }}>
      <DogImage uri={s.dog?.img} width={58} height={58} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Text style={{ fontSize: 15, color: T.dark, fontFamily: FONT_BOLD, flexShrink: 1 }} numberOfLines={1}>
            {s.dog?.name ?? "Deleted dog"}
          </Text>
          <Tag label={status.label} tone={status.tone} />
        </View>
        <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT_MEDIUM }}>{docLabel(s.submission_type)}</Text>
        <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }} numberOfLines={1}>
          {s.dog?.breed} • Owner: {s.dog?.owner?.display_name ?? "—"}
        </Text>
        <Text style={{ fontSize: 11, color: T.light, fontFamily: FONT }}>Submitted {timeAgo(s.created_at)}</Text>
      </View>
    </Card>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────── */
export function VetDashboard() {
  const { navigate, unreadCount } = useApp();
  const session = useSession();
  const queue = useQueue();
  const all = queue.data ?? [];
  const today = new Date().toDateString();
  const stats = [
    { Icon: Clock, n: all.filter((s) => s.status === "owner_submitted").length, label: "Pending Reviews", tint: T.primaryLight, color: T.primary },
    { Icon: CheckCircle, n: all.filter((s) => s.status === "vet_verified").length, label: "Verified", tint: T.successLight, color: T.success },
    { Icon: XCircle, n: all.filter((s) => s.status === "verification_failed").length, label: "Rejected", tint: T.errorLight, color: T.error },
    {
      Icon: FileCheck,
      n: all.filter((s) => s.reviewed_at && new Date(s.reviewed_at).toDateString() === today).length,
      label: "Reviewed Today",
      tint: T.accentLight,
      color: T.accent,
    },
  ];
  const pending = all.filter((s) => s.status === "owner_submitted");

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header
        title="Veterinarian Portal"
        subtitle={`Welcome, ${session.verifier?.name ?? session.user.full_name}`}
        icon={Stethoscope}
        right={
          <TouchableOpacity onPress={() => navigate("notifications")} accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={8}>
            <Bell size={21} color={T.dark} strokeWidth={1.6} />
            {unreadCount > 0 && (
              <View style={{ position: "absolute", top: -3, right: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: T.error, borderWidth: 1.5, borderColor: T.white }} />
            )}
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => queue.reload(true)} tintColor={T.primary} />}
      >
        <PendingApprovalBanner />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {stats.map((s) => (
            <View key={s.label} style={{ flexGrow: 1, flexBasis: "45%", backgroundColor: T.white, borderRadius: 16, padding: 16, ...shadow }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: s.tint, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <s.Icon size={19} color={s.color} />
              </View>
              <Text style={{ fontSize: 24, color: T.dark, fontFamily: FONT_BOLD }}>{queue.loading ? "–" : s.n}</Text>
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 16, overflow: "hidden" }}>
          <ListItem icon={ClipboardList} title="Review pending documents" subtitle={`${pending.length} waiting for you`} onPress={() => navigate("vet-requests")} />
          <ListItem icon={FileText} title="Verification records" subtitle="Everything you have approved or rejected" onPress={() => navigate("vet-records")} last />
        </View>

        <View>
          <SectionTitle
            title="Waiting for review"
            right={
              <TouchableOpacity onPress={() => navigate("vet-requests")}>
                <Text style={{ fontSize: 13, color: T.primary, fontFamily: FONT_BOLD }}>View All</Text>
              </TouchableOpacity>
            }
          />
          {queue.loading ? (
            <Loading />
          ) : queue.error ? (
            <ErrorView message={queue.error} onRetry={() => queue.reload()} />
          ) : pending.length === 0 ? (
            <Card>
              <EmptyState icon={CheckCircle} title="All caught up" message="New documents from dog owners will appear here and you'll get an alert." />
            </Card>
          ) : (
            <View style={{ gap: 12 }}>
              {pending.slice(0, 5).map((s) => (
                <SubmissionCard key={s.id} s={s} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Queue ──────────────────────────────────────────────────────── */
export function VetRequests() {
  const { goBack, canGoBack } = useApp();
  const queue = useQueue();
  const [filter, setFilter] = useState<"all" | SubmissionStatus>("owner_submitted");
  const list = (queue.data ?? []).filter((s) => filter === "all" || s.status === filter);
  const filters: { id: "all" | SubmissionStatus; label: string }[] = [
    { id: "owner_submitted", label: "Pending" },
    { id: "vet_verified", label: "Verified" },
    { id: "verification_failed", label: "Failed" },
    { id: "all", label: "All" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Verification Requests" icon={ClipboardList} onBack={canGoBack ? goBack : undefined} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, backgroundColor: T.white }} contentContainerStyle={{ gap: 8, padding: 12, paddingHorizontal: 20 }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f.id ? T.primary : T.bg }}
          >
            <Text style={{ fontSize: 13, color: filter === f.id ? "#fff" : T.dark, fontFamily: FONT_BOLD }}>
              {f.label}
              {f.id !== "all" ? ` (${(queue.data ?? []).filter((s) => s.status === f.id).length})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => queue.reload(true)} tintColor={T.primary} />}
      >
        {queue.loading ? (
          <Loading />
        ) : queue.error ? (
          <ErrorView message={queue.error} onRetry={() => queue.reload()} />
        ) : list.length === 0 ? (
          <EmptyState icon={FileText} title="No requests found" message="Nothing in this list yet." />
        ) : (
          list.map((s) => <SubmissionCard key={s.id} s={s} />)
        )}
      </ScrollView>
    </View>
  );
}

/* ── Review a submission ────────────────────────────────────────── */
export function VetRequestDetail() {
  const { goBack, params, showToast } = useApp();
  const session = useSession();
  const submissionId: string = params.submissionId;
  const submission = useAsync(() => api.getSubmission(submissionId), [submissionId]);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [docError, setDocError] = useState<string>();
  const [notes, setNotes] = useState("");
  const [deciding, setDeciding] = useState<"approve" | "reject" | null>(null);

  const path = submission.data?.document_url;
  const isPdf = !!path && path.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    api
      .getDocumentUrl(path)
      .then((url) => !cancelled && setDocUrl(url))
      .catch((e) => !cancelled && setDocError(api.errorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (submission.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <Header title="Review Document" onBack={goBack} />
        <Loading />
      </View>
    );
  }
  if (submission.error || !submission.data) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <Header title="Review Document" onBack={goBack} />
        <ErrorView message={submission.error ?? "Submission not found."} onRetry={() => submission.reload()} />
      </View>
    );
  }

  const s = submission.data;
  const dog = s.dog;
  const status = SUBMISSION_STATUS[s.status];
  const canReview = s.status === "owner_submitted" && s.verifier_user_id === session.user.id;

  const decide = (decision: "approve" | "reject") => {
    if (decision === "reject" && !notes.trim()) {
      showMessage("Remarks required", "Explain why the document was rejected so the owner can fix it.");
      return;
    }
    confirmAction(
      decision === "approve" ? "Approve document?" : "Reject document?",
      decision === "approve"
        ? `${docLabel(s.submission_type)} for ${dog?.name ?? "this dog"} will be marked Veterinarian Verified. This is recorded in the audit trail and cannot be undone.`
        : "The owner will be notified with your remarks and can re-upload.",
      decision === "approve" ? "Approve" : "Reject",
      async () => {
        setDeciding(decision);
        try {
          await api.reviewSubmission(s.id, decision, notes);
          showToast(decision === "approve" ? "Document verified" : "Document rejected", "The owner has been notified.", "success");
          await submission.reload(true);
        } catch (e) {
          showMessage("Couldn't save decision", api.errorMessage(e));
        } finally {
          setDeciding(null);
        }
      },
      decision === "reject",
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Review Document" subtitle={docLabel(s.submission_type)} icon={FileCheck} onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 12 }}>
          <SectionTitle title="Dog Information" right={<VeriBadge tier={dog?.tier ?? 0} />} />
          <View style={{ flexDirection: "row", gap: 14 }}>
            <DogImage uri={dog?.img} width={80} height={80} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontSize: 18, color: T.dark, fontFamily: FONT_BOLD }}>{dog?.name ?? "Deleted dog"}</Text>
              {dog && (
                <>
                  <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT }}>{dog.breed}</Text>
                  <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>
                    {formatAge(dog.age)} • {capitalize(dog.sex)} • {capitalize(dog.size)} • {dog.color}
                  </Text>
                </>
              )}
            </View>
          </View>
          {dog?.owner && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: T.bg }}>
              <Avatar name={dog.owner.display_name} size={36} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_BOLD }}>{dog.owner.display_name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MapPin size={11} color={T.medium} />
                  <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>{dog.owner.location}</Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        <Card style={{ gap: 10 }}>
          <SectionTitle title={docLabel(s.submission_type)} right={<Tag label={status.label} tone={status.tone} />} />
          <InfoRow label="Submitted" value={formatDate(s.created_at)} />
          {s.reviewed_at && <InfoRow label="Reviewed" value={formatDate(s.reviewed_at)} />}
          {docError ? (
            <ErrorView message={docError} />
          ) : !docUrl ? (
            <Loading message="Loading document…" />
          ) : isPdf ? (
            <Btn title="Open PDF document" icon={ExternalLink} variant="outline" onPress={() => WebBrowser.openBrowserAsync(docUrl)} />
          ) : (
            <>
              <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(docUrl)} activeOpacity={0.9}>
                <Image source={{ uri: docUrl }} style={{ width: "100%", height: 320, borderRadius: 12, backgroundColor: T.bg }} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, textAlign: "center" }}>Tap the image to open it full size</Text>
            </>
          )}
        </Card>

        {canReview ? (
          <Card style={{ gap: 12 }}>
            <SectionTitle title="Your decision" />
            <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 19 }}>
              Check that the document is legible, belongs to this dog, and is complete and current.
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Remarks (required when rejecting) — e.g. photo is blurry, rabies vaccine expired"
              placeholderTextColor={T.light}
              multiline
              maxLength={1000}
              style={{
                minHeight: 90,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: T.border,
                backgroundColor: T.bg,
                padding: 12,
                fontSize: 14,
                color: T.dark,
                fontFamily: FONT,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Btn title="Approve" icon={CheckCircle} loading={deciding === "approve"} disabled={!!deciding} onPress={() => decide("approve")} style={{ flex: 1 }} />
              <Btn title="Reject" icon={XCircle} variant="danger" loading={deciding === "reject"} disabled={!!deciding} onPress={() => decide("reject")} style={{ flex: 1 }} />
            </View>
          </Card>
        ) : (
          <Card style={{ gap: 6 }}>
            <SectionTitle title="Decision" />
            <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_MEDIUM }}>
              {status.label}
              {s.reviewed_at ? ` on ${formatDate(s.reviewed_at)}` : ""}
            </Text>
            {s.notes ? <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT }}>Remarks: {s.notes}</Text> : null}
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Records ────────────────────────────────────────────────────── */
export function VetRecords() {
  const { goBack, canGoBack } = useApp();
  const queue = useQueue();
  const [search, setSearch] = useState("");
  const reviewed = (queue.data ?? [])
    .filter((s) => s.status !== "owner_submitted")
    .filter((s) => `${s.dog?.name ?? ""} ${s.dog?.owner?.display_name ?? ""} ${docLabel(s.submission_type)}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => (b.reviewed_at ?? "").localeCompare(a.reviewed_at ?? ""));

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Verification Records" icon={FileText} onBack={canGoBack ? goBack : undefined} />
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, height: 46, borderRadius: 12, borderWidth: 1, borderColor: T.border, backgroundColor: T.white }}>
          <Search size={18} color={T.medium} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by dog, owner or document"
            placeholderTextColor={T.light}
            style={{ flex: 1, fontSize: 14, color: T.dark, fontFamily: FONT }}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => queue.reload(true)} tintColor={T.primary} />}
      >
        {queue.loading ? (
          <Loading />
        ) : queue.error ? (
          <ErrorView message={queue.error} onRetry={() => queue.reload()} />
        ) : reviewed.length === 0 ? (
          <EmptyState icon={FileText} title="No records found" message="Documents you approve or reject are kept here." />
        ) : (
          reviewed.map((s) => <SubmissionCard key={s.id} s={s} />)
        )}
      </ScrollView>
    </View>
  );
}

/* ── Verifier profile ───────────────────────────────────────────── */
export function VetProfile() {
  const { navigate, refreshSession, showToast } = useApp();
  const session = useSession();
  const v = session.verifier;
  const queue = useQueue();
  const [editing, setEditing] = useState(false);
  const [clinic, setClinic] = useState(v?.clinic ?? "");
  const [license, setLicense] = useState(v?.license_number ?? "");
  const [saving, setSaving] = useState(false);

  if (!v) return <ErrorView message="This account has no verifier profile." />;

  const reviewed = (queue.data ?? []).filter((s) => s.status !== "owner_submitted").length;

  const toggleAvailable = async (available: boolean) => {
    try {
      await api.updateVerifierProfile(session.user.id, { available });
      await refreshSession();
    } catch (e) {
      showMessage("Couldn't update availability", api.errorMessage(e));
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.updateVerifierProfile(session.user.id, { clinic: clinic.trim(), license_number: license.trim() });
      await refreshSession();
      setEditing(false);
      showToast("Professional details updated", undefined, "success");
    } catch (e) {
      showMessage("Couldn't save", api.errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header
        title="Veterinarian Profile"
        icon={Stethoscope}
        right={
          <TouchableOpacity onPress={() => navigate("vet-settings")} accessibilityRole="button" accessibilityLabel="Settings" hitSlop={8}>
            <Settings size={20} color={T.dark} strokeWidth={1.6} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ alignItems: "center", paddingVertical: 22, backgroundColor: T.white, gap: 4 }}>
          <Avatar name={v.name} size={80} />
          <Text style={{ fontSize: 20, color: T.dark, fontFamily: FONT_BOLD, marginTop: 10 }}>{v.name}</Text>
          <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT }}>
            {v.role} • {session.user.location}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            {v.approved ? <CheckCircle size={14} color={T.success} /> : <Clock size={14} color={T.warning} />}
            <Text style={{ fontSize: 13, color: v.approved ? T.success : T.warning, fontFamily: FONT_BOLD }}>
              {v.approved ? "Approved verifier" : "Pending approval"}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20, gap: 16 }}>
          <PendingApprovalBanner />

          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_BOLD }}>Available for reviews</Text>
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>Owners see you as {v.available ? "Available" : "Busy"}.</Text>
            </View>
            <Switch value={v.available} onValueChange={toggleAvailable} trackColor={{ true: T.primary, false: T.light }} thumbColor={T.white} />
          </Card>

          <Card style={{ gap: 4 }}>
            <SectionTitle
              title="Professional Information"
              icon={FileText}
              right={
                !editing ? (
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Text style={{ fontSize: 13, color: T.primary, fontFamily: FONT_BOLD }}>Edit</Text>
                  </TouchableOpacity>
                ) : undefined
              }
            />
            {editing ? (
              <>
                <Field label="Clinic / Kennel" value={clinic} onChangeText={setClinic} />
                <Field label="License / Certification No." value={license} onChangeText={setLicense} autoCapitalize="characters" />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Btn title="Cancel" variant="outline" onPress={() => setEditing(false)} style={{ flex: 1 }} />
                  <Btn title="Save" loading={saving} onPress={save} style={{ flex: 1 }} />
                </View>
              </>
            ) : (
              <>
                <InfoRow label="License No." value={v.license_number || "—"} />
                <InfoRow label="Clinic" value={v.clinic || "—"} />
                <InfoRow label="Email" value={session.user.email} />
                <InfoRow label="Phone" value={session.user.phone ?? "—"} last />
              </>
            )}
          </Card>

          <Card style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, color: T.primary, fontFamily: FONT_BOLD }}>{reviewed}</Text>
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>Documents reviewed</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, color: T.primary, fontFamily: FONT_BOLD }}>{v.rating > 0 ? v.rating.toFixed(1) : "—"}</Text>
              <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }}>Average rating</Text>
            </View>
          </Card>

          <View style={{ borderRadius: 16, overflow: "hidden" }}>
            <ListItem icon={ClipboardList} title="Verification Requests" onPress={() => navigate("vet-requests")} />
            <ListItem icon={FileText} title="Verification Records" onPress={() => navigate("vet-records")} last />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Verifier settings ──────────────────────────────────────────── */
export function VetSettings() {
  const { navigate, goBack, signOut } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Settings" icon={Settings} onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
          <ListItem icon={Bell} title="Notifications" subtitle="Alerts for new documents" onPress={() => navigate("notifications")} />
          <ListItem icon={User} title="Edit Profile" subtitle="Name, phone and location" onPress={() => navigate("edit-profile")} />
          <ListItem icon={KeyRound} title="Change Password" onPress={() => navigate("change-password")} />
          <ListItem icon={HelpCircle} title="Help & About" onPress={() => navigate("settings")} last />
        </View>
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
          <ListItem
            icon={LogOut}
            title="Log Out"
            subtitle="Sign out of your veterinarian account"
            danger
            last
            right={<ChevronRight size={18} color={T.light} />}
            onPress={() => confirmAction("Log out?", "You'll need to sign in again to review documents.", "Log Out", signOut)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
