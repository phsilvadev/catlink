import TextBlockSettings, { type TextBlock } from "./TextBlockSettings";
import BlockSettings from "./BlockSettings";
import DesignSidebar from "./DesignSidebar";
import type { BlockDefinition, BlockValues } from "./blocks";

type Props = {
  defaultTextColor: string;
  textBlock: TextBlock | null;
  onTextChange: (block: TextBlock) => void;
  onDeleteText: () => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  error: string;
  open: boolean;
  block: BlockDefinition | null;
  values: BlockValues;
  onChange: (key: string, value: string) => void;
  onCloseBlock: () => void;
};
export default function EditorInspector({
  defaultTextColor,
  textBlock,
  onTextChange,
  onDeleteText,
  onSave,
  saving,
  dirty,
  error,
  open,
  block,
  values,
  onChange,
  onCloseBlock,
}: Props) {
  return (
    <aside
      id="editor-inspector"
      aria-label={
        block?.type === "text"
          ? "Configurações do bloco de texto"
          : block
            ? `${block.label} settings`
            : "Page design"
      }
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(event) => {
        if (event.key === "Escape" && block) onCloseBlock();
      }}
      className={`bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-700 shrink-0 z-20 overflow-hidden transition-[width] duration-300 motion-reduce:transition-none ${open ? "w-80 border-l" : "w-0"}`}
    >
      <div className={`h-full overflow-y-auto custom-scrollbar w-80`}>
        {block?.type === "text" && textBlock ? (
          <TextBlockSettings
            block={textBlock}
            defaultColor={defaultTextColor}
            onChange={onTextChange}
            onClose={onCloseBlock}
            onDelete={onDeleteText}
            onSave={onSave}
            saving={saving}
            dirty={dirty}
            error={error}
          />
        ) : block ? (
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
