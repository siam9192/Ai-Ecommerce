import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";

const wishlistItems = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "Best seller",
  },
  {
    id: 2,
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    badge: "New arrival",
  },
  {
    id: 3,
    name: "Minimalist Leather Backpack",
    price: 129.5,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
  },
  {
    id: 4,
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    price: 129.95,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    badge: "Top rated",
  },
];

export default function WishlistPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Saved items
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My wishlist
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <FiHeart size={16} />
          {wishlistItems.length} saved
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                {item.badge}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
                  {item.name}
                </h2>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <FiShoppingCart size={16} />
                  Add to cart
                </button>

                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
