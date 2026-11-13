import EditorToolbar from "./EditorToolbar";
import PhonePreview, { type SavedPreview } from "./PhonePreview";

type Props = {
  savedPage?: SavedPreview;
  onSelectText?: (id: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};
export default function EditorCanvas({
  sidebarOpen,
  savedPage,
  onSelectText,
  onToggleSidebar,
}: Props) {
  return (
    <main className="flex-1 flex flex-col h-screen min-w-0">
      <EditorToolbar slug={savedPage?.slug} />
      <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center app-bg-pattern">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300 z-10">
          <button className="hover:text-primary">
            <span className="material-icons-round text-sm">remove</span>
          </button>
          <span>90%</span>
          <button className="hover:text-primary">
            <span className="material-icons-round text-sm">add</span>
          </button>
        </div>
        <PhonePreview page={savedPage} onSelectText={onSelectText} />
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-expanded={sidebarOpen}
          aria-controls="editor-inspector"
          aria-label={sidebarOpen ? "Hide right panel" : "Show right panel"}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-surface-dark text-white p-2 rounded-l-lg hover:bg-primary transition-colors"
        >
          <span className="material-icons-round">
            {sidebarOpen ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>
    </main>
  );
}
