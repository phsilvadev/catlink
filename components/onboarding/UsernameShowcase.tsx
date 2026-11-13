import Image from "next/image";
import {
  Sparkles,
  Signal,
  Wifi,
  BatteryFull,
  Globe,
  TrendingUp,
  Palette,
} from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

// Converted directly from the HTML supplied for the username step.
export default function UsernameShowcase() {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-sidebar-dark relative flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 auth-showcase bg-sidebar-dark opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sidebar-dark/50 to-sidebar-dark"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen"></div>
      <div className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Catlink
          </span>
        </div>
        <SignOutButton />
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center perspective-[1000px]">
        <div className="relative transform rotate-y-12 rotate-z-6 scale-90 hover:rotate-y-0 hover:rotate-z-0 transition-all duration-700 ease-out shadow-2xl rounded-[45px]">
          <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] shadow-phone border-[8px] border-black overflow-hidden z-0">
            <div className="absolute top-0 w-full h-8 z-20 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold">
              <span>9:41</span>
              <div className="flex gap-1.5 items-center">
                <Signal size={10} aria-hidden="true" />
                <Wifi size={10} aria-hidden="true" />
                <BatteryFull size={10} aria-hidden="true" />
              </div>
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div>
            <div className="w-full h-full bg-white relative overflow-hidden">
              <div className="relative h-36 w-full overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800"></div>
                <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
                  <svg
                    className="relative block w-[calc(140%+1.3px)] h-[30px] fill-white"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"></path>
                  </svg>
                </div>
              </div>
              <div className="relative -mt-12 flex justify-center z-10">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                  <Image
                    alt="Exemplo de perfil"
                    className="w-full h-full object-cover"
                    src="/images/auth-avatar.png"
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <div className="text-center px-4 mt-2 mb-4">
                <h1 className="text-lg font-bold text-gray-900">Rock Agency</h1>
                <p className="text-[10px] text-gray-500 mt-1">
                  Digital agency specializing in SaaS products.
                </p>
              </div>
              <div className="px-4 space-y-3">
                <div className="bg-gray-900 text-white py-2.5 rounded-full text-xs font-bold text-center shadow-md flex items-center justify-center gap-2">
                  <Globe size={12} aria-hidden="true" /> Visit Website
                </div>
                <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                  Latest Projects
                </div>
                <div className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full text-xs font-bold text-center shadow-sm">
                  Book a Call
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <i className="fab fa-instagram text-xs"></i>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <i className="fab fa-twitter text-xs"></i>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <i className="fab fa-linkedin-in text-xs"></i>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute -right-8 top-20 bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <TrendingUp size={14} aria-hidden="true" />
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">
                Clicks
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-white">
                2.4k
              </div>
            </div>
          </div>
          <div
            className="absolute -left-6 bottom-32 bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Palette size={14} aria-hidden="true" />
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">
                Theme
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-white">
                Dark
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 p-8 text-white/90">
        <h2 className="text-3xl font-bold mb-2">One link to rule them all.</h2>
        <p className="text-gray-400 font-light max-w-sm">
          Join thousands of creators using Catlink for their link in bio. Share
          more, sell more, grow more.
        </p>
      </div>
    </div>
  );
}
