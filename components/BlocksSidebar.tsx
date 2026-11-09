import { blockDefinitions, type BlockType } from "./blocks";
import BlockCard from "./BlockCard";
import SocialMediaSection from "./SocialMediaSection";

type Props = {
  allowedBlocks: string[];
  selectedType: BlockType | null;
  onSelect: (type: BlockType) => void;
};
export default function BlocksSidebar({
  selectedType,
  allowedBlocks,
  onSelect,
}: Props) {
  return (
    <aside
      aria-label="Block library"
      className="w-80 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 z-20 hidden lg:flex"
    >
      <div className="p-6 overflow-y-auto custom-scrollbar h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg dark:text-white">Add Blocks</h2>
          <button className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
            <span className="material-icons-round">remove</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {blockDefinitions.map((block) => (
            <BlockCard
              key={block.type}
              block={block}
              disabled={!allowedBlocks.includes(block.type)}
              selected={selectedType === block.type}
              onClick={() => onSelect(block.type)}
            />
          ))}
        </div>
        <button className="w-full py-3 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-primary-dark transition-colors mb-8">
          See Another Blocks
        </button>
        {allowedBlocks.includes("social") && <SocialMediaSection />}
      </div>
    </aside>
  );
}
