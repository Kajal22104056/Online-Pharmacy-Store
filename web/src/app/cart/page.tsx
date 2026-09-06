"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, PageShell } from "@/components/ui";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.tprice, 0);

  return (
    <PageShell title="Cart" subtitle="Items reserved from inventory until you checkout or remove them.">
      {cart.length === 0 ? (
        <Card>Cart is empty. <Link className="text-teal-700 underline" href="/medicines">Browse medicines</Link></Card>
      ) : (
        <Card>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.medID}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.tprice}</td>
                  <td>
                    <button className="text-red-600" onClick={() => removeFromCart(item.medID)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Total ₹{total}</div>
            <div className="flex gap-2">
              <button className="rounded-full border px-4 py-2" onClick={clearCart}>Clear</button>
              <Link href="/checkout" className="rounded-full bg-teal-600 px-4 py-2 text-white">
                Checkout
              </Link>
            </div>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
