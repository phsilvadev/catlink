export default function BlocksSidebar() {
  return (
<aside className="w-80 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 z-20 hidden lg:flex">
<div className="p-6 overflow-y-auto custom-scrollbar h-full">
<div className="flex justify-between items-center mb-6">
<h2 className="font-bold text-lg dark:text-white">Add Blocks</h2>
<button className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
<span className="material-icons-round">remove</span>
</button>
</div>
<div className="grid grid-cols-2 gap-4 mb-8">
<div className="bg-primary text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-1 transition-transform relative overflow-hidden group">
<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
<span className="material-icons-round text-xl">title</span>
</div>
<span className="text-sm font-medium">Text</span>
<div className="absolute -top-2 -left-2 text-white drop-shadow-md transform rotate-12 pointer-events-none">
<svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" stroke="black" strokeLinejoin="round" strokeWidth="1.5"></path>
</svg>
</div>
</div>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center">
<span className="material-icons-round text-xl">calendar_today</span>
</div>
<span className="text-sm font-medium text-gray-600 dark:text-gray-300">Calendar</span>
</div>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center">
<span className="material-icons-round text-xl">list_alt</span>
</div>
<span className="text-sm font-medium text-gray-600 dark:text-gray-300">Booking List</span>
</div>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center">
<span className="material-icons-round text-xl">image</span>
</div>
<span className="text-sm font-medium text-gray-600 dark:text-gray-300">Image</span>
</div>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center">
<span className="material-icons-round text-xl">smart_button</span>
</div>
<span className="text-sm font-medium text-gray-600 dark:text-gray-300">Button</span>
</div>
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center">
<span className="material-icons-round text-xl">link</span>
</div>
<span className="text-sm font-medium text-gray-600 dark:text-gray-300">Link</span>
</div>
</div>
<button className="w-full py-3 bg-primary text-white rounded-xl font-medium shadow-md hover:bg-primary-dark transition-colors mb-8">
                See Another Blocks
            </button>
<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
<div className="flex justify-between items-center mb-4">
<h3 className="font-bold text-gray-800 dark:text-white">Social Media</h3>
<button className="text-gray-400 hover:text-primary dark:hover:text-primary">
<span className="material-icons-round">remove</span>
</button>
</div>
<div className="space-y-4">
<div className="flex items-center gap-3 group cursor-pointer">
<div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
<i className="fab fa-instagram text-sm"></i>
</div>
<span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">instagram.com/rockagency</span>
<button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-icons-round text-sm">delete</span>
</button>
</div>
<div className="flex items-center gap-3 group cursor-pointer">
<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
<i className="fab fa-facebook-f text-sm"></i>
</div>
<span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">facebook.com/rockagency</span>
<button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-icons-round text-sm">delete</span>
</button>
</div>
<div className="flex items-center gap-3 group cursor-pointer">
<div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white shrink-0">
<i className="fab fa-linkedin-in text-sm"></i>
</div>
<span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">linkedin.com/rockagency</span>
<button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-icons-round text-sm">delete</span>
</button>
</div>
<div className="flex items-center gap-3 group cursor-pointer">
<div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
<i className="fab fa-youtube text-sm"></i>
</div>
<span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">youtube.com/rockagency</span>
<button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-icons-round text-sm">delete</span>
</button>
</div>
</div>
</div>
</div>
</aside>
  );
}
