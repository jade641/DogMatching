import type { ReactNode } from "react";
import { BootScreen, ForgotPassword, Landing, Login, Register, ResetPassword, SetupRequired, VerifyEmail } from "../components/Auth";
import {
  ChangePasswordScreen,
  EditProfileScreen,
  NotificationsScreen,
  ReputationScreen,
  SettingsScreen,
} from "../components/Community";
import { ConversationScreen, RequestsScreen } from "../components/Conversation";
import { FilterScreen, HomeScreen, MatchScreen } from "../components/Home";
import { AddDog, DogProfile, EditDog, MatchProfileScreen, OwnerProfile, SendRequest } from "../components/Profile";
import { Loading } from "../components/ui";
import { AuditTrailScreen, VerifyChoose, VerifyStatus, VerifyUpload } from "../components/Verify";
import { VetDashboard, VetProfile, VetRequestDetail, VetRequests, VetRecords, VetSettings } from "../components/Veterinarian";
import { useApp } from "../contexts/AppContext";
import { Shell } from "../navigation/Shell";
import type { Screen } from "../types";

const PUBLIC_SCREENS: Partial<Record<Screen, () => ReactNode>> = {
  boot: () => <BootScreen />,
  "setup-required": () => <SetupRequired />,
  landing: () => <Landing />,
  login: () => <Login />,
  register: () => <Register />,
  "forgot-password": () => <ForgotPassword />,
  "reset-password": () => <ResetPassword />,
  "verify-email": () => <VerifyEmail />,
};

const OWNER_SCREENS: Partial<Record<Screen, () => ReactNode>> = {
  home: () => <HomeScreen />,
  match: () => <MatchScreen />,
  filter: () => <FilterScreen />,
  "match-profile": () => <MatchProfileScreen />,
  "send-request": () => <SendRequest />,
  conversation: () => <ConversationScreen />,
  requests: () => <RequestsScreen />,
  "dog-profile": () => <DogProfile />,
  "add-dog": () => <AddDog />,
  "edit-dog": () => <EditDog />,
  "owner-profile": () => <OwnerProfile />,
  "verify-upload": () => <VerifyUpload />,
  "verify-choose": () => <VerifyChoose />,
  "verify-status": () => <VerifyStatus />,
  reputation: () => <ReputationScreen />,
};

const VET_SCREENS: Partial<Record<Screen, () => ReactNode>> = {
  "vet-dashboard": () => <VetDashboard />,
  "vet-requests": () => <VetRequests />,
  "vet-request-detail": () => <VetRequestDetail />,
  "vet-records": () => <VetRecords />,
  "vet-profile": () => <VetProfile />,
  "vet-settings": () => <VetSettings />,
};

const SHARED_SCREENS: Partial<Record<Screen, () => ReactNode>> = {
  notifications: () => <NotificationsScreen />,
  settings: () => <SettingsScreen />,
  "edit-profile": () => <EditProfileScreen />,
  "change-password": () => <ChangePasswordScreen />,
  "audit-trail": () => <AuditTrailScreen />,
};

function PageRenderer() {
  const { screen, params, session } = useApp();

  const publicPage = PUBLIC_SCREENS[screen];
  if (publicPage) return <>{publicPage()}</>;

  // Signed-in screens never render without a session (e.g. mid sign-out).
  if (!session) return <Loading />;

  const isOwner = !!session.owner;
  const isVerifier = !!session.verifier;
  const page =
    SHARED_SCREENS[screen] ?? (isOwner ? OWNER_SCREENS[screen] : undefined) ?? (isVerifier ? VET_SCREENS[screen] : undefined);

  if (!page) return isVerifier && !isOwner ? <VetDashboard /> : <HomeScreen />;
  // Remount screens when their params change so data reloads.
  return <PageKey key={`${screen}:${JSON.stringify(params)}`}>{page()}</PageKey>;
}

function PageKey({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function Index() {
  return (
    <Shell>
      <PageRenderer />
    </Shell>
  );
}
