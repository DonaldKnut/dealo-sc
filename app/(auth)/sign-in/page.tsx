import SignInClient from "./_components/SignInClient";

export const dynamic = "force-dynamic";

// No server-side getServerSession: on Netlify it can hang (cold start / DB) and prevent the page from loading.
// "Already signed in" redirect is handled client-side in SignInClient so the page always loads.
export default function SignInPage() {
  return <SignInClient />;
}
