import Image from "next/image";
import { UserRound } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { Draft } from "@/lib/schemas/page";
import type { PageTheme } from "@/lib/page-appearance";
import "./page-content.css";

export default function PageContent({
  draft,
  theme,
  preview = false,
  children,
  onSelectText,
}: {
  draft: Draft;
  theme: PageTheme;
  preview?: boolean;
  children?: ReactNode;
  onSelectText?: (id: string) => void;
}) {
  const appearance = theme.appearance || "aurora";
  return (
    <div
      className={`profile-page profile-${appearance}`}
      data-appearance={appearance}
      style={
        {
          background: theme.background,
          color: theme.foreground,
          "--profile-accent": theme.accent,
        } as CSSProperties
      }
    >
      {appearance !== "pixel" && (
        <div className="profile-cover" aria-hidden="true">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ fill: theme.background }}
          >
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" />
          </svg>
        </div>
      )}
      <div className="profile-avatar">
        {draft.profile.avatarAssetId || draft.profile.avatarPreset ? (
          <Image
            unoptimized={!!draft.profile.avatarAssetId}
            src={
              draft.profile.avatarAssetId
                ? `/api/assets/${draft.profile.avatarAssetId}`
                : "/images/auth-avatar.png"
            }
            alt="Foto do perfil"
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <UserRound size={32} aria-hidden="true" />
        )}
      </div>
      <div className="profile-heading">
        <h1>
          {draft.profile.name}
          {draft.profile.avatarPreset && appearance === "pixel" && (
            <span
              className="material-icons-round profile-verified"
              aria-label="Verificado"
            >
              verified
            </span>
          )}
        </h1>
        <p>{draft.profile.bio}</p>
      </div>
      <div className="profile-blocks">
        {children ||
          draft.blocks
            .filter((block) => block.visible)
            .map((block) => {
              if (block.type === "text")
                return (
                  <div
                    data-text-block={block.id}
                    data-testid="page-text-block"
                    key={block.id}
                    role={preview && onSelectText ? "button" : undefined}
                    tabIndex={preview && onSelectText ? 0 : undefined}
                    aria-label={
                      preview && onSelectText
                        ? "Editar bloco de texto"
                        : undefined
                    }
                    onClick={() => onSelectText?.(block.id)}
                    onKeyDown={(event) => {
                      if (
                        onSelectText &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        onSelectText(block.id);
                      }
                    }}
                    className="profile-text"
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      fontWeight: block.style?.bold ? 700 : 400,
                      fontStyle: block.style?.italic ? "italic" : "normal",
                      textDecoration: block.style?.underline
                        ? "underline"
                        : "none",
                      textAlign: block.style?.align || "center",
                      fontSize: block.style?.fontSize ?? 16,
                      color: block.style?.color || theme.foreground,
                      background: block.style?.background || "transparent",
                      paddingTop: block.style?.paddingTop ?? 16,
                      paddingBottom: block.style?.paddingBottom ?? 16,
                    }}
                  >
                    {block.content}
                  </div>
                );
              if (block.type === "image")
                return (
                  <div key={block.id} className="profile-image">
                    <Image
                      unoptimized
                      src={block.url}
                      alt={block.alt}
                      width={500}
                      height={300}
                    />
                  </div>
                );
              if (block.type === "social")
                return (
                  <div className="profile-socials" key={block.id}>
                    {block.items.map((item, i) => {
                      const icon = (
                        {
                          Instagram: "fab fa-instagram",
                          TikTok: "fab fa-tiktok",
                          "E-mail": "far fa-envelope",
                          X: "fab fa-twitter",
                          LinkedIn: "fab fa-linkedin-in",
                        } as Record<string, string>
                      )[item.label];
                      return (
                        <a
                          href={item.url}
                          key={i}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={preview ? -1 : undefined}
                          aria-label={item.label}
                          className={preview ? "pointer-events-none" : ""}
                        >
                          {icon ? (
                            <i className={icon} aria-hidden="true" />
                          ) : (
                            item.label
                          )}
                        </a>
                      );
                    })}
                  </div>
                );
              return (
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={preview ? -1 : undefined}
                  key={block.id}
                  className={`profile-link ${block.type === "button" ? "profile-button" : ""} ${preview ? "pointer-events-none" : ""}`}
                >
                  {block.icon && (
                    <i
                      className={
                        block.icon === "youtube"
                          ? "fab fa-youtube text-red-500"
                          : block.icon === "twitter"
                            ? "fab fa-twitter text-blue-400"
                            : "fas fa-globe"
                      }
                      aria-hidden="true"
                    />
                  )}
                  {block.label}
                </a>
              );
            })}
      </div>
      {appearance === "pixel" && <span className="profile-brand">CATLINK</span>}
    </div>
  );
}
