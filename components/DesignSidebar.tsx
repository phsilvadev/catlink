export default function DesignSidebar() {
  return (
    <div className="p-6 pb-2">
      <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full flex text-sm font-medium mb-6">
        <button className="flex-1 py-1.5 rounded-full bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white transition-all">
          Design
        </button>
        <button className="flex-1 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all">
          Analytics
        </button>
        <button className="flex-1 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all">
          Settings
        </button>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-2">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">
            AI Generator
          </h3>
          <span className="material-icons-round text-gray-400 text-sm">
            info
          </span>
        </div>
        <div className="relative">
          <textarea
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-300 h-24 resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="A linkbio profile for an agency company"
          ></textarea>
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary rounded-full"></div>
          </div>
        </div>
        <button className="mt-3 w-full py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <span className="material-icons-round text-sm">auto_awesome</span>{" "}
          Generate BioLink with AI
        </button>
      </div>
      <hr className="border-gray-200 dark:border-gray-700 mb-6" />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">
            Select Theme
          </h3>
          <button className="text-gray-400 hover:text-primary">
            <span className="material-icons-round text-sm">remove</span>
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full flex text-xs font-medium mb-4">
          <button className="flex-1 py-1.5 rounded-full bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white">
            All
          </button>
          <button className="flex-1 py-1.5 rounded-full text-gray-500 dark:text-gray-400">
            Light
          </button>
          <button className="flex-1 py-1.5 rounded-full text-gray-500 dark:text-gray-400">
            Dark
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden border-2 border-primary cursor-pointer group">
            <div className="h-12 w-full bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800"></div>
            <div className="bg-white p-2">
              <div className="w-8 h-8 -mt-6 mx-auto rounded-full bg-gray-200 border-2 border-white relative z-10">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-icons-round text-[10px]">
                    image
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1 w-12 mx-auto bg-gray-200 rounded-full"></div>
              <div className="mt-1.5 flex justify-center gap-1">
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
            <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
              <span className="material-icons-round text-[10px]">check</span>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-colors">
            <div className="h-12 w-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400"></div>
            <div className="bg-white p-2">
              <div className="w-8 h-8 -mt-6 mx-auto rounded-full bg-gray-200 border-2 border-white relative z-10">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-icons-round text-[10px]">
                    image
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1 w-12 mx-auto bg-gray-200 rounded-full"></div>
              <div className="mt-1.5 flex justify-center gap-1">
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-colors">
            <div className="h-12 w-full bg-gradient-to-b from-teal-400 to-emerald-600"></div>
            <div className="bg-white p-2">
              <div className="w-8 h-8 -mt-6 mx-auto rounded-full bg-gray-200 border-2 border-white relative z-10">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-icons-round text-[10px]">
                    image
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1 w-12 mx-auto bg-gray-200 rounded-full"></div>
              <div className="mt-1.5 flex justify-center gap-1">
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-colors">
            <div className="h-12 w-full bg-gradient-to-tr from-slate-900 to-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-pink-500/20"></div>
            </div>
            <div className="bg-white p-2">
              <div className="w-8 h-8 -mt-6 mx-auto rounded-full bg-gray-200 border-2 border-white relative z-10">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-icons-round text-[10px]">
                    image
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1 w-12 mx-auto bg-gray-200 rounded-full"></div>
              <div className="mt-1.5 flex justify-center gap-1">
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
                <div className="h-2 w-2 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        <button className="mt-3 text-primary text-xs font-bold hover:underline">
          See All Theme
        </button>
      </div>
      <hr className="border-gray-200 dark:border-gray-700 mb-6" />
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">
            Typography
          </h3>
          <button className="text-gray-400 hover:text-primary">
            <span className="material-icons-round text-sm">remove</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Font Weight
            </span>
            <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-8 rounded-lg flex items-center justify-between px-2 text-xs text-gray-700 dark:text-gray-300">
              <span>Regular</span>
              <span className="material-icons-round text-sm text-gray-400">
                expand_more
              </span>
            </button>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Font Style
            </span>
            <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-8 rounded-lg flex items-center justify-between px-2 text-xs text-gray-700 dark:text-gray-300">
              <span>Inter</span>
              <span className="material-icons-round text-sm text-gray-400">
                expand_more
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
