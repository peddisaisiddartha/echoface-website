import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (data.session) {
        router.replace("/");
        return;
      }

      setCheckingSession(false);
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (signInError) {
      setError(
        signInError.message ||
          "Unable to sign in. Please check your details."
      );
      setLoading(false);
      return;
    }

    await router.replace("/");
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-sm font-medium text-slate-500">
          Checking your session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-3xl font-black tracking-wider text-indigo-700"
          >
            ECHO
            <span className="text-amber-500">FACE</span>
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Campus rides made simpler.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to book and post campus rides.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-700"
                >
                  Password
                </label>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              New to EchoFace?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 text-center text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          ← Back to EchoFace
        </Link>
      </div>
    </main>
  );
}