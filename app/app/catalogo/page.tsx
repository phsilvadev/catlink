import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole, Check, ArrowLeft } from "lucide-react";
import { getAuth } from "@/lib/server/auth";
import { listCatalog } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";
export default async function CatalogPage() {
  const session = await getAuth()
    .api.getSession({ headers: await headers() })
    .catch(() => null);
  if (!session) redirect("/login");
  const catalog = await listCatalog(session.user.id).catch(() => null);
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <Link
        href="/app"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
      >
        <ArrowLeft size={16} />
        Voltar ao editor
      </Link>
      <h1 className="text-3xl font-bold">Modelos e blocos</h1>
      <p className="mt-3 text-gray-500">
        Veja os recursos disponíveis para a sua conta.
      </p>
      {!catalog ? (
        <p role="alert" className="mt-8 rounded-xl bg-white p-6">
          Não foi possível carregar o catálogo. Tente novamente em instantes.
        </p>
      ) : (
        <>
          <div className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="font-semibold">Plano {catalog.plan.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              Até {catalog.plan.pageLimit}{" "}
              {catalog.plan.pageLimit === 1 ? "página" : "páginas"}. Itens não
              incluídos não podem ser aplicados.
            </p>
          </div>
          {[
            { title: "Modelos", items: catalog.templates },
            { title: "Blocos", items: catalog.blocks },
          ].map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="mb-4 text-xl font-bold">{section.title}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.length === 0 ? (
                  <p className="text-gray-500">
                    Nenhum item disponível no momento.
                  </p>
                ) : (
                  section.items.map((item) => (
                    <article
                      key={item.key}
                      className="rounded-2xl border border-gray-200 bg-white p-6"
                    >
                      <span
                        className={`mb-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${item.allowed ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {item.allowed ? (
                          <Check size={13} />
                        ) : (
                          <LockKeyhole size={13} />
                        )}
                        {item.allowed ? "Incluído no plano" : "Não incluído"}
                      </span>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
