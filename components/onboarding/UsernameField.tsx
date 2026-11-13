"use client";
import { useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useSlugAvailability } from "./useSlugAvailability";
export default function UsernameField({
  value,
  onChange,
  busy,
  taken,
  onContinue,
}: {
  value: string;
  onChange: (value: string) => void;
  busy: boolean;
  taken: boolean;
  onContinue: () => void;
}) {
  const [version, setVersion] = useState(0);
  const { status: checked, retry } = useSlugAvailability(value, version);
  const status = taken ? "taken" : checked;
  const available = status === "available",
    invalid = status === "taken" || status === "invalid";
  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (available && !busy) onContinue();
      }}
      aria-busy={busy}
    >
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Nome de usuário
        </label>
        <div
          className={`relative flex items-center overflow-hidden rounded-xl border bg-white transition-shadow focus-within:ring-2 focus-within:ring-primary ${available ? "border-green-500" : invalid ? "border-red-500" : "border-gray-200"}`}
        >
          <span className="select-none whitespace-nowrap pl-4 text-sm text-gray-400">
            catlink/
          </span>
          <input
            id="username"
            name="username"
            value={value}
            onChange={(e) => {
              setVersion((v) => v + 1);
              onChange(e.target.value.toLowerCase());
            }}
            type="text"
            placeholder="seunome"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            minLength={3}
            maxLength={40}
            aria-invalid={invalid}
            aria-describedby="username-help username-status"
            disabled={busy}
            className="w-full min-w-0 border-0 bg-transparent py-3.5 pl-1 pr-10 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:ring-0"
          />
          <span
            className={`pointer-events-none absolute right-4 ${available ? "text-green-500" : invalid ? "text-red-500" : "text-primary"}`}
          >
            {available ? (
              <CheckCircle2 size={18} data-testid="slug-check-success" />
            ) : status === "checking" ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
                data-testid="slug-check-spinner"
              />
            ) : invalid ? (
              <XCircle size={18} />
            ) : null}
          </span>
        </div>
        <p id="username-help" className="mt-2 text-xs text-gray-500">
          Use de 3 a 40 caracteres: letras minúsculas, números e hífen.
        </p>
        <p
          id="username-status"
          role="status"
          aria-live="polite"
          className={`mt-2 min-h-5 text-sm ${available ? "text-green-600" : invalid || status === "error" ? "text-red-600" : "text-gray-500"}`}
        >
          {available ? (
            "Ótimo! Este nome está disponível."
          ) : status === "checking" ? (
            "Verificando nome de usuário…"
          ) : status === "waiting" ? (
            "Aguardando você terminar de digitar…"
          ) : status === "taken" ? (
            "Este nome já está em uso. Escolha outro."
          ) : status === "invalid" ? (
            "Use letras, números e hífens; evite nomes reservados."
          ) : status === "error" ? (
            <>
              Não foi possível verificar.{" "}
              <button type="button" className="underline" onClick={retry}>
                Tentar novamente
              </button>
            </>
          ) : (
            ""
          )}
        </p>
      </div>
      <button
        type="submit"
        className="entry-button"
        disabled={!available || busy}
      >
        {busy ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Salvando…
          </>
        ) : (
          <>
            Confirmar meu link <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
