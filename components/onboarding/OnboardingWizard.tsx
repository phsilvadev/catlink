"use client";

import Link from "next/link";
import UsernameStep from "./UsernameStep";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LockKeyhole,
  LoaderCircle,
  Upload,
  UserRound,
} from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";
import SignOutButton from "@/components/auth/SignOutButton";
import PageContent from "@/components/page/PageContent";
import {
  onboardingInputSchema,
  profileKinds,
  platforms,
  type OnboardingState,
} from "@/lib/schemas/onboarding";
import type { Draft } from "@/lib/schemas/page";

type Template = {
  key: string;
  name: string;
  description: string;
  allowed: boolean;
  version: number;
};
type Props = {
  initial: {
    state: OnboardingState;
    revision: number;
    completedPageId: string | null;
  };
  templates: Template[];
};
const titles = [
  "Escolha seu endereço",
  "O que descreve você?",
  "Quais plataformas você usa?",
  "Escolha seu modelo",
  "Deixe com a sua cara",
  "Tudo pronto para começar",
];
const descriptions = [
  "Um nome único para reunir seus links. Sua página só ficará pública quando você publicar.",
  "Escolha o perfil que mais combina com você.",
  "Selecione até cinco. Você pode deixar os links para depois.",
  "Escolha entre os modelos incluídos no seu plano.",
  "Adicione uma foto, seu nome e uma breve apresentação.",
  "Revise os dados e crie seu primeiro rascunho.",
];
export default function OnboardingWizard({ initial, templates }: Props) {
  const [state, setState] = useState(initial.state),
    [revision, setRevision] = useState(initial.revision);
  const [step, setStep] = useState(initial.state.nextStep),
    [completed, setCompleted] = useState(initial.completedPageId);
  const [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const heading = useRef<HTMLHeadingElement>(null),
    photo = useRef<HTMLInputElement>(null);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, completed]);
  function change(update: Partial<OnboardingState>) {
    setState((current) => ({ ...current, ...update }));
    setError("");
    setErrorCode("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading || completed) return;
    const data =
      step === 1
        ? { slug: state.slug }
        : step === 2
          ? { kind: state.kind }
          : step === 3
            ? { platforms: state.platforms }
            : step === 4
              ? { templateKey: state.templateKey }
              : step === 5
                ? { profile: state.profile, links: state.links }
                : {};
    const input = onboardingInputSchema.safeParse({
      step,
      expectedRevision: revision,
      data,
    });
    if (!input.success) {
      setError(
        step === 1
          ? "Use de 3 a 40 letras minúsculas, números ou hífens. Esse nome também pode estar reservado."
          : step === 2
            ? "Escolha seu tipo de perfil."
            : step === 4
              ? "Escolha um modelo disponível no seu plano."
              : "Confira o nome, a descrição e os links. Use endereços completos começando com https://.",
      );
      return;
    }
    setBusy(true);
    setError("");
    setErrorCode("");
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.data),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Não foi possível salvar. Tente novamente.");
        setConflict(result.code === "CONFLICT");
        setErrorCode(result.code ?? "");
        return;
      }
      setState(result.data.state);
      setRevision(result.data.revision);
      setCompleted(result.data.completedPageId);
      setStep(result.data.state.nextStep);
    } catch {
      setError(
        "Falha na conexão. Seus dados anteriores continuam salvos. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      if (file.size > 5 * 1024 * 1024) {
        setError("A foto deve ter até 5 MB.");
        return;
      }
      const response = await fetch("/api/assets/avatar", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Não foi possível enviar a foto.");
        return;
      }
      change({ profile: { ...state.profile, avatarAssetId: result.data.id } });
    } catch {
      setError(
        "Não foi possível enviar a foto. Tente novamente ou continue sem foto.",
      );
    } finally {
      setUploading(false);
      if (photo.current) photo.current.value = "";
    }
  }
  const preview: Draft = {
    schemaVersion: 1,
    profile: state.profile,
    blocks: state.links.map((link, index) => ({
      id: `preview-${index}`,
      type: "link",
      visible: true,
      label:
        platforms.find((item) => item.key === link.platform)?.name ?? "Link",
      url: link.url,
    })),
  };
  const fieldClass =
    "w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-primary";
  const cardClass =
    "rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
  if (step === 1 && !completed)
    return (
      <UsernameStep
        value={state.slug}
        onChange={(slug) => change({ slug })}
        onSubmit={submit}
        busy={busy}
        error={error}
        conflict={conflict}
        heading={heading}
        serverTaken={errorCode === "SLUG_TAKEN"}
      />
    );
  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <aside className="auth-showcase sticky top-0 hidden h-screen w-5/12 shrink-0 flex-col justify-between overflow-hidden bg-sidebar-dark p-8 lg:flex">
        <div className="flex items-center justify-between">
          <AuthBrand light />
          <SignOutButton />
        </div>
        <div
          className="mx-auto my-8 h-[540px] w-[270px] overflow-y-auto rounded-[40px] border-[7px] border-black bg-white shadow-phone"
          aria-label="Prévia do seu perfil"
        >
          <PageContent
            draft={preview}
            theme={{
              background: "#ffffff",
              foreground: "#111827",
              accent: "#6366f1",
            }}
            preview
          />
        </div>
        <div className="text-white">
          <h2 className="text-3xl font-bold">Seu Catlink começa aqui.</h2>
          <p className="mt-3 max-w-sm text-gray-400">
            Um lugar para seus links, suas ideias e sua identidade.
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10 lg:px-12">
        <div className="mb-10 flex items-center justify-between rounded-xl bg-gray-50 p-3 lg:hidden">
          <AuthBrand />
          <SignOutButton />
        </div>
        <div className="mx-auto max-w-2xl">
          <p className="mb-5 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">
            {completed ? "Rascunho criado" : `Etapa ${step} de 6`}
          </p>
          <h1
            ref={heading}
            tabIndex={-1}
            className="text-3xl font-bold tracking-tight focus:outline-none"
          >
            {completed
              ? "Seu Catlink está pronto para editar!"
              : titles[step - 1]}
          </h1>
          <p className="mb-9 mt-3 leading-relaxed text-gray-500">
            {completed
              ? "Seu perfil foi salvo como rascunho. Ele ainda não está publicado."
              : descriptions[step - 1]}
          </p>
          {completed ? (
            <div className="rounded-2xl border border-gray-200 p-7">
              <CheckCircle2 size={48} className="mb-5 text-green-500" />
              <h2 className="text-xl font-bold">{state.profile.name}</h2>
              <p className="mt-2 break-all text-gray-500">
                /{state.slug} · Rascunho
              </p>
              <Link
                href={`/app/editor/${completed}`}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
              >
                Continuar no editor
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/app"
                className="ml-5 mt-4 inline-block text-sm text-primary"
              >
                Minhas páginas
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate aria-busy={busy || uploading}>
              <fieldset
                disabled={busy || uploading || conflict}
                className="space-y-5 disabled:opacity-70"
              >
                {step === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profileKinds.map((kind, index) => (
                      <button
                        key={kind.key}
                        type="button"
                        aria-pressed={state.kind === kind.key}
                        onClick={() => change({ kind: kind.key })}
                        className={`${cardClass} ${state.kind === kind.key ? "border-primary bg-indigo-50" : "border-gray-200 hover:border-primary/50"}`}
                      >
                        <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="block font-bold">{kind.name}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-gray-500">
                          {kind.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.key}
                          type="button"
                          aria-pressed={state.platforms.includes(platform.key)}
                          onClick={() => {
                            const selected = state.platforms.includes(
                              platform.key,
                            );
                            if (!selected && state.platforms.length >= 5) {
                              setError("Selecione até cinco plataformas.");
                              return;
                            }
                            const next = selected
                              ? state.platforms.filter(
                                  (key) => key !== platform.key,
                                )
                              : [...state.platforms, platform.key];
                            change({
                              platforms: next,
                              links: state.links.filter((link) =>
                                next.includes(link.platform),
                              ),
                            });
                          }}
                          className={`${cardClass} flex min-h-24 items-center justify-between gap-3 ${state.platforms.includes(platform.key) ? "border-primary bg-indigo-50" : "border-gray-200"}`}
                        >
                          <span className="text-sm font-semibold">
                            {platform.name}
                          </span>
                          {state.platforms.includes(platform.key) && (
                            <Check size={16} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                      {state.platforms.length} de 5 selecionadas. Esta etapa é
                      opcional.
                    </p>
                  </div>
                )}
                {step === 4 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {templates.length === 0 ? (
                      <p role="status" className="rounded-xl bg-gray-50 p-5">
                        Nenhum modelo disponível. Tente novamente mais tarde.
                      </p>
                    ) : (
                      templates.map((template) => (
                        <button
                          type="button"
                          key={template.key}
                          disabled={!template.allowed}
                          aria-pressed={state.templateKey === template.key}
                          onClick={() => change({ templateKey: template.key })}
                          className={`${cardClass} overflow-hidden disabled:cursor-not-allowed disabled:opacity-50 ${state.templateKey === template.key ? "border-primary bg-indigo-50" : "border-gray-200"}`}
                        >
                          <div className="mb-5 space-y-2 rounded-xl bg-gray-100 p-6">
                            <div className="mx-auto h-8 w-8 rounded-full bg-indigo-200" />
                            <div className="mx-auto h-2 w-16 rounded-full bg-gray-300" />
                            <div className="h-5 rounded-lg bg-primary/70" />
                            <div className="h-5 rounded-lg bg-white" />
                          </div>
                          <span className="block font-bold">
                            {template.name}
                          </span>
                          <span className="mt-2 block text-sm text-gray-500">
                            {template.description}
                          </span>
                          <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary">
                            {template.allowed ? (
                              <>
                                <Check size={13} />
                                Incluído no plano
                              </>
                            ) : (
                              <>
                                <LockKeyhole size={13} />
                                Não incluído
                              </>
                            )}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
                {step === 5 && (
                  <>
                    <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-gray-200 p-5">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <UserRound size={28} />
                      </span>
                      <div>
                        <p className="mb-2 text-sm font-semibold">
                          Foto de perfil
                        </p>
                        <input
                          ref={photo}
                          type="file"
                          aria-label="Selecionar foto do perfil"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          id="avatar"
                          onChange={(event) => upload(event.target.files?.[0])}
                        />
                        <button
                          type="button"
                          onClick={() => photo.current?.click()}
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold"
                        >
                          <Upload size={14} />
                          Enviar foto
                        </button>
                        {state.profile.avatarAssetId && (
                          <button
                            type="button"
                            onClick={() =>
                              change({
                                profile: {
                                  name: state.profile.name,
                                  bio: state.profile.bio,
                                },
                              })
                            }
                            className="ml-3 text-xs text-red-500"
                          >
                            Remover foto
                          </button>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          JPG, PNG ou WebP. Até 5 MB. Opcional.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="profile-name"
                        className="mb-2 block text-sm font-medium"
                      >
                        Nome do perfil
                      </label>
                      <input
                        id="profile-name"
                        value={state.profile.name}
                        maxLength={80}
                        onChange={(event) =>
                          change({
                            profile: {
                              ...state.profile,
                              name: event.target.value,
                            },
                          })
                        }
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="profile-bio"
                        className="mb-2 block text-sm font-medium"
                      >
                        Bio
                      </label>
                      <textarea
                        id="profile-bio"
                        rows={3}
                        value={state.profile.bio}
                        maxLength={500}
                        onChange={(event) =>
                          change({
                            profile: {
                              ...state.profile,
                              bio: event.target.value,
                            },
                          })
                        }
                        className={fieldClass}
                      />
                      <p className="mt-1 text-right text-xs text-gray-400">
                        {state.profile.bio.length}/500
                      </p>
                    </div>
                    {state.platforms.map((key) => (
                      <div key={key}>
                        <label
                          htmlFor={`link-${key}`}
                          className="mb-2 block text-sm font-medium"
                        >
                          Link do{" "}
                          {platforms.find((item) => item.key === key)!.name}{" "}
                          (opcional)
                        </label>
                        <input
                          id={`link-${key}`}
                          type="url"
                          placeholder="https://"
                          value={
                            state.links.find((link) => link.platform === key)
                              ?.url ?? ""
                          }
                          onChange={(event) =>
                            change({
                              links: [
                                ...state.links.filter(
                                  (link) => link.platform !== key,
                                ),
                                ...(event.target.value
                                  ? [{ platform: key, url: event.target.value }]
                                  : []),
                              ],
                            })
                          }
                          className={fieldClass}
                        />
                      </div>
                    ))}
                  </>
                )}
                {step === 6 && (
                  <div className="space-y-4 rounded-2xl border border-gray-200 p-6">
                    <p>
                      <span className="block text-xs text-gray-400">
                        Endereço
                      </span>
                      <strong className="break-all">/{state.slug}</strong>
                    </p>
                    <p>
                      <span className="block text-xs text-gray-400">Nome</span>
                      <strong>{state.profile.name}</strong>
                    </p>
                    <p>
                      <span className="block text-xs text-gray-400">
                        Modelo
                      </span>
                      {templates.find(
                        (template) => template.key === state.templateKey,
                      )?.name ?? state.templateKey}
                    </p>
                    <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
                      Ao concluir, criaremos um rascunho privado. Sua página não
                      será publicada automaticamente.
                    </p>
                  </div>
                )}
              </fieldset>
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
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
              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    disabled={busy || uploading || conflict}
                    onClick={() => {
                      setError("");
                      setStep((value) => value - 1);
                    }}
                    className="inline-flex items-center gap-2 text-sm text-gray-500"
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </button>
                ) : (
                  <Link href="/app" className="text-sm text-gray-500">
                    Minhas páginas
                  </Link>
                )}
                <button
                  type="submit"
                  disabled={busy || uploading || conflict}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {busy || uploading ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {uploading
                    ? "Enviando foto…"
                    : busy
                      ? "Salvando…"
                      : step === 6
                        ? "Criar meu rascunho"
                        : "Salvar e continuar"}
                </button>
              </div>
              <p className="mt-5 text-center text-xs text-gray-400">
                Cada etapa é salva ao continuar.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
