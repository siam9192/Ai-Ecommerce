"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clear,
  getCart,
  removeItem,
  updateItem,
} from "@/api-services/cart.api.services";
import ProtectedRoute from "@/components/auth/protected-route";
import CartItemCard from "@/components/ui/cartItem-card";
import AppStatePageTracker from "@/components/shared/app-state-page-tracker";
import {
  createOrderFromCart,
  type DeliveryAddress,
} from "@/api-services/order.api.services";
import Link from "next/link";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    Awaited<ReturnType<typeof getCart>>["data"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    state: "",
  });

  const loadCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.data);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress((current) => ({ ...current, [field]: value }));
  };

  const getErrorMessage = (requestError: unknown) => {
    const detail = (
      requestError as {
        response?: { data?: { detail?: string | { msg?: string }[] } };
      }
    ).response?.data?.detail;

    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).filter(Boolean).join(", ");
    }
    return "Unable to complete checkout. Please try again.";
  };

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartItems.length || isCheckingOut) return;

    setIsCheckingOut(true);
    setCheckoutError("");
    try {
      const response = await createOrderFromCart(deliveryAddress);
      setCartItems([]);
      setCheckoutOpen(false);
      router.push(`/my-orders?order=${response.data.id}`);
    } catch (requestError) {
      setCheckoutError(getErrorMessage(requestError));
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.productId ?? 0) * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 18;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  
  return (
    <ProtectedRoute customerOnly>
      <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <AppStatePageTracker
          page="cart-items"
          ids={cartItems.map((item) => item.id)}
        />
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Your cart
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Shopping bag
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <FiShoppingBag size={16} />
            {cartItems.length} items
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="space-y-4">
            {loading ? (
              <p className="text-slate-500">Loading cart...</p>
            ) : (
              cartItems.map(
                (item) =>
                   (
                    <CartItemCard
                      item={item}
                      key={item.id}
                      onQuantityChange={async (productId, quantity) => {
                        await updateItem(productId, { quantity });
                        await loadCart();
                      }}
                      onRemove={async (productId) => {
                        await removeItem(productId);
                        await loadCart();
                      }}
                    />
                  ),
              )
            )}
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Order summary
            </h3>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="my-5 h-px bg-slate-200" />

            <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                className="mt-4 text-sm font-medium text-red-500 hover:text-red-600"
                onClick={async () => {
                  await clear();
                  setCartItems([]);
                }}
              >
                Clear cart
              </button>
            )}

            {checkoutOpen ? (
              <form
                onSubmit={handleCheckout}
                className="mt-6 space-y-4 border-t border-slate-200 pt-5"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Delivery address
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter where you want this order delivered.
                  </p>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Street address
                  <input
                    required
                    value={deliveryAddress.street}
                    onChange={(event) =>
                      updateAddress("street", event.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    City
                    <input
                      required
                      value={deliveryAddress.city}
                      onChange={(event) =>
                        updateAddress("city", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    State
                    <input
                      required
                      value={deliveryAddress.state}
                      onChange={(event) =>
                        updateAddress("state", event.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                </div>

                {checkoutError && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                    {checkoutError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    disabled={isCheckingOut}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                  >
                    {isCheckingOut ? "Placing order..." : "Place order"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                disabled={!cartItems.length}
                onClick={() => setCheckoutOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to checkout
                <FiArrowRight size={16} />
              </button>
            )}

            <Link
              href="/"
              className="mt-4 block text-center text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </main>
    </ProtectedRoute>
  );
}
