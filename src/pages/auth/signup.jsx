import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";

const COLLEGES = [
  "MLR Institute of Technology",
  "IARE Dundigal",
  "BVRIT Narsapur",
  "Malla Reddy University",
];

export default function Signup() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState(COLLEGES[0]);
  const [studentId, setStudentId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);

    const normalizedName = fullName.trim();
    const normalizedStudentId = studentId.trim();
    const normalizedMobileNumber = mobileNumber.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedName ||
      !normalizedStudentId ||
      !normalizedMobileNumber ||
      !normalizedEmail ||
      !password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(normalizedMobileNumber)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    const {
      data: signUpData,
      error: signUpError,
    } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: normalizedName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!signUpData.user) {
      setError(
        "Unable to create your account. Please try again."
      );
      setLoading(false);
      return;
    }

    const userId = signUpData.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: normalizedName,
        college,
        student_id: normalizedStudentId,
        mobile_number: normalizedMobileNumber,
      })
      .eq("id", userId);

    if (profileError) {
      setError(
        "Your account was created, but your student profile could not be saved. Please try signing in again."
      );
      setLoading(false);
      return;
    }

    if (signUpData.session) {
      await router.replace("/");
      return;
    }

    setSuccess(true);
    setLoading(false);
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

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-3xl font-black tracking-wider text-indigo-700"
            >
              ECHO
              <span className="text-amber-500">
                FACE
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
              ✓
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Check your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your EchoFace account has been created.
              We've sent a confirmation link to:
            </p>

            <p className="mt-2 break-all font-bold text-indigo-700">
              {email}
            </p>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Confirm your email address before signing in.
              Check your spam or promotions folder if you
              don't see the message.
            </p>

            <Link
              href="/auth/login"
              className="mt-6 block rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            >
              Go to Sign In
            </Link>
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-3xl font-black tracking-wider text-indigo-700"
          >
            ECHO
            <span className="text-amber-500">
              FACE
            </span>
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Join your campus ride network.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Set up your EchoFace student account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
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
                htmlFor="full-name"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="full-name"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="college"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                College
              </label>

              <select
                id="college"
                value={college}
                onChange={(event) =>
                  setCollege(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {COLLEGES.map((collegeName) => (
                  <option
                    key={collegeName}
                    value={collegeName}
                  >
                    {collegeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="student-id"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Student ID
              </label>

              <input
                id="student-id"
                type="text"
                autoComplete="off"
                required
                value={studentId}
                onChange={(event) =>
                  setStudentId(event.target.value)
                }
                placeholder="e.g. 22R21A0001"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="mobile-number"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Mobile Number
              </label>

              <input
                id="mobile-number"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                required
                maxLength={10}
                value={mobileNumber}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setMobileNumber(value);
                }}
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Email
              </label>

              <input
                id="signup-email"
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
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-xs leading-5 text-indigo-700">
                You'll need to confirm your email address
                before signing in to EchoFace.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          ← Back to EchoFace
        </Link>
      </div>
    </main>
  );
}