"use client";
import Link from "next/link";
import type { SavedPreview } from "./PhonePreview";

import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [values, setValues] = useState<Partial<Record<BlockType, BlockValues>>>(
    {},
  );
  const selectedBlock =
    blockDefinitions.find((block) => block.type === selectedType) ?? null;

  function selectBlock(type: BlockType) {
    if (!allowedBlocks.includes(type)) return;
    setSelectedType(type);
    setSidebarOpen(true);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <NavigationRail />
      {savedPage && (
        <Link
          href="/app"
          className="fixed bottom-4 left-20 z-50 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-md"
        >
          Minhas páginas · /{savedPage.slug} · Rascunho salvo
        </Link>
      )}
      <BlocksSidebar
        selectedType={selectedType}
        allowedBlocks={allowedBlocks}
        onSelect={selectBlock}
      />
      <EditorCanvas
        savedPage={savedPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <EditorInspector
        open={sidebarOpen}
        block={selectedBlock}
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
