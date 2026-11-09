import Image from "next/image";
import {
  BatteryFull,
  Globe,
  Camera,
  BriefcaseBusiness,
  Palette,
  Signal,
  Sparkles,
  Wifi,
} from "lucide-react";
import AuthBrand from "./AuthBrand";

export default function AuthShowcase() {
  return (
    <aside
      className="auth-showcase relative hidden min-h-screen w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-sidebar-dark lg:flex xl:w-5/12"
      aria-label="Conheça o Catlink"
    >
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative z-10 p-8">
        <AuthBrand light />
      </div>
      <div
        className="relative flex flex-1 items-center justify-center px-12 py-10"
        aria-hidden="true"
      >
        <div className="relative">
          <div className="relative h-[540px] w-[270px] overflow-hidden rounded-[40px] border-[7px] border-black bg-white shadow-phone">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-white">
              <span>9:41</span>
              <span className="flex gap-1">
                <Signal size={11} />
                <Wifi size={11} />
                <BatteryFull size={13} />
              </span>
            </div>
            <div className="h-32 rounded-b-[45%] bg-gradient-to-tr from-cyan-900 via-indigo-900 to-purple-800" />
            <div className="relative mx-auto -mt-10 h-[72px] w-[72px] overflow-hidden rounded-full border-4 border-white shadow-md">
              <Image
                src="/images/auth-avatar.png"
                alt=""
                fill
                sizes="72px"
                className="object-cover"
                priority
              />
            </div>
            <div className="px-4 pt-3 text-center">
              <p className="text-base font-bold text-gray-900">Rock Agency</p>
              <p className="mt-1 text-[9px] text-gray-500">
                Ideias e projetos que merecem ser vistos.
              </p>
            </div>
            <div className="space-y-3 px-4 pt-5 text-center text-[11px] font-semibold">
              <div className="flex items-center justify-center gap-2 rounded-full bg-gray-900 py-3 text-white shadow-md">
                <Globe size={12} />
                Visite nosso site
              </div>
              <div className="rounded-full border border-gray-200 py-3 text-gray-800">
                Últimos projetos
              </div>
              <div className="rounded-full border border-gray-200 py-3 text-gray-800">
                Fale com a gente
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3 text-gray-600">
              {[Camera, Sparkles, BriefcaseBusiness].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                >
                  <Icon size={12} />
                </span>
              ))}
            </div>
          </div>
          <div className="absolute -right-8 top-16 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-primary">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase text-gray-500">
                Seu espaço
              </p>
              <p className="text-xs font-bold text-gray-800">Sua identidade</p>
            </div>
          </div>
          <div className="absolute -left-6 bottom-28 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Palette size={15} />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase text-gray-500">
                Estilo
              </p>
              <p className="text-xs font-bold text-gray-800">Do seu jeito</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative p-8 text-white/90">
        <h2 className="mb-2 text-3xl font-bold">
          Tudo o que você é.
          <br />
          Em um só link.
        </h2>
        <p className="max-w-sm font-light leading-relaxed text-gray-400">
          Reúna seus links, mostre seu trabalho e crie uma página com a sua
          personalidade.
        </p>
      </div>
    </aside>
  );
}
