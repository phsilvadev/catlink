"use client";
import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ChevronDown,
  ChevronUp,
  Italic,
  LoaderCircle,
  Save,
  Trash2,
  Underline,
} from "lucide-react";
import type { Draft } from "@/lib/schemas/page";
export type TextBlock = Extract<Draft["blocks"][number], { type: "text" }>;
export type TextStyle = NonNullable<TextBlock["style"]>;
export default function TextBlockSettings({
  block,
  onChange,
  onClose,
  onDelete,
  onSave,
  saving,
  dirty,
  error,
  defaultColor = "#111827",
}: {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
  onClose: () => void;
  onDelete: () => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  error: string;
  defaultColor?: string;
}) {
  const [spacingOpen, setSpacingOpen] = useState(true);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [block.id]);
  const style = block.style || {};
  const update = (patch: Partial<TextStyle>) =>
    onChange({ ...block, style: { ...style, ...patch } });
  const maxLength = Math.max(500, block.content.length);
  const fieldClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  return (
    <div className="text-block-settings flex h-full flex-col p-6 pb-4">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="Voltar ao design"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2
          ref={heading}
          tabIndex={-1}
          className="flex-1 text-lg font-bold outline-none"
        >
          Bloco de texto
        </h2>
        <button
          type="button"
          onClick={onDelete}
          disabled={saving}
          aria-label="Excluir bloco de texto"
          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <fieldset
        disabled={saving}
        className="min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar"
      >
        <div className="mb-6">
          <label
            htmlFor="text-content"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Conteúdo
          </label>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 dark:border-gray-700">
            <div
              className="flex items-center gap-1 border-b border-gray-200 bg-white p-2 dark:bg-gray-800"
              role="toolbar"
              aria-label="Formatação do texto"
            >
              {(
                [
                  { key: "bold", label: "Negrito", Icon: Bold },
                  { key: "italic", label: "Itálico", Icon: Italic },
                  { key: "underline", label: "Sublinhado", Icon: Underline },
                ] as const
              ).map(({ key, label, Icon }) => (
                <button
                  type="button"
                  key={key}
                  aria-label={label}
                  aria-pressed={!!style[key]}
                  onClick={() => update({ [key]: !style[key] })}
                  className={`rounded p-1.5 ${style[key] ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Icon size={16} />
                </button>
              ))}
              <div className="mx-1 h-4 w-px bg-gray-300" />
              {(
                [
                  {
                    value: "left",
                    label: "Alinhar à esquerda",
                    Icon: AlignLeft,
                  },
                  { value: "center", label: "Centralizar", Icon: AlignCenter },
                  {
                    value: "right",
                    label: "Alinhar à direita",
                    Icon: AlignRight,
                  },
                ] as const
              ).map(({ value, label, Icon }) => (
                <button
                  type="button"
                  key={value}
                  aria-label={label}
                  aria-pressed={(style.align || "center") === value}
                  onClick={() => update({ align: value })}
                  className={`rounded p-1.5 ${(style.align || "center") === value ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <textarea
              id="text-content"
              rows={6}
              maxLength={maxLength}
              value={block.content}
              onChange={(event) =>
                onChange({ ...block, content: event.target.value })
              }
              placeholder="Digite seu texto aqui…"
              aria-describedby="text-count"
              className="h-32 w-full resize-none border-none bg-white p-3 text-sm text-gray-700 focus:ring-0 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <p
            id="text-count"
            className="mt-2 text-right text-[10px] text-gray-400"
          >
            {block.content.length}/{maxLength} caracteres
          </p>
        </div>
        <hr className="mb-6 border-gray-200" />
        <section className="mb-6">
          <h3 className="mb-4 text-sm font-bold">Aparência</h3>
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="text-font-size"
                className="text-xs font-medium text-gray-600"
              >
                Tamanho da fonte
              </label>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {style.fontSize ?? 16}px
              </span>
            </div>
            <input
              id="text-font-size"
              type="range"
              min={10}
              max={48}
              value={style.fontSize ?? 16}
              onChange={(event) =>
                update({ fontSize: Number(event.target.value) })
              }
              className="h-1.5 w-full cursor-pointer accent-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="text-color"
              className="mb-2 block text-xs font-medium text-gray-600"
            >
              Cor do texto
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Escolher cor do texto"
                value={style.color || defaultColor}
                onChange={(event) => update({ color: event.target.value })}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-1"
              />
              <input
                id="text-color"
                type="text"
                pattern="#[0-9a-fA-F]{6}"
                key={style.color || defaultColor}
                defaultValue={style.color || defaultColor}
                maxLength={7}
                onBlur={(event) => {
                  if (/^#[0-9a-fA-F]{6}$/.test(event.target.value))
                    update({ color: event.target.value });
                  else event.target.value = style.color || defaultColor;
                }}
                className={`${fieldClass} uppercase`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2 flex cursor-pointer items-center justify-between text-xs font-medium text-gray-600">
              Cor de fundo
              <input
                type="checkbox"
                role="switch"
                aria-label="Ativar cor de fundo"
                checked={!!style.background}
                onChange={(event) => {
                  if (event.target.checked) update({ background: "#f3f4f6" });
                  else {
                    const next = { ...style };
                    delete next.background;
                    onChange({ ...block, style: next });
                  }
                }}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30"
              />
            </label>
            {style.background && (
              <input
                type="color"
                aria-label="Escolher cor de fundo"
                value={style.background}
                onChange={(event) => update({ background: event.target.value })}
                className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 p-1"
              />
            )}
          </div>
        </section>
        <hr className="mb-6 border-gray-200" />
        <section className="mb-6">
          <button
            type="button"
            aria-expanded={spacingOpen}
            aria-controls="text-spacing"
            onClick={() => setSpacingOpen((value) => !value)}
            className="mb-4 flex w-full items-center justify-between text-sm font-bold"
          >
            Layout e espaçamento
            {spacingOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {spacingOpen && (
            <div id="text-spacing" className="grid grid-cols-2 gap-4">
              {(
                [
                  { key: "paddingTop", label: "Espaço superior" },
                  { key: "paddingBottom", label: "Espaço inferior" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label
                    htmlFor={`text-${key}`}
                    className="mb-1.5 block text-xs text-gray-500"
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={`text-${key}`}
                      type="number"
                      min={0}
                      max={96}
                      value={style[key] ?? 16}
                      onChange={(event) =>
                        update({
                          [key]: Math.min(
                            96,
                            Math.max(0, Number(event.target.value)),
                          ),
                        })
                      }
                      className={`${fieldClass} pr-8`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      px
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </fieldset>
      <div className="mt-auto border-t border-gray-200 pt-4">
        {error && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty || !block.content.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}{" "}
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
