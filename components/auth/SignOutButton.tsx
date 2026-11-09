"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  async function signOut() {
    setPending(true);
    setError(false);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(true);
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={signOut}
        disabled={pending}
        aria-label="Sair da conta"
        title="Sair da conta"
        className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50"
      >
        <LogOut size={20} />
      </button>
      {error && (
        <span role="alert" className="text-[9px] text-red-300">
          Tente sair novamente
        </span>
      )}
    </div>
  );
}
