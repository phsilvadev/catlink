import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BioLinkEditor from "@/components/BioLinkEditor";
import { getAuth } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  let session;
  try {
    session = await getAuth().api.getSession({ headers: await headers() });
  } catch {
    redirect("/login");
  }
  if (!session) redirect("/login");
  return <BioLinkEditor />;
}
