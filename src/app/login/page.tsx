import { AuthForm } from "@/components/auth/auth-form";
import { AuthPage } from "@/components/auth/auth-page";
export default function LoginPage() {
  return <AuthPage title="Welcome back" description="Sign in to your LaunchPilot workspace."><AuthForm mode="login"/></AuthPage>;
}
