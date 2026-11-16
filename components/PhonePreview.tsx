import PageContent from "./page/PageContent";
import PhoneFrame from "./page/PhoneFrame";
import type { Draft } from "@/lib/schemas/page";
import { demoProfile, entryTheme, type PageTheme } from "@/lib/page-appearance";

export type SavedPreview = {
  id: string;
  slug: string;
  revision: number;
  draft: Draft;
  theme: PageTheme;
};
export default function PhonePreview({
  page,
  onSelectText,
}: {
  page?: SavedPreview;
  onSelectText?: (id: string) => void;
}) {
  const theme = page?.theme || entryTheme("basic");
  return (
    <PhoneFrame lightStatus={theme.appearance === "pixel"} scroll>
      <PageContent
        draft={page?.draft || demoProfile("basic")}
        theme={theme}
        preview
        onSelectText={onSelectText}
      />
    </PhoneFrame>
  );
}
