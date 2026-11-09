export default function SocialMediaSection() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white">
          Social Media
        </h3>
        <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
          <span className="material-icons-round">remove</span>
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
            <i className="fab fa-instagram text-sm"></i>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
            instagram.com/rockagency
          </span>
          <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-round text-sm">delete</span>
          </button>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <i className="fab fa-facebook-f text-sm"></i>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
            facebook.com/rockagency
          </span>
          <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-round text-sm">delete</span>
          </button>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white shrink-0">
            <i className="fab fa-linkedin-in text-sm"></i>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
            linkedin.com/rockagency
          </span>
          <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-round text-sm">delete</span>
          </button>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
            <i className="fab fa-youtube text-sm"></i>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
            youtube.com/rockagency
          </span>
          <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-round text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
