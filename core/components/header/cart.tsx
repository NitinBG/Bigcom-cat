import { cookies } from 'next/headers';
import { getCart } from '~/client/queries/get-cart';
import { MiniCart } from './mini-cart';

export const Cart = async () => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return (
      <div className="p-3">
        <MiniCart cart={null} />
      </div>
    );
  }

  const cart = await getCart(cartId);

  return (
    <div className="p-3">
      <MiniCart cart={cart} />
    </div>
  );
};
