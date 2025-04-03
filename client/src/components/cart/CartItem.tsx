import { useCart, CartItemWithProduct } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemWithProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart, updateCartItem, isLoading } = useCart();
  const { id, quantity, product } = item;

  const handleRemoveItem = () => {
    removeFromCart(id);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateCartItem(id, quantity - 1);
    } else {
      removeFromCart(id);
    }
  };

  const increaseQuantity = () => {
    updateCartItem(id, quantity + 1);
  };

  return (
    <li className="py-6 flex">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover object-center" 
        />
      </div>
      
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-dark">
            <h3>{product.name}</h3>
            <p className="ml-4">${product.price.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-secondary">{product.tagline}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button 
              className="p-1 hover:bg-light rounded-full"
              onClick={decreaseQuantity}
              aria-label="Decrease quantity"
              disabled={isLoading}
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            <span className="mx-2 font-medium">{quantity}</span>
            <button 
              className="p-1 hover:bg-light rounded-full"
              onClick={increaseQuantity}
              aria-label="Increase quantity"
              disabled={isLoading}
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>
          
          <div className="flex">
            <button 
              type="button" 
              className="font-medium text-primary hover:text-primary/80"
              onClick={handleRemoveItem}
              disabled={isLoading}
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
