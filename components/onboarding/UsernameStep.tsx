"use client";
import Link from "next/link";
import { Check, CheckCircle2, Info, LoaderCircle, XCircle } from "lucide-react";
import { useState, type FormEvent, type RefObject } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import AuthBrand from "@/components/auth/AuthBrand";
import UsernameShowcase from "./UsernameShowcase";
import { useSlugAvailability } from "./useSlugAvailability";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  error: string;
  conflict: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  serverTaken?: boolean;
};
export default function UsernameStep({
  value,
  onChange,
  onSubmit,
  busy,
  error,
  conflict,
  heading,
  serverTaken = false,
}: Props) {
  const [editVersion, setEditVersion] = useState(0);
  const { status: checkedStatus, retry } = useSlugAvailability(
    value,
    editVersion,
  );
  const status = serverTaken ? "taken" : checkedStatus;
  const available = status === "available",
    invalid = status === "taken" || status === "invalid";
  return (
    <div className="flex min-h-screen bg-surface-light font-sans text-gray-800 selection:bg-primary selection:text-white">
      <UsernameShowcase />
      <main className="relative flex min-w-0 flex-1 flex-col items-center justify-center p-6 lg:p-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <AuthBrand />
        </div>
        <div className="absolute right-6 top-6 lg:hidden">
          <SignOutButton />
        </div>
        <div
          className="w-full max-w-[420px] py-20 lg:py-0"
          data-testid="username-panel"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1
              ref={heading}
              tabIndex={-1}
              className="mb-2 text-3xl font-bold text-gray-900 focus:outline-none"
            >
              Garanta seu link
            </h1>
            <p className="text-gray-500">
              Escolha um nome de usuário único para começar.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              if (!available) {
                event.preventDefault();
                return;
              }
              onSubmit(event);
            }}
            noValidate
            className="space-y-6"
            aria-busy={busy}
          >
            <div>
              <label
                htmlFor="slug"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Nome do endereço
              </label>
              <div className="relative">
                <div
                  className={`flex w-full items-center overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all focus-within:ring-2 ${available ? "border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20" : invalid ? "border-red-500 focus-within:ring-red-500/20" : "border-gray-200 focus-within:border-primary focus-within:ring-primary/20"}`}
                >
                  <div
                    className="flex h-full select-none items-center justify-center border-r-0 bg-transparent pl-4 pr-1 font-medium text-gray-400"
                    aria-hidden="true"
                  >
                    catlink/
                  </div>
                  <input
                    id="slug"
                    name="slug"
                    value={value}
                    onChange={(event) => {
                      setEditVersion((version) => version + 1);
                      onChange(event.target.value.toLowerCase());
                    }}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={40}
                    placeholder="seunome"
                    required
                    disabled={busy || conflict}
                    aria-invalid={invalid}
                    aria-describedby="slug-status"
                    className="block w-full border-0 bg-transparent py-3.5 pl-0 pr-10 font-semibold text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-base"
                  />
                  <div
                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 ${available ? "text-green-500" : invalid ? "text-red-500" : "text-gray-400"}`}
                  >
                    {available ? (
                      <CheckCircle2
                        data-testid="slug-check-success"
                        size={20}
                      />
                    ) : invalid ? (
                      <XCircle size={20} />
                    ) : status === "checking" ? (
                      <LoaderCircle
                        data-testid="slug-check-spinner"
                        size={20}
                        className="animate-spin"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div
                id="slug-status"
                role="status"
                aria-live="polite"
                className={`mt-2 flex min-h-5 items-center gap-1.5 text-sm font-medium ${available ? "text-green-600" : invalid || status === "error" ? "text-red-600" : "text-gray-500"}`}
              >
                {available ? (
                  <>
                    <Check size={16} />
                    Ótimo! Este nome está disponível.
                  </>
                ) : status === "taken" ? (
                  "Este nome já está em uso. Escolha outro."
                ) : status === "invalid" ? (
                  "Use 3–40 letras, números ou hífens; evite nomes reservados."
                ) : status === "checking" ? (
                  "Verificando nome de usuário…"
                ) : status === "waiting" ? (
                  "Aguardando você terminar de digitar…"
                ) : status === "error" ? (
                  <span>
                    Não foi possível verificar.{" "}
                    <button type="button" onClick={retry} className="underline">
                      Tentar novamente
                    </button>
                  </span>
                ) : (
                  <span className="text-xs font-normal">
                    Use de 3 a 40 letras, números ou hífens.
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <div className="mt-0.5 shrink-0">
                <Info size={20} className="text-primary" />
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                Este será seu endereço para compartilhar nas redes sociais. Sua
                página permanece privada até você publicá-la.
              </p>
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
                {conflict && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="ml-2 underline"
                  >
                    Recarregar progresso
                  </button>
                )}
              </div>
            )}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!available || busy || conflict}
                className="flex w-full transform justify-center gap-2 rounded-xl border border-transparent bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:transform-none disabled:opacity-50"
              >
                {busy && <LoaderCircle size={16} className="animate-spin" />}
                {busy ? "Salvando…" : "Confirmar nome de usuário"}
              </button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <Link
              href="/cadastro"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              Voltar à etapa anterior
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span>Política de Privacidade</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Termos de Serviço</span>
          </div>
        </div>
      </main>
    </div>
  );
}
