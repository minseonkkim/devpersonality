import { redirect } from "next/navigation";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) throw new Error("GITHUB_CLIENT_ID is not set");

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "read:user,public_repo",
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`,
  });

  redirect(`https://github.com/login/oauth/authorize?${params}`);
}
