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
  AddDog,
  DogProfile,
  MatchProfileScreen,
  OwnerProfile,
  RequestReceived,
  SendRequest
} from "../components/Profile";
import { VerifyChoose, VerifyStatus, VerifyUpload } from "../components/Verify";
import { useV3 } from "../contexts/AppContext";
import { Shell } from "../navigation/Shell";
import Landing from "./Landing";

function PageRenderer() {
  const { screen } = useV3();

  const pages: Record<string, React.ReactNode> = {
    // AUTH SCREENS (NO BOTTOM NAV)
    landing: <Landing onLaunch={() => { }} />,
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
    "add-dog": <AddDog />,
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
  const currentPage = pages[screen] || <Landing onLaunch={() => { }} />;

  return <Shell>{currentPage}</Shell>;
}

export default function Index() {
  return <PageRenderer />;
}
