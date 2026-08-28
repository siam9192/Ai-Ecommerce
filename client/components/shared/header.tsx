import Link from "next/link";
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
import { RiGeminiLine } from "react-icons/ri";

const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Shop",
    path: "/shop",
  },
  {
    label: "About Us",
    path: "/about",
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-tight text-primary"
          >
            AI<span className="text-foreground">Shop</span>
          </Link>

          {/* Search */}
          <div className="hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center  gap-1 md:gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="rounded-xl p-2.5 text-foreground transition hover:bg-muted hover:text-primary"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-xl p-2.5 text-foreground transition hover:bg-muted hover:text-primary"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={20} />

              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                2
              </span>
            </Link>

            {/* Ai button */}

            <button className="rounded-xl p-2.5 text-foreground transition hover:bg-muted hover:text-primary">
              <RiGeminiLine size={26} />
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="ml-1 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover hover:shadow-md"
            >
              <FiUser size={17} />
              <span>Login</span>
            </Link>

            <Link
              href="/my-orders"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
