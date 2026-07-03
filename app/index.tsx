import { Login, Onboarding, Register, Splash } from "../components/Auth";
import {
    EmptyMatches,
    EmptyNotifications,
    EmptyVerify,
    EventsScreen,
    NotificationsScreen,
    ReputationScreen,
    SettingsScreen,
} from "../components/Community";
import { ConversationScreen } from "../components/Conversation";
import { FilterScreen, HomeScreen, MatchScreen } from "../components/Home";
import {
    DogProfile,
    MatchProfileScreen,
    OwnerProfile,
    RequestReceived,
    SendRequest,
} from "../components/Profile";
import { VerifyChoose, VerifyStatus, VerifyUpload } from "../components/Verify";
import { useV3 } from "../contexts/AppContext";
import { Shell } from "../navigation/Shell";
import Landing from "./Landing";

/**
 * 🚀 PAGE RENDERER COMPONENT
 *
 * Ito ang nag-handle ng lahat ng screens sa app.
 * Uses the useV3 hook to get current screen state.
 *
 * FLOW:
 * 1. Get current screen from context (useV3)
 * 2. Show LANDING PAGE first (universal component)
 * 3. From landing, user can navigate to onboarding/login
 * 4. Wrap main screens sa Shell (bottom navigation)
 *
 * DEFAULT SCREEN: "landing" - Landing page ang UNA lumabas! ✅
 */
function PageRenderer() {
  const { screen } = useV3();

  const pages: Record<string, React.ReactNode> = {
    // AUTH SCREENS (NO BOTTOM NAV)
    landing: <Landing onLaunch={() => {}} />,
    splash: <Splash />,
    onboarding: <Onboarding />,
    register: <Register />,
    login: <Login />,
    // MAIN SCREENS (WITH BOTTOM NAV)
    home: <HomeScreen />,
    match: <MatchScreen />,
    filter: <FilterScreen />,
    "match-profile": <MatchProfileScreen />,
    "send-request": <SendRequest />,
    conversation: <ConversationScreen />,
    "request-received": <RequestReceived />,
    // Profile
    "dog-profile": <DogProfile />,
    "owner-profile": <OwnerProfile />,
    // Verify
    "verify-upload": <VerifyUpload />,
    "verify-choose": <VerifyChoose />,
    "verify-status": <VerifyStatus />,
    // Community
    reputation: <ReputationScreen />,
    notifications: <NotificationsScreen />,
    events: <EventsScreen />,
    settings: <SettingsScreen />,
    // Empty states
    "empty-matches": <EmptyMatches />,
    "empty-notif": <EmptyNotifications />,
    "empty-verify": <EmptyVerify />,
  };

  // Get the current page, default to landing if not found
  const currentPage = pages[screen] || <Landing onLaunch={() => {}} />;

  return <Shell>{currentPage}</Shell>;
}

/**
 * 🚀 MAIN APP EXPORT
 *
 * This is the entry point for Expo Router.
 * app/_layout.tsx wraps this with V3Provider and ThemeProvider.
 *
 * DEFAULT SCREEN: Landing page will show first! ✅
 */
export default function Index() {
  return <PageRenderer />;
}
