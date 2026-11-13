"use client";
import Link from "next/link";
import { useState } from "react";
import type { SavedPreview } from "./PhonePreview";
import type { Draft } from "@/lib/schemas/page";
import { demoProfile } from "@/lib/page-appearance";
import type { TextBlock } from "./TextBlockSettings";
import NavigationRail from "./NavigationRail";
import BlocksSidebar from "./BlocksSidebar";
import EditorCanvas from "./EditorCanvas";
import EditorInspector from "./EditorInspector";
import { blockDefinitions, type BlockType, type BlockValues } from "./blocks";

export default function BioLinkEditor({
  allowedBlocks = [],
  savedPage,
}: {
  allowedBlocks?: string[];
  savedPage?: SavedPreview;
}) {
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [values, setValues] = useState<Partial<Record<BlockType, BlockValues>>>(
    {},
  );
  const [draft, setDraft] = useState<Draft>(
    savedPage?.draft || demoProfile("basic"),
  );
  const [savedDraft, setSavedDraft] = useState(draft);
  const [revision, setRevision] = useState(savedPage?.revision || 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(savedDraft);
  const selectedBlock =
    blockDefinitions.find((block) => block.type === selectedType) ?? null;
  const textBlock =
    draft.blocks.find(
      (block): block is TextBlock =>
        block.type === "text" && block.id === selectedTextId,
    ) || null;
  function selectBlock(type: BlockType) {
    if (saving || !allowedBlocks.includes(type)) return;
    if (type === "text") {
      const existing =
        draft.blocks.find(
          (block) =>
            block.type === "text" &&
            (block.id === selectedTextId || !selectedTextId),
        ) || draft.blocks.find((block) => block.type === "text");
      if (existing) setSelectedTextId(existing.id);
      else {
        const block: TextBlock = {
          id: crypto.randomUUID(),
          type: "text",
          visible: true,
          content: "",
        };
        setDraft((current) => ({
          ...current,
          blocks: [...current.blocks, block],
        }));
        setSelectedTextId(block.id);
      }
    }
    setSelectedType(type);
    setSidebarOpen(true);
    setError("");
  }
  async function persist(candidate: Draft) {
    if (saving) return false;
    if (!savedPage) {
      setError("Abra uma página da sua conta para salvar o rascunho.");
      return false;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/pages/${savedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: revision, draft: candidate }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Não foi possível salvar. Tente novamente.");
        return false;
      }
      setDraft(result.data.draft);
      setSavedDraft(result.data.draft);
      setRevision(result.data.revision);
      return true;
    } catch {
      setError(
        "Não foi possível conectar. Suas alterações continuam nesta tela.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  }
  async function deleteText() {
    if (!textBlock) return;
    const candidate = {
      ...draft,
      blocks: draft.blocks.filter((block) => block.id !== textBlock.id),
    };
    if (await persist(candidate)) {
      setSelectedType(null);
      setSelectedTextId(null);
    }
  }
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <NavigationRail />
      {savedPage && (
        <Link
          href="/app"
          className="fixed bottom-4 left-20 z-50 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-md"
          role="status"
        >
          Minhas páginas · /{savedPage.slug} ·{" "}
          {saving
            ? "Salvando…"
            : dirty
              ? "Alterações não salvas"
              : "Rascunho salvo"}
        </Link>
      )}
      <BlocksSidebar
        selectedType={selectedType}
        allowedBlocks={allowedBlocks}
        onSelect={selectBlock}
      />
      <EditorCanvas
        savedPage={savedPage ? { ...savedPage, draft, revision } : undefined}
        sidebarOpen={sidebarOpen}
        onSelectText={(id) => {
          if (saving || !allowedBlocks.includes("text")) return;
          setSelectedTextId(id);
          setSelectedType("text");
          setSidebarOpen(true);
        }}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <EditorInspector
        defaultTextColor={savedPage?.theme.foreground || "#111827"}
        open={sidebarOpen}
        block={selectedBlock}
        textBlock={textBlock}
        saving={saving}
        dirty={dirty}
        error={error}
        onSave={() => void persist(draft)}
        onDeleteText={() => void deleteText()}
        onTextChange={(block) => {
          setDraft((current) => ({
            ...current,
            blocks: current.blocks.map((item) =>
              item.id === block.id ? block : item,
            ),
          }));
          setError("");
        }}
        values={selectedType ? (values[selectedType] ?? {}) : {}}
        onCloseBlock={() => setSelectedType(null)}
        onChange={(key, value) => {
          if (selectedType)
            setValues((current) => ({
              ...current,
              [selectedType]: { ...current[selectedType], [key]: value },
            }));
        }}
      />
    </div>
  );
}
