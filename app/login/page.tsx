import LoginForm from "@/components/login/LoginForm";

interface LoginPageProps {
  searchParams?: { callbackUrl?: string | string[] };
}

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl =
    typeof searchParams?.callbackUrl === "string"
      ? searchParams.callbackUrl
      : Array.isArray(searchParams?.callbackUrl)
      ? searchParams.callbackUrl[0]
      : "/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
