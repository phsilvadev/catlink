"use client";

import PageContent from "@/components/page/PageContent";
import PhoneFrame from "@/components/page/PhoneFrame";
import type { Draft } from "@/lib/schemas/page";
import type { PageTheme } from "@/lib/page-appearance";
import { demoProfile, entryTheme } from "@/lib/page-appearance";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
} from "lucide-react";

const themes = ["basic", "sunset", "mint"] as const;
const names: Record<string, string> = {
  basic: "Aurora",
  sunset: "Rosa",
  mint: "Menta",
  pixel: "PixelMaster",
};
const blocks = [
  { key: "text", name: "Texto", Icon: Type },
  { key: "link", name: "Link", Icon: LinkIcon },
  { key: "image", name: "Imagem", Icon: ImageIcon },
  { key: "calendar", name: "Calendário", Icon: CalendarDays },
] as const;
type BlockName = (typeof blocks)[number]["key"];
const copy = [
  [
    "Seu próximo capítulo,",
    "começa com um link.",
    "Escolha um nome para reunir suas ideias, seus contatos e tudo o que você faz.",
  ],
  [
    "Um espaço com",
    "a sua identidade.",
    "Conte um pouco sobre você. Vamos preparar uma página que combine com seu perfil.",
  ],
  [
    "Suas conexões,",
    "em um só lugar.",
    "Reúna suas plataformas favoritas e ajude seu público a encontrar você.",
  ],
  [
    "Sua página começa",
    "a ganhar forma.",
    "Escolha um modelo para apresentar seu perfil, seus links e sua identidade.",
  ],
];

function DemoBlock({ block }: { block: BlockName }) {
  const [length, setLength] = useState(0);
  const sentence =
    "Transformamos boas ideias em experiências digitais. Conheça nossos projetos e faça parte dessa história.";
  useEffect(() => {
    if (block !== "text") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setInterval(
      () =>
        setLength((n) =>
          Math.min(n + (reduced ? sentence.length : 1), sentence.length),
        ),
      reduced ? 1 : 22,
    );
    return () => window.clearInterval(timer);
  }, [block, sentence.length]);
  return (
    <div className="block-demo" data-testid="demo-block" key={block}>
      {block === "text" ? (
        <div className="demo-text">
          <span className="demo-eyebrow">UM POUCO SOBRE NÓS</span>
          <h2>Ideias que conectam.</h2>
          <p className="demo-typing">{sentence.slice(0, length)}</p>
        </div>
      ) : block === "link" ? (
        <>
          <div className="demo-link">
            <Globe size={18} />
            <span>Conheça nosso trabalho</span>
            <span>↗</span>
          </div>
          <p className="demo-caption">Seu próximo destino, a um clique.</p>
        </>
      ) : block === "image" ? (
        <div className="demo-image">
          <svg
            viewBox="0 0 260 130"
            role="img"
            aria-label="Montanhas ao pôr do sol"
          >
            <defs>
              <linearGradient id="entry-sky" x2="0" y2="1">
                <stop stopColor="#dcc9f8" />
                <stop offset="1" stopColor="#ffdec9" />
              </linearGradient>
            </defs>
            <rect width="260" height="130" fill="url(#entry-sky)" />
            <circle cx="191" cy="40" r="20" fill="#fff2d3" />
            <path d="M0 112 75 36 153 130H0" fill="#8b83b4" />
            <path d="m68 130 86-75 106 75" fill="#b7a5cd" />
          </svg>
          <span>Um olhar para novas possibilidades.</span>
        </div>
      ) : (
        <>
          <div className="demo-calendar">
            <div className="demo-date">
              <strong>24</strong>
              <span>NOV</span>
            </div>
            <div>
              <h2>Agende uma conversa</h2>
              <p>Reunião de 30 minutos</p>
            </div>
            <CalendarDays size={20} />
          </div>
          <div className="demo-time">Escolha o melhor horário para você</div>
        </>
      )}
    </div>
  );
}

export default function EntryShowcase({
  expanded = false,
  selectedTheme,
  step = 1,
  templates,
}: {
  expanded?: boolean;
  selectedTheme?: string;
  step?: number;
  templates?: {
    key: string;
    preview?: { draft: Draft; theme: PageTheme } | null;
  }[];
}) {
  const [demoTheme, setDemoTheme] = useState("basic");
  const [block, setBlock] = useState<BlockName | null>(null);
  const [interacted, setInteracted] = useState(false);
  const requested = expanded ? selectedTheme || "basic" : demoTheme;
  const [theme, setTheme] = useState(requested);
  const loading = theme !== requested;
  const aside = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const description = useRef<HTMLParagraphElement>(null);
  const [title, accent, subtitle] = copy[Math.max(0, Math.min(step - 1, 3))];
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => {
        setTheme(requested);
        if (!reduced)
          screen.current?.animate(
            [
              { opacity: 0.35, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 300, easing: "ease-out" },
          );
      },
      reduced ? 0 : 550,
    );
    return () => window.clearTimeout(timer);
  }, [requested]);
  useEffect(() => {
    if (
      expanded ||
      interacted ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const canPlay = () =>
      !document.hidden &&
      window.matchMedia("(min-width: 1024px)").matches &&
      !aside.current?.matches(":hover, :focus-within");
    const themeTimer = window.setInterval(() => {
      if (canPlay())
        setDemoTheme(
          (current) =>
            themes[
              (themes.indexOf(current as (typeof themes)[number]) + 1) %
                themes.length
            ],
        );
    }, 4500);
    const blockTimer = window.setInterval(() => {
      if (canPlay())
        setBlock(
          (current) =>
            blocks[
              (blocks.findIndex((item) => item.key === current) + 1) %
                blocks.length
            ].key,
        );
    }, 6500);
    return () => {
      window.clearInterval(themeTimer);
      window.clearInterval(blockTimer);
    };
  }, [expanded, interacted]);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = [heading.current, description.current].map((element) =>
      element?.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 450, easing: "ease-out" },
      ),
    );
    return () => animations.forEach((animation) => animation?.cancel());
  }, [step]);
  const activeBlock = expanded ? null : block;
  return (
    <aside
      ref={aside}
      className="login-showcase"
      aria-label="Conheça o Catlink"
      lang="pt-BR"
    >
      <div className="showcase-dots top" aria-hidden="true" />
      <div className="showcase-dots bottom" aria-hidden="true" />
      <div className="showcase-content">
        <h2 ref={heading} className="showcase-heading">
          {title}
          <br />
          <span>{accent}</span>
        </h2>
        <p ref={description} className="showcase-description">
          {subtitle}
        </p>
        <div className="showcase-preview">
          <div
            className={`showcase-phone ${loading ? "is-loading" : ""} ${activeBlock ? "has-block-demo" : ""}`}
            data-theme={theme}
            aria-busy={loading}
            aria-label={`Prévia do tema ${names[theme] || names.basic}`}
          >
            <PhoneFrame lightStatus={theme === "pixel"}>
              <div className="phone-skeleton" aria-hidden="true">
                <span className="skeleton-avatar" />
                <span className="skeleton-title" />
                <span className="skeleton-description" />
                <span className="skeleton-link" />
                <span className="skeleton-link" />
                <span className="skeleton-link" />
              </div>
              <div
                ref={screen}
                className={
                  theme === "pixel" ? "pixel-template" : "standard-template"
                }
              >
                <PageContent
                  draft={
                    templates?.find((t) => t.key === theme)?.preview?.draft ||
                    demoProfile(theme)
                  }
                  theme={
                    templates?.find((t) => t.key === theme)?.preview?.theme ||
                    entryTheme(theme)
                  }
                  preview
                >
                  {activeBlock ? (
                    <DemoBlock block={activeBlock} key={activeBlock} />
                  ) : undefined}
                </PageContent>
              </div>
            </PhoneFrame>
          </div>
          <div
            className="showcase-cards"
            inert={expanded}
            aria-hidden={expanded}
          >
            <section className="showcase-card">
              <h3>Blocos prontos</h3>
              <div className="showcase-blocks">
                {blocks.map(({ key, name, Icon }) => (
                  <button
                    type="button"
                    className={`showcase-block ${block === key ? "selected" : ""}`}
                    data-preview-block={key}
                    aria-pressed={block === key}
                    key={key}
                    onClick={() => {
                      setInteracted(true);
                      setBlock(key);
                    }}
                  >
                    <Icon size={24} aria-hidden="true" />
                    {name}
                  </button>
                ))}
              </div>
            </section>
            <section className="showcase-card">
              <h3>Temas personalizados</h3>
              <div
                className="showcase-themes"
                role="group"
                aria-label="Experimentar temas"
              >
                {themes.map((key) => (
                  <button
                    type="button"
                    className={`showcase-theme ${key === "basic" ? "" : `theme-${key}`} ${requested === key ? "selected" : ""}`}
                    data-preview-theme={key}
                    aria-label={`Experimentar tema ${names[key]}`}
                    aria-pressed={requested === key}
                    key={key}
                    onClick={() => {
                      setInteracted(true);
                      setDemoTheme(key);
                    }}
                  >
                    <span className="theme-cover" aria-hidden="true" />
                    <span className="theme-avatar" aria-hidden="true" />
                    <span className="theme-lines" aria-hidden="true" />
                    <span className="theme-socials" aria-hidden="true" />
                    <Check
                      className="theme-check"
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
