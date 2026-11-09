import BlockSettings from "./BlockSettings";
import DesignSidebar from "./DesignSidebar";
import type { BlockDefinition, BlockValues } from "./blocks";

type Props = {
  open: boolean;
  block: BlockDefinition | null;
  values: BlockValues;
  onChange: (key: string, value: string) => void;
  onCloseBlock: () => void;
};
export default function EditorInspector({
  open,
  block,
  values,
  onChange,
  onCloseBlock,
}: Props) {
  return (
    <aside
      id="editor-inspector"
      aria-label={block ? `${block.label} settings` : "Page design"}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(event) => {
        if (event.key === "Escape" && block) onCloseBlock();
      }}
      className={`bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-700 shrink-0 z-20 overflow-hidden transition-[width] duration-300 motion-reduce:transition-none ${open ? (block ? "w-96 border-l" : "w-80 border-l") : "w-0"}`}
    >
      <div
        className={`h-full overflow-y-auto custom-scrollbar ${block ? "w-96" : "w-80"}`}
      >
        {block ? (
          <BlockSettings
            block={block}
            values={values}
            onChange={onChange}
            onClose={onCloseBlock}
          />
        ) : (
          <DesignSidebar />
        )}
      </div>
    </aside>
  );
}
