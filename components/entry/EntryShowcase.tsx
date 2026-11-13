"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BatteryFull,
  CalendarDays,
  Check,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Signal,
  Type,
  Wifi,
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
}: {
  expanded?: boolean;
  selectedTheme?: string;
  step?: number;
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
            <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] shadow-phone border-[8px] border-black overflow-hidden z-0">
              <div className="phone-status absolute top-0 w-full h-8 z-20 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                  <Signal size={10} />
                  <Wifi size={10} />
                  <BatteryFull size={10} />
                </div>
              </div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
              <div
                ref={screen}
                className="phone-screen w-full h-full bg-white relative overflow-hidden"
              >
                <div className="phone-skeleton" aria-hidden="true">
                  <span className="skeleton-avatar" />
                  <span className="skeleton-title" />
                  <span className="skeleton-description" />
                  <span className="skeleton-link" />
                  <span className="skeleton-link" />
                  <span className="skeleton-link" />
                </div>
                <div className="standard-template">
                  <div className="relative h-36 w-full overflow-hidden bg-white">
                    <div className="phone-cover absolute inset-0 bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800" />
                    <div className="absolute bottom-[-1px] left-0 w-full leading-[0]">
                      <svg
                        className="relative block w-[calc(140%+1.3px)] h-[30px] fill-white"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                        aria-hidden="true"
                      >
                        <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative -mt-12 flex justify-center z-10">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                      <Image
                        src="/images/auth-avatar.png"
                        alt="Perfil de exemplo"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center px-4 mt-2 mb-4">
                    <h1 className="text-lg font-bold text-gray-900">
                      Rock Agency
                    </h1>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Digital agency specializing in SaaS products.
                    </p>
                  </div>
                  {activeBlock && theme !== "pixel" ? (
                    <DemoBlock block={activeBlock} key={activeBlock} />
                  ) : (
                    <>
                      <div className="phone-links px-4 space-y-3">
                        <div className="bg-gray-900 text-white py-2.5 rounded-full text-xs font-bold text-center shadow-md flex items-center justify-center gap-2">
                          <Globe size={12} />
                          Visit Website
                        </div>
                        <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                          Latest Projects
                        </div>
                        <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                          Book a Call
                        </div>
                      </div>
                      <div className="phone-socials flex justify-center gap-3 mt-6">
                        {["instagram", "twitter", "linkedin-in"].map((icon) => (
                          <div
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                            key={icon}
                          >
                            <i
                              className={`fab fa-${icon} text-xs`}
                              aria-hidden="true"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="pixel-template">
                  <Image
                    src="/images/auth-avatar.png"
                    alt="Avatar de PixelMaster"
                    width={96}
                    height={96}
                    className="pixel-avatar"
                  />
                  <h1>
                    PixelMaster{" "}
                    <span
                      className="material-icons-round"
                      aria-label="Verificado"
                    >
                      verified
                    </span>
                  </h1>
                  <p>Design | Code | Minimalist</p>
                  {activeBlock && theme === "pixel" ? (
                    <DemoBlock block={activeBlock} key={activeBlock} />
                  ) : (
                    <>
                      <div className="pixel-links">
                        <div>
                          <i
                            className="fab fa-youtube text-red-500"
                            aria-hidden="true"
                          />
                          Latest Video
                        </div>
                        <div>
                          <Globe size={16} color="#6366f1" />
                          My Portfolio
                        </div>
                        <div>
                          <i
                            className="fab fa-twitter text-blue-400"
                            aria-hidden="true"
                          />
                          Twitter Threads
                        </div>
                      </div>
                      <div className="pixel-socials">
                        <i className="fab fa-instagram" aria-hidden="true" />
                        <i className="fab fa-tiktok" aria-hidden="true" />
                        <Mail size={20} />
                      </div>
                    </>
                  )}
                  <span className="pixel-brand">CATLINK</span>
                </div>
              </div>
            </div>
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
