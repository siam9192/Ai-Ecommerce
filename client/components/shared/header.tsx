"use client";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
import { RiGeminiLine } from "react-icons/ri";
import { getCartCount } from "@/api-services/cart.api.services";
import { setCartItemCount } from "@/redux/features/appState-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

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

const adminNavItems = [
  { label: "Overview", path: "/admin" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Products", path: "/admin/products" },
  { label: "Customers", path: "/admin/customers" },
];

function Header() {
  const { user, isLoading } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(
    (state) => state.appState.cart_item_count,
  );
  const refreshToggle = useAppSelector(
    (state) => state.appState.state_update_toggle,
  );

  useEffect(() => {
    let isCurrent = true;

    if (!user || user.role !== "customer") {
      dispatch(setCartItemCount(0));
      return () => {
        isCurrent = false;
      };
    }

    getCartCount()
      .then((response) => {
        if (!response.success) {
          console.error("Cart item count could not be loaded.");
          return;
        }
        if (isCurrent) {
          dispatch(setCartItemCount(response.data));
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load cart item count:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [dispatch, refreshToggle, user?.id, user?.role]);

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
          {!isAdmin && (
            <form
              action="/shop"
              method="get"
              className="hidden max-w-xl flex-1 md:block"
            >
              <div className="relative">
                <FiSearch
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </form>
          )}

          {/* Navigation */}
          <nav
            aria-label={isAdmin ? "Admin navigation" : "Main navigation"}
            className={`hidden items-center lg:flex ${
              isAdmin ? "gap-4" : "gap-7"
            }`}
          >
            {(isAdmin ? adminNavItems : navItems).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${
                  isAdmin ? "text-slate-700" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center  gap-1 md:gap-3">
            {!isAdmin && (
              <>
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

                  {cartItemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLoading ? null : !user ? (
              <Link
                href="/login"
                className="ml-1 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover hover:shadow-md"
              >
                <FiUser size={17} />
                <span>Login</span>
              </Link>
            ) : isAdmin ? (
              <Link
                href="/admin"
                className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100"
              >
                Admin dashboard
              </Link>
            ) : (
              <Link
                href="/my-orders"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
