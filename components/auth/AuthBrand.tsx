import { Sparkles } from "lucide-react";

export default function AuthBrand({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 ${light ? "text-white" : "text-gray-900"}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-lg">
        <Sparkles size={21} aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight">Catlink</span>
    </div>
  );
}
