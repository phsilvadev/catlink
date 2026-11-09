import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
export const metadata: Metadata = { title: "Criar conta | Catlink" };
export default function SignUpPage() {
  return <AuthForm mode="cadastro" />;
}
