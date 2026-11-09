export default function EditorToolbar() {
  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
          <span className="material-icons-round text-lg">smartphone</span>
          <span className="material-icons-round text-lg text-gray-300 dark:text-gray-600">
            desktop_windows
          </span>
          <div className="ml-2 flex flex-col leading-tight">
            <span className="text-xs">Size</span>
            <span className="font-bold text-gray-800 dark:text-white">
              375 x 812
            </span>
          </div>
          <span className="material-icons-round text-gray-400 text-sm ml-1">
            info
          </span>
        </div>
      </div>
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">https://</span>
          </div>
          <input
            className="block w-full pl-16 pr-24 py-2 border-none rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-primary/50 transition-all"
            type="text"
            defaultValue="smartbio.ai/rockagency"
          />
          <button className="absolute right-1 top-1 bottom-1 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-full transition-colors">
            Connect Domain
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <span className="material-icons-round text-lg">undo</span> Undo
          </button>
          <button className="flex items-center gap-1 hover:text-primary transition-colors ml-2">
            <span className="material-icons-round text-lg">redo</span> Redo
          </button>
        </div>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          <button className="p-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm text-yellow-500">
            <span className="material-icons-round text-sm">wb_sunny</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="material-icons-round text-sm">dark_mode</span>
          </button>
        </div>
        <button className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span className="material-icons-round text-lg">visibility</span>
        </button>
        <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all">
          <span className="material-icons-round text-sm">rocket_launch</span>
          Publish
          <span className="material-icons-round text-sm">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </header>
  );
}
