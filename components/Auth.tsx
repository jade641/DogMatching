import { Check, Heart, KeyRound, Mail, PawPrint, ShieldCheck, Stethoscope, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DAVAO_DISTRICTS,
  DEFAULT_LOCATION,
  districtLocation,
  FONT,
  FONT_BOLD,
  FONT_MEDIUM,
  T,
} from "../constants/theme";
import { homeScreenFor, useApp } from "../contexts/AppContext";
import * as api from "../services/api";
import type { VerifierRole } from "../types";
import { Btn, Chip, ErrorView, Field, showMessage } from "./ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePassword(password: string): string | undefined {
  if (password.length < 8) return "Use at least 8 characters";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number";
  return undefined;
}

function AuthLayout({ children, title, subtitle, icon: Icon = PawPrint }: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon?: typeof PawPrint;
}) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.white }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 24, paddingTop: Math.max(insets.top, 16) + 24, paddingBottom: 40 }}
      >
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: T.primaryLight,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Icon size={34} color={T.primary} strokeWidth={1.75} />
          </View>
          <Text style={{ fontSize: 26, color: T.dark, fontFamily: FONT_BOLD }}>{title}</Text>
          <Text style={{ fontSize: 14, color: T.medium, fontFamily: FONT, marginTop: 6, textAlign: "center" }}>
            {subtitle}
          </Text>
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TextLink({ prefix, label, onPress }: { prefix?: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: "center", paddingVertical: 14 }}>
      <Text style={{ fontSize: 14, color: T.medium, fontFamily: FONT }}>
        {prefix ? `${prefix} ` : ""}
        <Text style={{ color: T.primary, fontFamily: FONT_BOLD }}>{label}</Text>
      </Text>
    </TouchableOpacity>
  );
}

/* ── Boot ───────────────────────────────────────────────────────── */
export function BootScreen() {
  const { bootError, retryBoot } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: T.primary, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <View
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Heart size={54} color="#fff" strokeWidth={2} />
      </View>
      <Text style={{ fontSize: 32, color: "#fff", fontFamily: FONT_BOLD }}>PawMatch</Text>
      <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontFamily: FONT, marginTop: 6 }}>
        Verified. Local. Trusted.
      </Text>
      <View style={{ marginTop: 40, minHeight: 120, alignSelf: "stretch" }}>
        {bootError ? (
          <View style={{ backgroundColor: T.white, borderRadius: 16 }}>
            <ErrorView message={bootError} onRetry={retryBoot} />
          </View>
        ) : (
          <ActivityIndicator color="#fff" size="large" />
        )}
      </View>
    </View>
  );
}

/* ── Backend not configured ─────────────────────────────────────── */
export function SetupRequired() {
  return (
    <AuthLayout title="Setup required" subtitle="PawMatch can't connect to its backend yet." icon={KeyRound}>
      <View style={{ backgroundColor: T.bg, borderRadius: 16, padding: 16, gap: 8 }}>
        <Text style={{ fontFamily: FONT_BOLD, color: T.dark }}>For the development team</Text>
        <Text style={{ fontFamily: FONT, color: T.dark, lineHeight: 20 }}>
          Create a <Text style={{ fontFamily: FONT_BOLD }}>.env</Text> file in the project root with your Supabase
          project URL and anon key, then restart Expo:
        </Text>
        <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 12, color: T.dark }}>
          EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co{"\n"}EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
        </Text>
        <Text style={{ fontFamily: FONT, color: T.medium, lineHeight: 20 }}>
          See BETA-TESTING.md for the full backend setup.
        </Text>
      </View>
    </AuthLayout>
  );
}

/* ── Landing carousel ───────────────────────────────────────────── */
const LANDING_PAGES = [
  {
    icon: Heart,
    title: "Find Your Dog's Perfect Match",
    description: "Smart compatibility scoring for responsible breeding in Davao City.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Health Records",
    description: "Upload documents and get verified by licensed vets or certified breeders.",
  },
  {
    icon: Users,
    title: "Connect with Confidence",
    description: "Reputation pages, badges, and interaction history so you always know who you're dealing with.",
  },
];

export function Landing() {
  const { navigate, markLandingSeen } = useApp();
  const [page, setPage] = useState(0);
  const insets = useSafeAreaInsets();
  const content = LANDING_PAGES[page];
  const Icon = content.icon;
  const last = page === LANDING_PAGES.length - 1;

  const finish = () => {
    markLandingSeen();
    navigate("login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.white, paddingTop: Math.max(insets.top, 16) + 8, paddingBottom: Math.max(insets.bottom, 16) + 8, paddingHorizontal: 24 }}>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity onPress={finish} style={{ padding: 8 }}>
          <Text style={{ fontSize: 16, color: T.medium, fontFamily: FONT_MEDIUM }}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: 190,
            height: 190,
            borderRadius: 32,
            backgroundColor: T.primaryLight,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <Icon size={80} color={T.primary} strokeWidth={1.5} />
        </View>
        <Text style={{ fontSize: 26, lineHeight: 34, color: T.dark, fontFamily: FONT_BOLD, textAlign: "center" }}>
          {content.title}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: T.medium, fontFamily: FONT, textAlign: "center", marginTop: 14 }}>
          {content.description}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        {LANDING_PAGES.map((_, i) => (
          <View
            key={i}
            style={{ height: 8, width: i === page ? 24 : 8, borderRadius: 4, backgroundColor: i === page ? T.primary : T.light }}
          />
        ))}
      </View>
      <Btn title={last ? "Get Started" : "Next →"} size="large" onPress={() => (last ? finish() : setPage(page + 1))} />
    </View>
  );
}

/* ── Login ──────────────────────────────────────────────────────── */
const DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEMO_PASSWORD;
const DEMO_ACCOUNTS = [
  { label: "Dog Owner", email: "demo.owner@pawmatch.app" },
  { label: "Veterinarian", email: "demo.vet@pawmatch.app" },
];

export function Login() {
  const { navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const submit = async () => {
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await api.signIn(email, password);
      // Navigation happens in AppProvider once the session is loaded.
    } catch (e) {
      setLoading(false);
      if (api.isEmailNotConfirmed(e)) {
        const address = email.trim().toLowerCase();
        api.resendSignupCode(address).catch(() => undefined);
        navigate("verify-email", { email: address });
        return;
      }
      showMessage("Sign in failed", api.errorMessage(e));
    }
  };

  const social = async (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    try {
      await api.signInWithProvider(provider);
    } catch (e) {
      showMessage("Sign in failed", api.errorMessage(e));
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your PawMatch account">
      <Field
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.email}
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secure
        autoComplete="password"
        textContentType="password"
        error={errors.password}
        onSubmitEditing={submit}
      />
      <TouchableOpacity onPress={() => navigate("forgot-password", { email })} style={{ alignSelf: "flex-end", marginBottom: 18 }}>
        <Text style={{ color: T.primary, fontFamily: FONT_BOLD, fontSize: 14 }}>Forgot Password?</Text>
      </TouchableOpacity>
      <Btn title="Sign In" size="large" loading={loading} onPress={submit} />

      {api.socialLoginEnabled && (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
            <Text style={{ marginHorizontal: 12, color: T.medium, fontFamily: FONT }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
          </View>
          <View style={{ gap: 12 }}>
            {(["google", "facebook"] as const).map((provider) => (
              <TouchableOpacity
                key={provider}
                onPress={() => social(provider)}
                disabled={!!socialLoading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: provider === "google" ? "rgba(255,99,27,0.3)" : "rgba(0,86,255,0.3)",
                }}
              >
                {socialLoading === provider ? (
                  <ActivityIndicator color={T.primary} />
                ) : (
                  <Image
                    source={provider === "google" ? require("./Logo/google.png") : require("./Logo/facebook.png")}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={{ fontSize: 15, fontFamily: FONT_BOLD, color: provider === "google" ? "#ff631b" : "#0056ff" }}
                >
                  Continue with {provider === "google" ? "Google" : "Facebook"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TextLink prefix="Don't have an account?" label="Sign Up" onPress={() => navigate("register")} />

      {DEMO_PASSWORD ? (
        <View style={{ marginTop: 8, padding: 14, backgroundColor: T.bg, borderRadius: 12, alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 13, color: T.dark, fontFamily: FONT_BOLD }}>Demo Access (beta)</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {DEMO_ACCOUNTS.map((d) => (
              <Chip
                key={d.email}
                label={d.label}
                onPress={() => {
                  setEmail(d.email);
                  setPassword(DEMO_PASSWORD);
                }}
              />
            ))}
          </View>
        </View>
      ) : null}
    </AuthLayout>
  );
}

/* ── Registration (Figure 9) ────────────────────────────────────── */
export function Register() {
  const { navigate } = useApp();
  const [role, setRole] = useState<"owner" | "verifier">("owner");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    district: DEFAULT_LOCATION as string,
    phone: "",
    verifierRole: "Licensed Veterinarian" as VerifierRole,
    clinic: "",
    licenseNumber: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string | undefined> = {};
    if (form.fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address";
    e.password = validatePassword(form.password);
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) e.phone = "Enter a valid mobile number, e.g. 0917 123 4567";
    if (role === "verifier") {
      if (form.clinic.trim().length < 2) e.clinic = "Enter your clinic or kennel";
      if (form.licenseNumber.trim().length < 3) e.licenseNumber = "Enter your PRC license or certification number";
    }
    setErrors(e);
    return Object.values(e).every((v) => !v);
  };

  const submit = async () => {
    if (!validate()) return;
    if (!agree) {
      showMessage("Terms required", "Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      const { needsConfirmation } = await api.signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        location: districtLocation(form.district),
        role,
        verifierRole: form.verifierRole,
        clinic: form.clinic,
        licenseNumber: form.licenseNumber,
      });
      if (needsConfirmation) navigate("verify-email", { email: form.email.trim().toLowerCase() });
      // Otherwise the new session signs the user in automatically.
    } catch (e) {
      showMessage("Registration failed", api.errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join PawMatch" subtitle="Create your account to start matching">
      <Text style={{ fontSize: 13, color: T.dark, marginBottom: 8, fontFamily: FONT_MEDIUM }}>I am a</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
        {(
          [
            { id: "owner", label: "Dog Owner", Icon: PawPrint },
            { id: "verifier", label: "Vet / Breeder", Icon: Stethoscope },
          ] as const
        ).map(({ id, label, Icon }) => (
          <TouchableOpacity
            key={id}
            onPress={() => setRole(id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: role === id }}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 6,
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: role === id ? T.primary : T.border,
              backgroundColor: role === id ? T.primaryLight : T.white,
            }}
          >
            <Icon size={22} color={role === id ? T.primary : T.medium} />
            <Text style={{ fontFamily: FONT_BOLD, color: role === id ? T.primaryDark : T.medium }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Field label="Full Name" value={form.fullName} onChangeText={(v) => set("fullName", v)} placeholder={role === "verifier" ? "e.g. Dr. Patricia Reyes" : "Enter your full name"} autoComplete="name" error={errors.fullName} />
      <Field label="Email Address" value={form.email} onChangeText={(v) => set("email", v)} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" error={errors.email} />
      <Field label="Password" value={form.password} onChangeText={(v) => set("password", v)} placeholder="Create a password" secure autoComplete="new-password" error={errors.password} hint="At least 8 characters with a letter and a number" />
      <Field label="Confirm Password" value={form.confirm} onChangeText={(v) => set("confirm", v)} placeholder="Confirm your password" secure autoComplete="new-password" error={errors.confirm} />

      <Text style={{ fontSize: 13, color: T.dark, marginBottom: 8, fontFamily: FONT_MEDIUM }}>Location</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {[DEFAULT_LOCATION, ...DAVAO_DISTRICTS].map((d) => (
          <Chip key={d} label={d} active={form.district === d} onPress={() => set("district", d)} />
        ))}
      </View>

      <Field label="Phone Number" value={form.phone} onChangeText={(v) => set("phone", v)} placeholder="0917 123 4567" keyboardType="phone-pad" autoComplete="tel" error={errors.phone} />

      {role === "verifier" && (
        <View style={{ backgroundColor: T.bg, borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontSize: 13, color: T.dark, marginBottom: 8, fontFamily: FONT_MEDIUM }}>Professional role</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
            {(["Licensed Veterinarian", "Certified Breeder"] as const).map((r) => (
              <Chip key={r} label={r} active={form.verifierRole === r} onPress={() => set("verifierRole", r)} />
            ))}
          </View>
          <Field label="Clinic / Kennel" value={form.clinic} onChangeText={(v) => set("clinic", v)} placeholder="e.g. Davao Animal Clinic" error={errors.clinic} />
          <Field label="License / Certification No." value={form.licenseNumber} onChangeText={(v) => set("licenseNumber", v)} placeholder="PRC license number" autoCapitalize="characters" error={errors.licenseNumber} />
          <Text style={{ fontSize: 12, color: T.medium, fontFamily: FONT, lineHeight: 18 }}>
            Verifier accounts are reviewed by the PawMatch team before you can receive documents to verify.
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setAgree((a) => !a)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agree }}
        style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 10 }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: agree ? T.primary : T.light,
            backgroundColor: agree ? T.primary : T.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {agree && <Check size={14} color="#fff" strokeWidth={3} />}
        </View>
        <Text style={{ flex: 1, fontSize: 13, color: T.dark, fontFamily: FONT, lineHeight: 18 }}>
          I agree to the Terms of Service and Privacy Policy, including the processing of my dogs' health records for
          verification.
        </Text>
      </TouchableOpacity>

      <Btn title="Create Account" size="large" loading={loading} onPress={submit} style={{ marginTop: 8 }} />
      <TextLink prefix="Already have an account?" label="Sign In" onPress={() => navigate("login")} />
    </AuthLayout>
  );
}

/* ── Confirm email with the emailed code ────────────────────────── */
const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmail() {
  const { params, resetTo, showToast } = useApp();
  const email: string = params.email ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async () => {
    if (!/^\d{6,8}$/.test(code.trim())) {
      setError("Enter the code from the email");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await api.verifySignupCode(email, code);
      showToast("Email confirmed", "Welcome to PawMatch!", "success");
      // AppProvider moves the now signed-in user to their home screen.
    } catch (e) {
      setError(api.errorMessage(e));
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await api.resendSignupCode(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showToast("Code sent", `Check ${email} (and the spam folder).`, "success");
    } catch (e) {
      showMessage("Couldn't resend", api.errorMessage(e));
    }
  };

  return (
    <AuthLayout title="Confirm your email" subtitle={`Enter the code we emailed to ${email || "you"}.`} icon={Mail}>
      <Field
        label="Confirmation Code"
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, ""))}
        placeholder="Code from the email"
        keyboardType="number-pad"
        maxLength={8}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        error={error}
        onSubmitEditing={submit}
      />
      <Btn title="Confirm Email" size="large" loading={loading} onPress={submit} />
      <Text style={{ fontSize: 13, color: T.medium, fontFamily: FONT, textAlign: "center", marginTop: 16, lineHeight: 19 }}>
        Can&apos;t find it? Check your spam or promotions folder. The code expires after 1 hour.
      </Text>
      {cooldown > 0 ? (
        <Text style={{ fontSize: 14, color: T.medium, fontFamily: FONT, textAlign: "center", paddingVertical: 14 }}>
          Resend code in {cooldown}s
        </Text>
      ) : (
        <TextLink prefix="Didn't get the email?" label="Resend code" onPress={resend} />
      )}
      <TextLink label="Back to Sign In" onPress={() => resetTo("login")} />
    </AuthLayout>
  );
}

/* ── Forgot password ────────────────────────────────────────────── */
export function ForgotPassword() {
  const { navigate, goBack, params } = useApp();
  const [email, setEmail] = useState<string>(params.email ?? "");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await api.sendPasswordReset(email);
      navigate("reset-password", { email: email.trim().toLowerCase() });
    } catch (e) {
      showMessage("Couldn't send the code", api.errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password?" subtitle="Enter your email and we'll send you a reset code." icon={Mail}>
      <Field label="Email Address" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" error={error} />
      <Btn title="Send Reset Code" size="large" loading={loading} onPress={submit} />
      <TextLink prefix="Remember your password?" label="Sign In" onPress={goBack} />
    </AuthLayout>
  );
}

/* ── Reset password with emailed code ───────────────────────────── */
export function ResetPassword() {
  const { params, refreshSession, resetTo, showToast } = useApp();
  const email: string = params.email ?? "";
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async () => {
    const e: Record<string, string | undefined> = {};
    if (!/^\d{6,8}$/.test(code.trim())) e.code = "Enter the code from the email";
    e.password = validatePassword(password);
    if (confirm !== password) e.confirm = "Passwords do not match";
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setLoading(true);
    try {
      await api.resetPasswordWithCode(email, code, password);
      const s = await refreshSession();
      showToast("Password updated", "You're signed in with your new password.", "success");
      resetTo(s ? homeScreenFor(s) : "login");
    } catch (err) {
      showMessage("Reset failed", api.errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await api.sendPasswordReset(email);
      showToast("Code sent", `Check ${email} for a new code.`, "success");
    } catch (e) {
      showMessage("Couldn't resend", api.errorMessage(e));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle={`Enter the code we emailed to ${email || "you"} and choose a new password.`} icon={KeyRound}>
      <Field label="Reset Code" value={code} onChangeText={setCode} placeholder="Code from the email" keyboardType="number-pad" maxLength={8} autoComplete="one-time-code" textContentType="oneTimeCode" error={errors.code} />
      <Field label="New Password" value={password} onChangeText={setPassword} placeholder="Enter a new password" secure autoComplete="new-password" error={errors.password} hint="At least 8 characters with a letter and a number" />
      <Field label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="Confirm your new password" secure error={errors.confirm} />
      <Btn title="Reset Password" size="large" loading={loading} onPress={submit} />
      <TextLink prefix="Didn't get the email?" label={resending ? "Sending…" : "Resend code"} onPress={resend} />
      <TextLink label="Back to Sign In" onPress={() => resetTo("login")} />
    </AuthLayout>
  );
}
