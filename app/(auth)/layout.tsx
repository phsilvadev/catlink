import AuthBrand from "@/components/auth/AuthBrand";
import AuthShowcase from "@/components/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800">
      <AuthShowcase />
      <main className="flex min-h-screen min-w-0 flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 lg:p-12">
        <div className="mb-12 self-start lg:hidden">
          <AuthBrand />
        </div>
        <div className="w-full max-w-[420px]">{children}</div>
        <p className="mt-12 text-center text-xs text-gray-400">
          Catlink · Seus links, sua identidade.
        </p>
      </main>
    </div>
  );
}
