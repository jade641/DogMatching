import type { ApplicationStatus, DocType, RequestStatus, SubmissionStatus } from "../types";

/* ── Design tokens ─────────────────────────────────────────────── */
export const T = {
  primary: "#FF7043",
  primaryLight: "#FFE8E3",
  primaryDark: "#D84315",

  secondary: "#FFB84D",
  secondaryLight: "#FFF3E0",
  secondaryDark: "#E69500",

  accent: "#4A90E2",
  accentLight: "#E3F2FD",
  accentDark: "#2E5C8A",

  success: "#2E9E5B",
  successLight: "#E6F6EC",
  warning: "#B26A00",
  warningLight: "#FFF3E0",
  error: "#D93025",
  errorLight: "#FDECEA",

  dark: "#2C2C2A",
  medium: "#76746D",
  light: "#C9C7BD",
  bg: "#F5F5F5",
  white: "#FFFFFF",
  border: "#E6E4DF",
  star: "#F59E0B",
};

export const FONT = "Roboto_400Regular";
export const FONT_MEDIUM = "Roboto_500Medium";
export const FONT_BOLD = "Roboto_700Bold";

export const shadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
} as const;

/* ── Localisation: Davao City districts ────────────────────────── */
export const DAVAO_DISTRICTS = [
  "Poblacion",
  "Talomo",
  "Agdao",
  "Buhangin",
  "Bunawan",
  "Paquibato",
  "Baguio",
  "Calinan",
  "Marilog",
  "Toril",
  "Tugbok",
] as const;

export const DEFAULT_LOCATION = "Davao City";

export function districtLocation(district: string) {
  return district === DEFAULT_LOCATION ? DEFAULT_LOCATION : `${district}, Davao City`;
}

export function districtOf(location: string | null | undefined): string | null {
  if (!location) return null;
  const first = location.split(",")[0].trim();
  return (DAVAO_DISTRICTS as readonly string[]).includes(first) ? first : null;
}

/* ── Verification documents (paper Figure 16) ──────────────────── */
export const DOC_TYPES: { type: DocType; label: string; short: string; required: boolean }[] = [
  { type: "vaccination", label: "Vaccination Card", short: "Vaccinated", required: true },
  { type: "health_clearance", label: "Veterinary Health Clearance", short: "Vet OK", required: false },
  { type: "pedigree", label: "Pedigree Certificate", short: "Pedigree", required: false },
  { type: "dna", label: "DNA / Genetic Test Result", short: "DNA", required: false },
];

export function docLabel(type: DocType) {
  return DOC_TYPES.find((d) => d.type === type)?.label ?? type;
}

export const TIER_DESCRIPTIONS = [
  "Not yet verified — upload a vaccination card to earn Tier 1.",
  "Tier 1 — vaccination card verified by a veterinarian.",
  "Tier 2 — vaccination and health clearance verified.",
  "Tier 3 — vaccination, health clearance and pedigree or DNA verified.",
];

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const SUBMISSION_STATUS: Record<SubmissionStatus, { label: string; tone: Tone }> = {
  owner_submitted: { label: "Owner Submitted", tone: "warning" },
  vet_verified: { label: "Veterinarian Verified", tone: "success" },
  verification_failed: { label: "Verification Failed", tone: "danger" },
};

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Not Approved", tone: "danger" },
};

export function applicationStatus(v: { approved: boolean; reviewed_at: string | null }): ApplicationStatus {
  return v.approved ? "approved" : v.reviewed_at ? "rejected" : "pending";
}

export const REQUEST_STATUS: Record<RequestStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  declined: { label: "Declined", tone: "danger" },
  completed: { label: "Completed", tone: "info" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

/* ── Formatting ────────────────────────────────────────────────── */
export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", ...opts });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
}

export function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return formatDate(iso);
}

export function formatAge(age: number) {
  if (age < 1) {
    const months = Math.round(age * 12);
    return `${months} mo${months === 1 ? "" : "s"}`;
  }
  return `${Number.isInteger(age) ? age : age.toFixed(1)} yr${age === 1 ? "" : "s"}`;
}

export function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function initials(name: string) {
  return (
    name
      .replace(/^(dr\.?|dra\.?)\s+/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}
