import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiGlobe, FiShield, FiStar } from "react-icons/fi";

const values = [
  {
    icon: FiShield,
    title: "Trust-first buying",
    description:
      "Every product is selected to deliver value, quality, and a dependable shopping experience.",
  },
  {
    icon: FiGlobe,
    title: "Curated globally",
    description:
      "We blend practical essentials with premium finds from the tech, lifestyle, and home categories.",
  },
  {
    icon: FiStar,
    title: "Customer-loved",
    description:
      "Our catalog is shaped by real feedback, ratings, and convenience-driven design choices.",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[30px] border border-border bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 shadow-sm sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              About AIShop
            </p>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Built for easier, smarter shopping.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              AIShop helps people discover modern essentials faster with a clean,
              curated experience designed around convenience, trust, and better
              product discovery.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Shop now
                <FiArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Browse catalog
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              <div>
                <p className="text-3xl font-black">10k+</p>
                <p className="mt-2 text-sm text-slate-300">happy shoppers</p>
              </div>
              <div>
                <p className="text-3xl font-black">4.9/5</p>
                <p className="mt-2 text-sm text-slate-300">average customer rating</p>
              </div>
              <div>
                <p className="text-3xl font-black">48h</p>
                <p className="mt-2 text-sm text-slate-300">average delivery window</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our values
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            The experience behind every purchase
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[28px] border border-border bg-slate-950 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Why shoppers choose us
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">
              Quality picks, clear value, and a frictionless checkout.
            </h3>
          </div>

          <div className="space-y-3 text-sm text-slate-200">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-emerald-400" size={18} />
              Flexible, secure checkout
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-emerald-400" size={18} />
              Thoughtful product recommendations
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-emerald-400" size={18} />
              Helpful support before and after purchase
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
