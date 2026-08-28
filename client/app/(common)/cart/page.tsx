"use client"
import CartItemCard from "@/components/ui/cartItem-card";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

const cartItems = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Apple Watch Series 9",
    price: 399,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Keychron K2 Wireless Mechanical Keyboard",
    price: 84.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
];

const subtotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);
const shipping = subtotal > 500 ? 0 : 18;
const tax = subtotal * 0.08;
const total = subtotal + shipping + tax;

export default function CartPage() {

  return (
    <main className="container mx-auto min-h-screen px-4 py-10 sm:px-6 lg:px-8">
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
          {cartItems.map((item,index) => (
        <CartItemCard item={item} key={index}/>
          ))}
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
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
          >
            Proceed to checkout
            <FiArrowRight size={16} />
          </button>

          <Link
            href="/"
            className="mt-4 block text-center text-sm font-medium text-slate-600 transition hover:text-primary"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
