import { AuthForm } from "@/components/auth/auth-form";
import { AuthPage } from "@/components/auth/auth-page";
export default function SignupPage() {
  return <AuthPage title="Create your workspace" description="Start with five launch generations per month."><AuthForm mode="signup"/></AuthPage>;
}
