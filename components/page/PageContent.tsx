import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Draft } from "@/lib/schemas/page";

type Props = {
  draft: Draft;
  theme: {
    background: string;
    foreground: string;
    accent: string;
    appearance?: "aurora" | "sunset" | "mint" | "pixel";
  };
  preview?: boolean;
};
export default function PageContent({ draft, theme, preview = false }: Props) {
  const linkClass = preview ? "pointer-events-none" : "";
  const appearance = theme.appearance;
  const cover =
    appearance === "aurora"
      ? "linear-gradient(140deg,#02c7c7,#07052a 38%,#9200fa)"
      : appearance === "sunset"
        ? "linear-gradient(130deg,#ffecc4,#e5a3c9,#dc64ab)"
        : appearance === "mint"
          ? "linear-gradient(130deg,#d6dfbf,#55b8bf)"
          : null;
  const radius =
    appearance === "pixel"
      ? "0px"
      : appearance === "mint"
        ? "8px"
        : appearance === "sunset"
          ? "14px"
          : "999px";
  return (
    <div
      className="relative min-h-full px-5 pb-10 pt-10 text-center"
      style={{
        background: theme.background,
        color: theme.foreground,
        paddingTop: cover ? 96 : 80,
      }}
    >
      {cover && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-36"
          style={{ background: cover, clipPath: "ellipse(90% 100% at 50% 0)" }}
        />
      )}
      <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
        {draft.profile.avatarAssetId ? (
          <Image
            unoptimized
            src={`/api/assets/${draft.profile.avatarAssetId}`}
            alt="Foto do perfil"
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <UserRound size={32} />
        )}
      </div>
      <h1 className="break-words text-xl font-bold">{draft.profile.name}</h1>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm opacity-70">
        {draft.profile.bio}
      </p>
      <div className="mt-6 space-y-3">
        {draft.blocks
          .filter((block) => block.visible)
          .map((block) => {
            if (block.type === "text")
              return (
                <p
                  key={block.id}
                  className="whitespace-pre-wrap break-words text-sm"
                >
                  {block.content}
                </p>
              );
            if (block.type === "image")
              return (
                <div key={block.id} className="overflow-hidden rounded-xl">
                  <Image
                    unoptimized
                    src={block.url}
                    alt={block.alt}
                    width={500}
                    height={300}
                    className="h-auto w-full"
                  />
                </div>
              );
            if (block.type === "social")
              return (
                <div
                  key={block.id}
                  className="flex flex-wrap justify-center gap-2"
                >
                  {block.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={preview ? -1 : undefined}
                      className={`rounded-full border px-3 py-2 text-xs ${linkClass}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              );
            return (
              <a
                key={block.id}
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={preview ? -1 : undefined}
                className={`block break-words rounded-xl px-4 py-3 text-sm font-semibold ${linkClass}`}
                style={
                  block.type === "button"
                    ? {
                        background: theme.accent,
                        color: "#ffffff",
                        borderRadius: radius,
                      }
                    : {
                        border: `1px solid ${theme.foreground}30`,
                        borderRadius: radius,
                      }
                }
              >
                {block.label}
              </a>
            );
          })}
      </div>
    </div>
  );
}
