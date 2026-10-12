import { Redirect } from "expo-router";

// OAuth providers redirect to pawmatch://auth-callback; the session itself is
// handled in services/api.ts, so this route only returns to the app.
export default function AuthCallback() {
  return <Redirect href="/" />;
}
