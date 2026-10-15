"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Activity,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      // Login successful
      router.push("/dashboard/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-200 font-sans text-slate-800">

      {/* LEFT PANEL */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">

        <Image
          src="/hero-background.png"
          alt="Clinical Monitoring Background"
          fill
          priority
          className="object-cover object-center brightness-90"
        />

        <div className="absolute inset-0 mix-blend-multiply" />

        <div className="relative z-10 flex h-full flex-col justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/40 bg-blue-600/60 backdrop-blur-md">
              <Activity className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-bold tracking-wide text-white">
              PulseLink
            </span>
          </div>

          {/* Hero */}
          <div className="my-auto max-w-xl pr-6">

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
              Intelligence in <br />
              Clinical Precision.
            </h1>

            <p className="mb-8 text-sm leading-relaxed text-blue-100/80 lg:text-base">
              Access the next generation of clinical monitoring.
              Real-time patient data, predictive analytics, and
              secure device management in one unified interface.
            </p>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <Shield className="mb-2 h-5 w-5 text-blue-300" />

                <h3 className="text-sm font-semibold text-white">
                  Secure Sync
                </h3>

                <p className="mt-1 text-xs text-blue-100/70">
                  HIPAA-compliant data encryption for every device.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <Activity className="mb-2 h-5 w-5 text-blue-300" />

                <h3 className="text-sm font-semibold text-white">
                  Live Vitals
                </h3>

                <p className="mt-1 text-xs text-blue-100/70">
                  Millisecond latency in biometric transmission.
                </p>
              </div>

            </div>
          </div>

          <div />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">

        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Sign in to Clinical Portal
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your medical credentials to continue.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form
            className="mt-8 space-y-5"
            onSubmit={handleSignIn}
          >

            {/* EMAIL */}
            <div className="relative">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>

              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              />

            </div>

            {/* PASSWORD */}
            <div className="relative">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between text-xs">

              <label className="flex cursor-pointer items-center gap-2 text-slate-600">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                Remember Me

              </label>

              <Link
                href="#"
                className="font-medium text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}

              {!isLoading && (
                <span className="text-lg">→</span>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">

            <div className="w-full border-t border-slate-200" />

            <span className="absolute bg-slate-50 px-3 text-xs text-slate-400">
              Or sign in with
            </span>

          </div>

          {/* Alternative Auth */}
          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Health Vault
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span className="text-sm">👆</span>
              Biometrics
            </button>

          </div>

          {/* Request Access */}
          <p className="text-center text-xs text-slate-500">
            New clinician on board?{" "}

            <Link
              href="#"
              className="font-semibold text-blue-600 hover:underline"
            >
              Request Access
            </Link>
          </p>

          <p className="text-center text-xs text-slate-500">
            Need to register a patient?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register patient
            </Link>
          </p>

          {/* Footer */}
          <div className="flex justify-center gap-4 pt-6 text-[10px] font-medium uppercase tracking-wider text-slate-400">

            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>

            <span>•</span>

            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>

            <span>•</span>

            <Link href="#" className="hover:underline">
              System Status
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}