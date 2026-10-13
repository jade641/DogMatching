import { CheckCircle, Mail, Phone, Search, ShieldCheck, ShieldOff, UserCheck, XCircle } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { APPLICATION_STATUS, applicationStatus, FONT, FONT_BOLD, FONT_MEDIUM, formatDate, T, timeAgo } from "../constants/theme";
import { useApp, useSession } from "../contexts/AppContext";
import { useAsync } from "../hooks/useAsync";
import * as api from "../services/api";
import type { ApplicationStatus, VerifierApplication } from "../types";
import { Avatar, Btn, Card, confirmAction, EmptyState, ErrorView, Header, InfoRow, Loading, SectionTitle, showMessage, Tag } from "./ui";

/** All applications, refreshed when an admin alert arrives. */
function useApplications() {
  const { lastNotification } = useApp();
  return useAsync(() => api.listVerifierApplications(), [lastNotification?.id]);
}

function ApplicationCard({ a }: { a: VerifierApplication }) {
  const { navigate } = useApp();
  const status = APPLICATION_STATUS[applicationStatus(a)];
  return (
    <Card onPress={() => navigate("admin-verifier-detail", { verifierId: a.id })} style={{ flexDirection: "row", gap: 12 }}>
      <Avatar name={a.name} size={48} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Text style={{ fontSize: 15, color: T.dark, fontFamily: FONT_BOLD, flexShrink: 1 }} numberOfLines={1}>
            {a.name}
          </Text>
          <Tag label={status.label} tone={status.tone} />
        </View>
        <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT_MEDIUM }} numberOfLines={1}>
          {a.role}
          {a.clinic ? ` • ${a.clinic}` : ""}
        </Text>
        <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT }} numberOfLines={1}>
          License: {a.license_number || "not provided"}
        </Text>
        <Text style={{ fontSize: 11, color: T.light, fontFamily: FONT }}>Applied {timeAgo(a.created_at)}</Text>
      </View>
    </Card>
  );
}

/* ── Application queue ──────────────────────────────────────────── */
export function AdminVerifiers() {
  const { goBack, canGoBack } = useApp();
  const apps = useApplications();
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("pending");
  const [search, setSearch] = useState("");
  const all = apps.data ?? [];
  const query = search.trim().toLowerCase();
  const list = all
    .filter((a) => filter === "all" || applicationStatus(a) === filter)
    .filter((a) => `${a.name} ${a.email} ${a.clinic} ${a.license_number}`.toLowerCase().includes(query));
  const filters: { id: "all" | ApplicationStatus; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Not Approved" },
    { id: "all", label: "All" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header title="Verifier Applications" subtitle="Veterinarians and breeders" icon={ShieldCheck} onBack={canGoBack ? goBack : undefined} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, backgroundColor: T.white }} contentContainerStyle={{ gap: 8, padding: 12, paddingHorizontal: 20 }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f.id ? T.primary : T.bg }}
          >
            <Text style={{ fontSize: 13, color: filter === f.id ? "#fff" : T.dark, fontFamily: FONT_BOLD }}>
              {f.label}
              {f.id !== "all" ? ` (${all.filter((a) => applicationStatus(a) === f.id).length})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, height: 46, borderRadius: 12, borderWidth: 1, borderColor: T.border, backgroundColor: T.white }}>
          <Search size={18} color={T.medium} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, email, clinic or license"
            placeholderTextColor={T.light}
            autoCapitalize="none"
            style={{ flex: 1, fontSize: 14, color: T.dark, fontFamily: FONT }}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => apps.reload(true)} tintColor={T.primary} />}
      >
        {apps.loading ? (
          <Loading />
        ) : apps.error ? (
          <ErrorView message={apps.error} onRetry={() => apps.reload()} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title={filter === "pending" && !query ? "No applications waiting" : "No applications found"}
            message={filter === "pending" && !query ? "New veterinarian and breeder sign-ups will appear here and you'll get an alert." : "Nothing matches this filter."}
          />
        ) : (
          list.map((a) => <ApplicationCard key={a.id} a={a} />)
        )}
      </ScrollView>
    </View>
  );
}

/* ── Review one application ─────────────────────────────────────── */
export function AdminVerifierDetail() {
  const { goBack, params, showToast } = useApp();
  const session = useSession();
  const verifierId: string = params.verifierId;
  const apps = useApplications();
  const [notes, setNotes] = useState("");
  const [deciding, setDeciding] = useState<"approve" | "reject" | null>(null);

  const a = apps.data?.find((x) => x.id === verifierId);

  if (apps.loading || !a) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <Header title="Application" onBack={goBack} />
        {apps.loading ? <Loading /> : <ErrorView message={apps.error ?? "Application not found."} onRetry={() => apps.reload()} />}
      </View>
    );
  }

  const statusId = applicationStatus(a);
  const status = APPLICATION_STATUS[statusId];
  const isSelf = a.user_id === session.user.id;

  const decide = (decision: "approve" | "reject") => {
    if (decision === "reject" && !notes.trim()) {
      showMessage("Remarks required", "Tell the applicant why, so they know what to fix.");
      return;
    }
    const revoking = decision === "reject" && statusId === "approved";
    confirmAction(
      decision === "approve" ? `Approve ${a.name}?` : revoking ? "Revoke approval?" : "Reject application?",
      decision === "approve"
        ? `Owners will be able to choose ${a.name} to verify their dogs' documents.`
        : revoking
          ? `${a.name} will no longer appear to owners or be able to review documents. They'll see your remarks.`
          : `${a.name} will be notified with your remarks. They can re-submit by correcting their license number.`,
      decision === "approve" ? "Approve" : revoking ? "Revoke" : "Reject",
      async () => {
        setDeciding(decision);
        try {
          await api.reviewVerifier(a.id, decision, notes);
          showToast(decision === "approve" ? "Verifier approved" : revoking ? "Approval revoked" : "Application rejected", "The applicant has been notified.", "success");
          setNotes("");
          await apps.reload(true);
        } catch (e) {
          showMessage("Couldn't save decision", api.errorMessage(e));
        } finally {
          setDeciding(null);
        }
      },
      decision === "reject",
    );
  };

  const openLink = (url: string) => Linking.openURL(url).catch(() => showMessage("Couldn't open", url.replace(/^\w+:/, "")));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header title="Application" subtitle={a.role} icon={ShieldCheck} onBack={goBack} />
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => apps.reload(true)} tintColor={T.primary} />}
      >
        <Card style={{ alignItems: "center", gap: 4 }}>
          <Avatar name={a.name} size={72} />
          <Text style={{ fontSize: 19, color: T.dark, fontFamily: FONT_BOLD, marginTop: 8, textAlign: "center" }}>{a.name}</Text>
          <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT }}>
            {a.role} • {a.location}
          </Text>
          <View style={{ marginTop: 6 }}>
            <Tag label={status.label} tone={status.tone} />
          </View>
        </Card>

        <Card style={{ gap: 4 }}>
          <SectionTitle title="Credentials" />
          <InfoRow label="License No." value={a.license_number || "Not provided"} />
          <InfoRow label={a.role === "Certified Breeder" ? "Kennel" : "Clinic"} value={a.clinic || "—"} />
          <InfoRow label="Applied" value={formatDate(a.created_at)} />
          <InfoRow label="Documents reviewed" value={a.documents_reviewed} last />
          <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, lineHeight: 18, marginTop: 6 }}>
            {a.role === "Certified Breeder"
              ? "Ask for a copy of their kennel club certificate and check that the name and number match."
              : "Look up the license number with the PRC and check that the name matches."}
          </Text>
        </Card>

        <Card style={{ gap: 4 }}>
          <SectionTitle title="Contact" />
          <InfoRow label="Email" value={a.email} />
          <InfoRow label="Phone" value={a.phone ?? "—"} last />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <Btn title="Email" icon={Mail} variant="outline" size="small" onPress={() => openLink(`mailto:${a.email}`)} style={{ flex: 1 }} />
            {a.phone ? <Btn title="Call" icon={Phone} variant="outline" size="small" onPress={() => openLink(`tel:${a.phone}`)} style={{ flex: 1 }} /> : null}
          </View>
        </Card>

        {a.reviewed_at && (
          <Card style={{ gap: 6 }}>
            <SectionTitle title="Last decision" />
            <Text style={{ fontSize: 14, color: T.dark, fontFamily: FONT_MEDIUM }}>
              {status.label} on {formatDate(a.reviewed_at)}
              {a.reviewer_name ? ` by ${a.reviewer_name}` : ""}
            </Text>
            {a.review_notes ? <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT }}>Remarks: {a.review_notes}</Text> : null}
          </Card>
        )}

        {isSelf ? (
          <Card>
            <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 19 }}>
              This is your own application. Another administrator has to review it.
            </Text>
          </Card>
        ) : (
          <Card style={{ gap: 12 }}>
            <SectionTitle title="Your decision" />
            {statusId !== "rejected" && (
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder={
                  statusId === "approved"
                    ? "Reason for revoking (required) — the verifier will see this"
                    : "Remarks (required when rejecting) — e.g. license number not found"
                }
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
            )}
            {statusId === "pending" ? (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Btn title="Approve" icon={CheckCircle} loading={deciding === "approve"} disabled={!!deciding} onPress={() => decide("approve")} style={{ flex: 1 }} />
                <Btn title="Reject" icon={XCircle} variant="danger" loading={deciding === "reject"} disabled={!!deciding} onPress={() => decide("reject")} style={{ flex: 1 }} />
              </View>
            ) : statusId === "approved" ? (
              <Btn title="Revoke approval" icon={ShieldOff} variant="danger" loading={deciding === "reject"} disabled={!!deciding} onPress={() => decide("reject")} />
            ) : (
              <>
                <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, lineHeight: 19 }}>
                  The applicant can re-submit by correcting their license number. You can also approve now if this was a mistake.
                </Text>
                <Btn title="Approve" icon={CheckCircle} variant="outline" loading={deciding === "approve"} disabled={!!deciding} onPress={() => decide("approve")} />
              </>
            )}
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
