import { CartItem } from "@/types/cart.type";
import Image from "next/image";
import React, { useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
interface Props {
  item: CartItem;
}
function CartItemCard({ item }: Props) {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <div
      key={item.id}
      className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
    >
      <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-28">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
          <p className="text-sm text-slate-500">In stock · Free returns</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
                onClick={() => {
                  const newQty = quantity - 1;
                  if (newQty <= 0) return;
                  setQuantity(newQty);
                }}
              >
                <FiMinus size={14} />
              </button>
              <span className="min-w-6 text-center text-sm font-medium text-slate-700">
                {quantity}
              </span>
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              >
                <FiPlus size={14} />
              </button>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <FiTrash2 size={14} />
              Remove
            </button>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Price
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;
