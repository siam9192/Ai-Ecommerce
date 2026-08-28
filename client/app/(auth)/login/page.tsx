"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiStar,
} from "react-icons/fi";

const perks = [
  "AI personalized product recommendations",
  "Fast checkout and saved carts",
  "Exclusive member-only deals",
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_50%,#f8fafc_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/60 bg-white/70 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="grid overflow-hidden rounded-[26px] bg-white lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.42),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.35),_transparent_35%)]" />
            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-white/10"
              >
                <FiArrowLeft size={16} />
                Back to home
              </Link>

              <div className="mt-12 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/90">
                  <FiStar size={12} />
                  Smart shopping
                </div>

                <h1 className="max-w-md text-4xl font-black leading-tight tracking-tight">
                  Discover the AI-powered way to shop.
                </h1>

                <p className="max-w-md text-base text-slate-300">
                  Sign in to unlock personalized product picks, lightning-fast
                  checkout, and exclusive offers curated for you.
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              {perks.map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                    <FiCheckCircle size={16} />
                  </div>
                  <span className="text-sm text-slate-100">{perk}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex items-center justify-center bg-white p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
                    Welcome back
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Login
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
                  <FiStar size={22} />
                </div>
              </div>

              <div className="space-y-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 text-[10px] font-black text-white">
                    G
                  </span>
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span className="bg-white px-2">or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <FiMail size={18} className="text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <FiLock size={18} className="text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full border-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-slate-400 transition hover:text-slate-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/"
                    className="font-medium text-primary transition hover:text-primary-hover"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="button"
                  className="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover hover:shadow-xl"
                >
                  Login to account
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:text-primary-hover"
                >
                  Create one
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
