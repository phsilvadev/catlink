import type { BlockDefinition } from "./blocks";

type Props = {
  block: BlockDefinition;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};
export default function BlockCard({
  block,
  selected,
  disabled = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Não incluído no seu plano" : undefined}
      aria-pressed={selected}
      aria-controls="editor-inspector"
      className={`disabled:opacity-50 disabled:cursor-not-allowed p-4 rounded-xl border flex flex-col items-center justify-center gap-2 hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "bg-primary border-primary text-white shadow-lg" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary"}`}
    >
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center ${selected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"}`}
      >
        <span className="material-icons-round text-xl" aria-hidden="true">
          {block.icon}
        </span>
      </span>
      <span className="text-sm font-medium">{block.label}</span>
      {disabled && <span className="text-[10px]">Não incluído</span>}
    </button>
  );
}
