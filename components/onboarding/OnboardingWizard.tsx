"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import EntryShowcase from "@/components/entry/EntryShowcase";
import AuthBrand from "@/components/auth/AuthBrand";
import SignOutButton from "@/components/auth/SignOutButton";
import {
  profileKinds,
  platforms,
  type OnboardingState,
} from "@/lib/schemas/onboarding";
import UsernameField from "./UsernameField";
import "@/components/entry/entry.css";
type Template = {
  key: string;
  name: string;
  description: string;
  allowed: boolean;
};
type Saved = {
  state: OnboardingState;
  revision: number;
  completedPageId: string | null;
};
export default function OnboardingWizard({
  initial,
  templates,
}: {
  initial: Saved;
  templates: Template[];
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial),
    [state, setState] = useState({
      ...initial.state,
      templateKey:
        initial.state.templateKey ||
        templates.find((t) => t.allowed)?.key ||
        "",
    }),
    [step, setStep] = useState(Math.min(initial.state.nextStep, 4));
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [code, setCode] = useState("");
  const heading = useRef<HTMLHeadingElement>(null),
    track = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: false });
  const conflict = code === "CONFLICT";
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (saved.completedPageId)
      router.replace(`/app/editor/${saved.completedPageId}`);
  }, [saved.completedPageId, router]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setBounds({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [step, templates.length]);
  function change(patch: Partial<OnboardingState>) {
    setState((s) => ({ ...s, ...patch }));
    setError("");
    setCode("");
  }
  async function submit() {
    if (busy || conflict) return;
    if (step === 2 && !state.kind) {
      setError("Escolha seu tipo de perfil.");
      return;
    }
    if (
      step === 4 &&
      !templates.some((t) => t.key === state.templateKey && t.allowed)
    ) {
      setError("Escolha um modelo incluído no seu plano.");
      return;
    }
    const data =
      step === 1
        ? { slug: state.slug }
        : step === 2
          ? { kind: state.kind }
          : step === 3
            ? { platforms: state.platforms }
            : { templateKey: state.templateKey, complete: true };
    setBusy(true);
    setError("");
    setCode("");
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, expectedRevision: saved.revision, data }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Não foi possível salvar. Tente novamente.");
        setCode(result.code || "");
        return;
      }
      setSaved(result.data);
      setState({
        ...result.data.state,
        templateKey:
          result.data.state.templateKey ||
          templates.find((t) => t.allowed)?.key ||
          "",
      });
      if (result.data.completedPageId) {
        router.replace(`/app/editor/${result.data.completedPageId}`);
        router.refresh();
      } else setStep(Math.min(step + 1, 4));
    } catch {
      setError(
        "Não foi possível conectar. Seus dados já salvos serão mantidos.",
      );
    } finally {
      setBusy(false);
    }
  }
  const title =
    step === 1
      ? "Qual vai ser o seu link?"
      : step === 2
        ? "O que descreve você?"
        : step === 3
          ? "Quais plataformas você usa?"
          : "Escolha seu modelo";
  const subtitle =
    step === 1
      ? "Escolha um nome que combine com você ou com sua marca. É assim que as pessoas vão encontrar seu perfil."
      : step === 2
        ? "Escolha o perfil que mais combina com você."
        : step === 3
          ? "Selecione até cinco. Você pode deixar os links para depois."
          : "Escolha entre os modelos incluídos no seu plano.";
  return (
    <div
      className={`entry-flow onboarding ${step === 4 ? "showcase-expanded model-step" : ""}`}
    >
      <EntryShowcase expanded={step === 4} selectedTheme={state.templateKey} />
      <main className="onboarding-main">
        <section
          className="onboarding-panel"
          data-step={step}
          aria-label={`Etapa ${step} de 4`}
          style={step === 1 ? { maxWidth: 420 } : undefined}
          data-testid={step === 1 ? "username-panel" : undefined}
        >
          <div className="entry-account">
            <SignOutButton />
          </div>
          {step === 1 && (
            <>
              <Link
                href="/login"
                className="absolute left-0 top-0 flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
              >
                <ArrowLeft size={18} />
                Voltar ao login
              </Link>
              <div className="mb-10">
                <AuthBrand />
              </div>
            </>
          )}
          <header>
            <span
              className={
                step === 1
                  ? "mb-5 inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  : "step"
              }
            >
              Etapa {step} de 4
            </span>
            <h1 ref={heading} tabIndex={-1} className="focus:outline-none">
              {title}
            </h1>
            <p className="subtitle">{subtitle}</p>
          </header>
          {step === 1 ? (
            <>
              <UsernameField
                value={state.slug}
                onChange={(slug) => change({ slug })}
                busy={busy || conflict}
                taken={code === "SLUG_TAKEN"}
                onContinue={submit}
              />
              <p className="mt-8 text-center text-sm text-gray-500">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              aria-busy={busy}
            >
              <fieldset disabled={busy || conflict}>
                <legend>
                  {step === 2
                    ? "Escolha o seu tipo de perfil"
                    : step === 3
                      ? "Selecione até cinco plataformas (opcional)"
                      : "Escolha o modelo da sua página"}
                </legend>
                {step === 2 && (
                  <div className="options">
                    {profileKinds.map((kind, i) => (
                      <label className="option" key={kind.key}>
                        <input
                          type="radio"
                          name="profileType"
                          value={kind.key}
                          checked={state.kind === kind.key}
                          onChange={() => change({ kind: kind.key })}
                        />
                        <span className="card">
                          <span className="number" aria-hidden="true">
                            {i + 1}
                          </span>
                          <span className="title">{kind.name}</span>
                          <span className="description">
                            {kind.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="options platform-options">
                    {platforms.map((p) => (
                      <label className="option" key={p.key}>
                        <input
                          type="checkbox"
                          name="platforms"
                          value={p.key}
                          checked={state.platforms.includes(p.key)}
                          disabled={
                            !state.platforms.includes(p.key) &&
                            state.platforms.length >= 5
                          }
                          onChange={() =>
                            change({
                              platforms: state.platforms.includes(p.key)
                                ? state.platforms.filter((k) => k !== p.key)
                                : [...state.platforms, p.key],
                            })
                          }
                        />
                        <span className="card platform-card">
                          <span className="platform-name">{p.name}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {step === 4 && (
                  <div
                    className="theme-picker"
                    role="region"
                    aria-roledescription="carrossel"
                    aria-label="Modelos disponíveis"
                  >
                    <button
                      type="button"
                      className="model-carousel-arrow previous"
                      aria-label="Mostrar modelo anterior"
                      disabled={bounds.start}
                      onClick={() =>
                        track.current?.scrollBy({
                          left: -(track.current?.clientWidth || 220),
                          behavior: "smooth",
                        })
                      }
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="model-carousel-viewport">
                      <div className="showcase-themes" ref={track}>
                        {templates.map((t) => (
                          <label
                            key={t.key}
                            className="theme-option"
                            title={t.description}
                          >
                            <input
                              type="radio"
                              name="model"
                              value={t.key}
                              aria-label={`Tema ${t.name}`}
                              disabled={!t.allowed}
                              checked={state.templateKey === t.key}
                              onChange={() => change({ templateKey: t.key })}
                            />
                            <span
                              className={`showcase-theme ${t.key === "basic" ? "" : `theme-${t.key}`}`}
                              aria-hidden="true"
                            >
                              <span className="theme-cover" />
                              <span className="theme-avatar" />
                              <span className="theme-lines" />
                              <span className="theme-socials" />
                              <Check className="theme-check" size={18} />
                            </span>
                            <span className="model-caption">
                              <span>{t.name}</span>
                              {t.allowed ? (
                                <span>Incluído</span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <LockKeyhole size={12} />
                                  Pago
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="model-carousel-arrow next"
                      aria-label="Mostrar próximo modelo"
                      disabled={bounds.end}
                      onClick={() =>
                        track.current?.scrollBy({
                          left: track.current?.clientWidth || 220,
                          behavior: "smooth",
                        })
                      }
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </fieldset>
              {step === 3 && (
                <p className="selection-count" role="status" aria-live="polite">
                  {state.platforms.length} de 5 selecionadas. Esta etapa é
                  opcional.
                </p>
              )}
              {step === 4 && templates.length === 0 && (
                <p className="entry-error">
                  Nenhum modelo está disponível no momento.
                </p>
              )}
              <footer>
                <button
                  type="button"
                  className="back"
                  disabled={busy || conflict}
                  onClick={() => {
                    setStep(step - 1);
                    setError("");
                    setCode("");
                  }}
                >
                  <ArrowLeft />
                  Voltar
                </button>
                <button
                  type="submit"
                  className="entry-button"
                  disabled={
                    busy ||
                    conflict ||
                    (step === 4 &&
                      !templates.some(
                        (t) => t.key === state.templateKey && t.allowed,
                      ))
                  }
                >
                  {busy ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Salvando…
                    </>
                  ) : step === 4 ? (
                    <>
                      Concluir configuração
                      <Check />
                    </>
                  ) : (
                    <>
                      Salvar e continuar
                      <ArrowRight />
                    </>
                  )}
                </button>
              </footer>
              <p className="note">
                {step === 4
                  ? "Suas escolhas são salvas ao concluir. Sua página será criada como rascunho."
                  : "Cada etapa é salva ao continuar."}
              </p>
            </form>
          )}
          {error && (
            <div className="entry-error" role="alert">
              {error}
              {conflict && (
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => window.location.reload()}
                >
                  Recarregar progresso
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
