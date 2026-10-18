import Link from "next/link";
import {
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiShoppingBag,
  FiTarget,
} from "react-icons/fi";

const discoveryOptions = [
  {
    icon: FiShoppingBag,
    eyebrow: "Browse",
    title: "Explore the collection",
    description:
      "Take a look through available products and open the details that catch your eye.",
    href: "/shop",
    action: "Browse products",
    style: "bg-indigo-50 text-indigo-700",
  },
  {
    icon: FiMessageCircle,
    eyebrow: "Get ideas",
    title: "Ask the AI assistant",
    description:
      "Describe what you are looking for and let AI help you discover relevant products.",
    href: "/ai-search",
    action: "Try AI search",
    style: "bg-sky-50 text-sky-700",
  },
  {
    icon: FiHeart,
    eyebrow: "Save for later",
    title: "Build your wishlist",
    description:
      "Keep interesting finds together and come back to them when you are ready.",
    href: "/wishlist",
    action: "View wishlist",
    style: "bg-rose-50 text-rose-700",
  },
];

export default function HomeShoppingGuide() {
  return (
    <>
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            A shop that works your way
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Start wherever inspiration strikes.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Browse on your own, get a little help from AI, or save your
            discoveries and decide later.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {discoveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <article
                key={option.eyebrow}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${option.style}`}
                >
                  <Icon size={21} />
                </span>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {option.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {option.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {option.description}
                </p>
                <Link
                  href={option.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
                >
                  {option.action} <FiArrowRight />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              A simple way to find your fit
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              From first thought to favorite find.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              No need to have every detail figured out. Explore, compare, and
              keep the products you like close at hand.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              See all products <FiArrowRight />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                number: "01",
                icon: FiSearch,
                title: "Discover",
                detail: "Browse the collection or search with a little help.",
              },
              {
                number: "02",
                icon: FiTarget,
                title: "Compare",
                detail: "Check product details, prices, and availability.",
              },
              {
                number: "03",
                icon: FiHeart,
                title: "Save",
                detail: "Add promising picks to your wishlist for later.",
              },
              {
                number: "04",
                icon: FiShoppingBag,
                title: "Choose",
                detail: "Add the items you want to your cart when you’re ready.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-indigo-600">
                      {step.number}
                    </span>
                    <Icon className="text-slate-500" size={18} />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-indigo-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-200">
                Your next discovery is waiting
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Tell us what you’re looking for.
              </h2>
              <p className="mt-3 text-sm leading-6 text-indigo-100 sm:text-base">
                Start a conversation with the AI shopping assistant and explore
                products that match your request.
              </p>
            </div>
            <Link
              href="/ai-search"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-50"
            >
              <FiMessageCircle />
              Explore with AI
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
