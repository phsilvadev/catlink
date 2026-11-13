"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Signal,
  Wifi,
  BatteryFull,
  Globe,
  Type,
  Link as LinkIcon,
  Image as ImageIcon,
  CalendarDays,
  Check,
} from "lucide-react";
export default function EntryShowcase({
  expanded = false,
  selectedTheme,
}: {
  expanded?: boolean;
  selectedTheme?: string;
}) {
  const [demoTheme, setDemoTheme] = useState("basic");
  const [block, setBlock] = useState<string | null>(null);
  const theme = expanded ? selectedTheme || "basic" : demoTheme;
  return (
    <aside
      className="login-showcase"
      aria-label="Conheça o Catlink"
      lang="pt-BR"
    >
      <div className="showcase-dots top" aria-hidden="true"></div>
      <div className="showcase-dots bottom" aria-hidden="true"></div>
      <div className="showcase-content">
        <h2 className="showcase-heading">
          {expanded ? (
            <>
              Seu estilo,
              <br />
              <span>sua identidade.</span>
            </>
          ) : (
            <>
              Seu próximo capítulo,
              <br />
              <span>começa com um link.</span>
            </>
          )}
        </h2>
        <p className="showcase-description">
          {expanded
            ? "Escolha um modelo para dar vida à sua página."
            : "Escolha um nome para reunir suas ideias, seus contatos e tudo o que você faz."}
        </p>
        <div className="showcase-preview">
          <div className="showcase-phone" data-theme={theme} aria-busy="false">
            <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] shadow-phone border-[8px] border-black overflow-hidden z-0">
              <div className="phone-status absolute top-0 w-full h-8 z-20 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                  <Signal size={10} aria-hidden="true" />
                  <Wifi size={10} aria-hidden="true" />
                  <BatteryFull size={10} aria-hidden="true" />
                </div>
              </div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div>
              <div className="phone-screen w-full h-full bg-white relative overflow-hidden">
                <div className="phone-skeleton hidden" aria-hidden="true">
                  <span className="skeleton-avatar"></span>
                  <span className="skeleton-title"></span>
                  <span className="skeleton-description"></span>
                  <span className="skeleton-link"></span>
                  <span className="skeleton-link"></span>
                  <span className="skeleton-link"></span>
                </div>
                <div className="relative h-36 w-full overflow-hidden bg-white">
                  <div className="phone-cover absolute inset-0 bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800"></div>
                  <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
                    <svg
                      className="relative block w-[calc(140%+1.3px)] h-[30px] fill-white"
                      preserveAspectRatio="none"
                      viewBox="0 0 1200 120"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="relative -mt-12 flex justify-center z-10">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                    <Image
                      alt="Perfil de exemplo"
                      className="w-full h-full object-cover"
                      src="/images/auth-avatar.png"
                      width={80}
                      height={80}
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
                <div className="phone-links px-4 space-y-3">
                  {block && (
                    <div className="preview-added" data-testid="demo-block">
                      {block === "text" ? (
                        "Seu conteúdo, do seu jeito."
                      ) : block === "link" ? (
                        "Seu novo link"
                      ) : block === "image" ? (
                        <Image
                          src="/images/auth-avatar.png"
                          width={200}
                          height={60}
                          alt="Exemplo de bloco de imagem"
                        />
                      ) : (
                        <>
                          <CalendarDays size={16} /> Agende uma conversa
                        </>
                      )}
                    </div>
                  )}
                  <div className="bg-gray-900 text-white py-2.5 rounded-full text-xs font-bold text-center shadow-md flex items-center justify-center gap-2">
                    <Globe size={12} aria-hidden="true" /> Visit Website
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                    Latest Projects
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                    Book a Call
                  </div>
                </div>
                <div className="phone-socials flex justify-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="18" cy="6" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.6 1 4.2 4.2 0 0 0-7.2 3.8 11.9 11.9 0 0 1-8.6-4.4 4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5 4.2 4.2 0 0 0 3.4 4.2 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 18.7a11.8 11.8 0 0 0 18.2-9.9A8.4 8.4 0 0 0 22 5.9Z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <span className="text-xs font-bold" aria-hidden="true">
                      in
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="showcase-cards">
            <section className="showcase-card">
              <h3>Blocos prontos</h3>
              <div className="showcase-blocks">
                <button
                  type="button"
                  className="showcase-block"
                  data-preview-block="text"
                  aria-pressed={block === "text"}
                  onClick={() => setBlock(block === "text" ? null : "text")}
                >
                  <Type size={24} aria-hidden="true" />
                  Texto
                </button>
                <button
                  type="button"
                  className="showcase-block"
                  data-preview-block="link"
                  aria-pressed={block === "link"}
                  onClick={() => setBlock(block === "link" ? null : "link")}
                >
                  <LinkIcon size={24} aria-hidden="true" />
                  Link
                </button>
                <button
                  type="button"
                  className="showcase-block"
                  data-preview-block="image"
                  aria-pressed={block === "image"}
                  onClick={() => setBlock(block === "image" ? null : "image")}
                >
                  <ImageIcon size={24} aria-hidden="true" />
                  Imagem
                </button>
                <button
                  type="button"
                  className="showcase-block"
                  data-preview-block="calendar"
                  aria-pressed={block === "calendar"}
                  onClick={() =>
                    setBlock(block === "calendar" ? null : "calendar")
                  }
                >
                  <CalendarDays size={24} aria-hidden="true" />
                  Calendário
                </button>
              </div>
            </section>
            <section className="showcase-card">
              <h3>Temas personalizados</h3>
              <div
                className="showcase-themes"
                role="group"
                aria-label="Experimentar temas"
              >
                <button
                  type="button"
                  className="showcase-theme"
                  data-preview-theme="basic"
                  aria-label="Experimentar tema Aurora"
                  aria-pressed={theme === "basic"}
                  onClick={() => setDemoTheme("basic")}
                >
                  <span className="theme-cover" aria-hidden="true"></span>
                  <span className="theme-avatar" aria-hidden="true"></span>
                  <span className="theme-lines" aria-hidden="true"></span>
                  <span className="theme-socials" aria-hidden="true"></span>
                  <Check size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="showcase-theme theme-sunset"
                  data-preview-theme="sunset"
                  aria-label="Experimentar tema Rosa"
                  aria-pressed={theme === "sunset"}
                  onClick={() => setDemoTheme("sunset")}
                >
                  <span className="theme-cover" aria-hidden="true"></span>
                  <span className="theme-avatar" aria-hidden="true"></span>
                  <span className="theme-lines" aria-hidden="true"></span>
                  <span className="theme-socials" aria-hidden="true"></span>
                  <Check size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="showcase-theme theme-mint"
                  data-preview-theme="mint"
                  aria-label="Experimentar tema Menta"
                  aria-pressed={theme === "mint"}
                  onClick={() => setDemoTheme("mint")}
                >
                  <span className="theme-cover" aria-hidden="true"></span>
                  <span className="theme-avatar" aria-hidden="true"></span>
                  <span className="theme-lines" aria-hidden="true"></span>
                  <span className="theme-socials" aria-hidden="true"></span>
                  <Check size={16} aria-hidden="true" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
