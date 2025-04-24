'use client';

import { useState, useEffect, useRef } from 'react';
import { CartIcon } from './cart-icon';
import { Link } from '~/components/link';
import { ItemQuantity } from '~/app/[locale]/(default)/cart/_components/item-quantity';
import { RemoveItem } from '~/app/[locale]/(default)/cart/_components/remove-item';

interface CartProps {
  cart: {
    lineItems: {
      totalQuantity: number;
      physicalItems: Array<{
        name: string;
        brand: string | null;
        imageUrl: string | null;
        entityId: string;
        quantity: number;
        extendedSalePrice: { currencyCode: string; value: number };
      }>;
    };
  } | null;
}

export const MiniCart = ({ cart }: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const toggleCart = () => setIsOpen((prev) => !prev);

  const totalQuantity = cart?.lineItems.totalQuantity ?? 0;
  const physicalItems = cart?.lineItems.physicalItems ?? [];
  const totalCost = physicalItems.reduce(
    (acc, item) => acc + item.extendedSalePrice.value,
    0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  console.log('totalQuantity', totalQuantity)
  console.log('physicalItems', physicalItems)

  return (
    <div className="relative">
      <button
        onClick={toggleCart}
        className="relative flex items-center justify-center font-semibold"
      >
        <CartIcon count={totalQuantity} />
      </button>

      {/* Mini Cart */}
      {isOpen && (
        <div
          ref={cartRef}
          className="fixed right-0 top-0 h-full w-[28rem] bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col"
        >
          {/* Close Button */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-lg font-semibold">Your Cart</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="p-4 flex-1 overflow-y-auto">
            {physicalItems.length > 0 ? (
              <ul className="space-y-4">
                {physicalItems.map((item) => (
                  <li
                    key={item.entityId}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.brand && (
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        €{item.extendedSalePrice.value.toFixed(2)}
                      </span>
                      <ItemQuantity product={item} />
                      <div className="mt-2">
                        <RemoveItem
                          currency={cart?.currencyCode}
                          product={item}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500">
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          {/* Cart Footer (Subtotal and Buttons) */}
          {physicalItems.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Subtotal:</span>
                <span className="text-lg font-semibold text-gray-800">
                  €{totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/cart"
                  className="flex-1 text-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  Edit Cart
                </Link>

                <Link
                  href="/checkout"
                  className="flex-1 text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
