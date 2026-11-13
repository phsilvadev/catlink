import AuthBrand from "@/components/auth/AuthBrand";
import EntryShowcase from "@/components/entry/EntryShowcase";
import "@/components/entry/entry.css";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="entry-flow auth-entry">
      <EntryShowcase />
      <main className="entry-auth-main">
        <div className="entry-auth-panel">
          <div className="entry-auth-brand">
            <AuthBrand />
          </div>
          {children}
          <p className="mt-12 text-center text-xs text-gray-400">
            Catlink · Seus links, sua identidade.
          </p>
        </div>
      </main>
    </div>
  );
}
