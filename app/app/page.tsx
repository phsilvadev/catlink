import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/server/auth";
import { listPages } from "@/lib/server/pages";
import { listCatalog } from "@/lib/server/catalog";
import AuthBrand from "@/components/auth/AuthBrand";
import SignOutButton from "@/components/auth/SignOutButton";
export const dynamic = "force-dynamic";
export default async function PagesDashboard() {
  const session = await getAuth()
    .api.getSession({ headers: await headers() })
    .catch(() => null);
  if (!session) redirect("/login");
  const result = await Promise.all([
    listPages(session.user.id),
    listCatalog(session.user.id),
  ]).catch(() => null);
  if (!result)
    return (
      <main className="mx-auto max-w-xl p-10">
        <h1 className="text-2xl font-bold">
          Não foi possível carregar suas páginas
        </h1>
        <p className="my-5">Tente novamente em instantes.</p>
        <Link href="/app" className="text-primary">
          Tentar novamente
        </Link>
      </main>
    );
  const [pages, catalog] = result;
  if (!pages.length) redirect("/app/primeiro-acesso");
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-12 flex items-center justify-between rounded-2xl bg-white p-5">
        <AuthBrand />
        <div className="flex items-center gap-4">
          <Link
            href="/app/catalogo"
            className="text-sm font-semibold text-primary"
          >
            Modelos e blocos
          </Link>
          <SignOutButton />
        </div>
      </header>
      <h1 className="text-3xl font-bold">Minhas páginas</h1>
      <p className="mb-8 mt-3 text-gray-500">
        {pages.length} de {catalog.plan.pageLimit}{" "}
        {catalog.plan.pageLimit === 1 ? "página" : "páginas"} no plano{" "}
        {catalog.plan.name}.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <article
            key={page.id}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${page.publishedVersionId ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {page.publishedVersionId ? "Publicada" : "Rascunho"}
            </span>
            <h2 className="my-5 break-all text-xl font-bold">/{page.slug}</h2>
            <p className="mb-6 text-sm text-gray-500">
              Modelo:{" "}
              {catalog.templates.find((item) => item.key === page.templateKey)
                ?.name ?? page.templateKey}
            </p>
            <Link
              href={`/app/editor/${page.id}`}
              className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Abrir editor
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-gray-500">
        {pages.length >= catalog.plan.pageLimit
          ? "Você atingiu o limite do plano. Páginas adicionais exigem um plano que permita mais páginas."
          : "A criação de páginas adicionais será disponibilizada com os planos pagos."}
      </p>
    </main>
  );
}
