"use client";

import { useState } from "react";
import NavigationRail from "./NavigationRail";
import BlocksSidebar from "./BlocksSidebar";
import EditorCanvas from "./EditorCanvas";
import EditorInspector from "./EditorInspector";
import { blockDefinitions, type BlockType, type BlockValues } from "./blocks";

export default function BioLinkEditor({
  allowedBlocks = [],
}: {
  allowedBlocks?: string[];
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
      <BlocksSidebar
        selectedType={selectedType}
        allowedBlocks={allowedBlocks}
        onSelect={selectBlock}
      />
      <EditorCanvas
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
