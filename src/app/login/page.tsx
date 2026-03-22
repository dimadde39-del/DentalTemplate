"use client";

import { useState, useMemo } from "react";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { createBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const INPUT_CLASSNAME =
  "min-h-12 w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-[var(--color-primary)] focus:bg-foreground/[0.03]";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = useMemo(() => createBrowserClient(), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Welcome Back
            </h1>
            <p className="mt-2 text-zinc-500">Sign in to manage your clinic.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error ? (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={INPUT_CLASSNAME}
                placeholder="doctor@clinic.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={INPUT_CLASSNAME}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex min-h-[48px] w-full items-center justify-center space-x-2 rounded-xl bg-[var(--color-primary)] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
            >
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              {!isLoading ? <MoveRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
