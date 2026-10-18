import Link from "next/link";
import {
  FiArrowRight,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiZap,
} from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(99,102,241,0.38),transparent_38%),radial-gradient(ellipse_at_10%_100%,rgba(14,165,233,0.2),transparent_36%)]" />
      <div className="container mx-auto grid min-h-[540px] items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-4 py-2 text-sm font-medium text-indigo-200">
            <FiZap />
            Meet your smarter way to shop
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find the things
            <span className="block text-indigo-300">you’ll love living with.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Explore products, get help narrowing down your choices, and save
            your favorites for later—all in one thoughtful shopping experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <FiShoppingBag />
              Explore the shop
              <FiArrowRight />
            </Link>
            <Link
              href="/ai-search"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <FiSearch />
              Try AI search
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <FiSearch className="text-indigo-300" />
              Find what fits you
            </span>
            <span className="inline-flex items-center gap-2">
              <FiHeart className="text-indigo-300" />
              Save it for later
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[40px] bg-indigo-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Your next great find
                </p>
                <p className="mt-1 text-xl font-bold">Starts with a question.</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-200">
                <FiZap size={22} />
              </span>
            </div>
            <div className="mt-7 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  You could ask
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  “Help me find something that fits my needs”
                </p>
              </div>
              <div className="ml-8 rounded-2xl border border-indigo-300/20 bg-indigo-400/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
                  <FiZap />
                  AI shopping assistant
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Get a hand exploring products and finding a good match.
                </p>
              </div>
            </div>
            <Link
              href="/ai-search"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 transition hover:text-white"
            >
              Start exploring <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
