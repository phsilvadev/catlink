import PageContent from "./page/PageContent";
import type { Draft } from "@/lib/schemas/page";
export type SavedPreview = {
  id: string;
  slug: string;
  draft: Draft;
  theme: { background: string; foreground: string; accent: string };
};
export default function PhonePreview({ page }: { page?: SavedPreview }) {
  if (page)
    return (
      <div className="relative h-[680px] w-[340px] overflow-y-auto rounded-[40px] border-[8px] border-black bg-white shadow-phone">
        <PageContent draft={page.draft} theme={page.theme} preview />
      </div>
    );
  return (
    <div className="relative w-[340px] h-[680px] bg-black rounded-[40px] shadow-phone border-[8px] border-black overflow-hidden z-0">
      <div className="absolute top-0 w-full h-8 z-20 flex justify-between items-center px-6 pt-2 text-white text-xs font-semibold">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-icons-round text-[10px]">
            signal_cellular_alt
          </span>
          <span className="material-icons-round text-[10px]">wifi</span>
          <span className="material-icons-round text-[10px] rotate-90">
            battery_full
          </span>
        </div>
      </div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
      <div className="w-full h-full bg-white relative overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="relative h-48 w-full overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-overlay">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-500 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute top-10 left-0 w-full px-4 flex justify-between items-center z-10 text-white">
            <div className="flex items-center gap-1 font-bold text-sm">
              <span className="material-icons-round text-base">
                auto_awesome
              </span>
              SmartBio
            </div>
            <button>
              <span className="material-icons-round text-xl">menu</span>
            </button>
          </div>
          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-[calc(140%+1.3px)] h-[50px] fill-white"
              data-name="Layer 1"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"></path>
            </svg>
          </div>
        </div>
        <div className="relative -mt-16 flex justify-center z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
            {/* Remote reference assets stay unoptimized until the image/storage implementation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeFeSw-apJZAHOd-ZWUvTc2365vx8RFlT6RZKJyJFUlUYOdt79yiX5ZG0VyC4VqT2CCt0diz2G5y7iteKDhoNIx-VT9f5cPvo-N8CwXrtEpMug4AIfEWYMWAnx8MJxoZKO9xFXG9kx50tEpG2S0mxdMQREIzyFw1plNyUZ6Qn_8bmkUkhKZgiUYG6iYYjVjqOkz1GBXoo5vrkqYHpjFTDDWZYwNbrqSS3A42Z8xBI7ieYU_krQMo9Z_jlPBuc7yU2bx5ifPD54O1bs"
            />
          </div>
        </div>
        <div className="text-center px-6 mt-3 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Rock Agency</h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto">
            Rock Agency is a digital agency company and website studio
            specializing in products, commerce, and SaaS website.
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <a
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            href="#"
          >
            <i className="fab fa-facebook-f text-sm"></i>
          </a>
          <a
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            href="#"
          >
            <i className="fab fa-instagram text-sm"></i>
          </a>
          <a
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            href="#"
          >
            <i className="fab fa-linkedin-in text-sm"></i>
          </a>
          <a
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            href="#"
          >
            <i className="fab fa-youtube text-sm"></i>
          </a>
        </div>
        <div className="px-4 mb-4">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative h-40 bg-gray-100">
            {/* Remote reference assets stay unoptimized until the image/storage implementation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Map Preview"
              className="w-full h-full object-cover opacity-80 grayscale-[30%]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHRZi_dBQEc4J6faJkbNwPyxBdKfYVv9epPDQPdyj1CpGwyUnSxqmYu_BtG9CAZKDN31Wct8LtkZtdQ_fv1O2uvcBmRdipe-l4zGjjIEdZ-k0Yddqng_8-eqov0Jl83r1FK_W-p3G837zTs50uGSC9fu_JKKmHyCOcoyt1hujxAAUhVQ9M5_P-EVxffUAxGIOA7ertVSx1Z2cZicwLG8yJE2NDxmxrVI40BiIaWJjkaORoB63Hs_KYcN-XF517PjIkNdhw1NkDJB5a"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
              </div>
              <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold shadow-sm text-primary">
                Union Coop Al
              </div>
              <button className="mt-1 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md">
                See Our Location
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 mb-8">
          <a
            className="block w-full bg-gray-900 text-white py-3 rounded-full text-sm font-semibold text-center shadow-lg relative group overflow-hidden"
            href="#"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="material-icons-round text-sm">public</span>
              Visit our website
              <span className="absolute right-4 text-xs">↗</span>
            </span>
          </a>
        </div>
        <div className="pb-6 flex justify-center items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200">
            <span>smartbio.ai/rockagency</span>
            <span className="material-icons-round text-[10px] bg-black text-white rounded-full p-[1px]">
              arrow_outward
            </span>
          </div>
        </div>
        <div className="pb-8 text-center text-[9px] text-gray-400">
          Upgrade to remove
        </div>
      </div>
    </div>
  );
}
