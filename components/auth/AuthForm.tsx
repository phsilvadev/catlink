"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";

type Props = { mode: "login" | "cadastro" };
export default function AuthForm({ mode }: Props) {
  const signup = mode === "cadastro";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const result = (signup ? signUpSchema : signInSchema).safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[String(issue.path[0])] ??= issue.message;
      });
      setFieldErrors(errors);
      const first = result.error.issues[0]?.path[0];
      if (first)
        event.currentTarget
          .querySelector<HTMLInputElement>(`[name="${String(first)}"]`)
          ?.focus();
      return;
    }
    setPending(true);
    try {
      const { email, password } = result.data;
      const response = signup
        ? await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0].slice(0, 80),
          })
        : await authClient.signIn.email({
            email,
            password,
            rememberMe: form.get("remember") === "on",
          });
      if (response.error) {
        if (response.error.status === 429)
          setError("Muitas tentativas. Aguarde um pouco e tente novamente.");
        else if (response.error.status === 503 || response.error.status >= 500)
          setError(
            "Não foi possível conectar ao serviço. Tente novamente em instantes.",
          );
        else if (signup)
          setError(
            "Não foi possível criar a conta. Confira seus dados ou tente entrar se já possui uma conta.",
          );
        else
          setError(
            "E-mail ou senha incorretos. Confira seus dados e tente novamente.",
          );
        return;
      }
      router.replace("/app");
      router.refresh();
    } catch {
      setError(
        "Não foi possível conectar. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50";
  return (
    <>
      <div className="mb-9 text-center lg:text-left">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          {signup ? "Crie sua conta" : "Boas-vindas de volta"}
        </h1>
        <p className="leading-relaxed text-gray-500">
          {signup
            ? "Seu próximo capítulo começa com um link."
            : "Entre para continuar criando seu Catlink."}
        </p>
      </div>
      <form
        onSubmit={submit}
        noValidate
        className="space-y-5"
        aria-busy={pending}
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <div className="relative">
            <Mail
              size={19}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3.5 text-gray-400"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="voce@exemplo.com"
              required
              maxLength={254}
              disabled={pending}
              className={inputClass}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <div className="relative">
            <LockKeyhole
              size={19}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3.5 text-gray-400"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder={
                signup ? "Crie uma senha segura" : "Digite sua senha"
              }
              required
              minLength={signup ? 8 : undefined}
              maxLength={128}
              disabled={pending}
              className={inputClass}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password
                  ? "password-error"
                  : signup
                    ? "password-help"
                    : undefined
              }
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
          </div>
          {fieldErrors.password ? (
            <p id="password-error" className="mt-2 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          ) : (
            signup && (
              <p id="password-help" className="mt-2 text-xs text-gray-500">
                Use de 8 a 128 caracteres.
              </p>
            )
          )}
        </div>
        {!signup && (
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="remember"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={pending}
            />
            Lembrar de mim
          </label>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-relaxed text-red-700"
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
        >
          {pending && (
            <LoaderCircle
              size={18}
              className="animate-spin"
              aria-hidden="true"
            />
          )}
          {pending
            ? signup
              ? "Criando sua conta…"
              : "Entrando…"
            : signup
              ? "Criar conta"
              : "Entrar"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        {signup ? "Já tem uma conta? " : "Ainda não tem uma conta? "}
        <Link
          href={signup ? "/login" : "/cadastro"}
          className="rounded font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {signup ? "Entrar" : "Crie sua conta grátis"}
        </Link>
      </p>
    </>
  );
}
