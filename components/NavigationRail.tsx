import Link from "next/link";
import SignOutButton from "./auth/SignOutButton";
export default function NavigationRail() {
  return (
    <aside className="w-16 bg-sidebar-dark flex flex-col items-center py-6 shrink-0 z-30">
      <div className="mb-8">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="material-icons-round text-white text-xl">
            auto_awesome
          </span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        <Link
          href="/app"
          aria-label="Minhas páginas"
          className="p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons-round">home</span>
        </Link>
        <Link
          href="/app/catalogo"
          aria-label="Catálogo de modelos e blocos"
          title="Catálogo de modelos e blocos"
          className="p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons-round">storefront</span>
        </Link>
        <button className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
          <span className="material-icons-round text-xl">add</span>
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
          <span className="material-icons-round text-xl">dashboard</span>
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
          <span className="material-icons-round text-xl">image</span>
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
          <span className="material-icons-round text-xl">layers</span>
        </button>
      </nav>
      <div className="flex flex-col gap-6 mt-auto">
        <SignOutButton />
        <button className="text-gray-400 hover:text-white transition-colors">
          <span className="material-icons-round text-xl">settings</span>
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <span className="material-icons-round text-xl">help_outline</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border-2 border-gray-700">
          {/* Remote reference assets stay unoptimized until the image/storage implementation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtaV1IJwokVYf4tIWvqT0wRsKXzPXupi6kKG30GeFyphjd-Q6ce4jTZPUZZ8Y42uR3Z0oUifebnnX5CpGSehBlORCx9Zc8V-2rIFTX_POwd5aXbZ3d3gCLf0Ween9SD-lbahMg-5xdtOS0HnlmPALxFaL9m4TlqOwI7TCZdwyl4wwmxnppIrHOTaRcCFQ_8OOFIZ6ag0WKXvYlB9pP57c62myDlmA1oRfaWrr1uYnXx8ywkCRyXXCy-LZzEvime5BAVNe66rl5PBBu"
          />
        </div>
      </div>
    </aside>
  );
}
