import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/server/auth";
import { readOnboarding } from "@/lib/server/onboarding";
import { listCatalog } from "@/lib/server/catalog";
import { onboardingStateSchema } from "@/lib/schemas/onboarding";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
export const dynamic = "force-dynamic";
export default async function FirstAccess() {
  const session = await getAuth()
    .api.getSession({ headers: await headers() })
    .catch(() => null);
  if (!session) redirect("/login");
  const result = await Promise.all([
    readOnboarding(session.user.id),
    listCatalog(session.user.id),
  ]).catch(() => null);
  if (!result)
    return (
      <main className="mx-auto max-w-xl p-10">
        <h1 className="text-2xl font-bold">
          Não foi possível carregar seu progresso
        </h1>
        <p className="my-5">
          Tente novamente em instantes. Os dados já salvos serão mantidos.
        </p>
        <Link href="/app/primeiro-acesso" className="text-primary">
          Tentar novamente
        </Link>
      </main>
    );
  const [saved, catalog] = result;
  return (
    <OnboardingWizard
      initial={{
        state: onboardingStateSchema.parse(saved.state),
        revision: saved.revision,
        completedPageId: saved.completedPageId,
      }}
      templates={[...catalog.templates].sort((a, b) => {
        const order = ["basic", "sunset", "mint", "pixel"];
        const rank = (key: string) =>
          order.includes(key) ? order.indexOf(key) : order.length;
        return rank(a.key) - rank(b.key) || a.name.localeCompare(b.name);
      })}
    />
  );
}
