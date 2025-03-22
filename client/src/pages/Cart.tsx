import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { Newsletter } from "@/components/Newsletter";
import { Trash } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  const { 
    cartItems, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    isLoading 
  } = useCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-semibold mb-8 text-center">Your Cart</h1>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex justify-between mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-serif font-semibold mb-8">Your Cart is Empty</h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Looks like you haven't added any products to your cart yet.
          Browse our collection to find something you'll love.
        </p>
        <Link href="/products">
          <a className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium inline-block">
            Continue Shopping
          </a>
        </Link>
        
        <Newsletter />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-semibold mb-8 text-center">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const itemTotal = Number(item.product.price) * item.quantity;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-20 h-20 rounded overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/products/${item.product.id}`}>
                          <a className="font-medium hover:text-primary transition-colors">
                            {item.product.name}
                          </a>
                        </Link>
                        <p className="text-sm text-gray-500">{item.product.description}</p>
                      </TableCell>
                      <TableCell>{formatPrice(Number(item.product.price))}</TableCell>
                      <TableCell>
                        <div className="flex items-center border rounded-md w-[100px]">
                          <button 
                            className="px-2 py-1 text-gray-500 hover:text-primary"
                            onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                            disabled={isLoading}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 min-w-[30px] text-center">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-gray-500 hover:text-primary"
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(itemTotal)}</TableCell>
                      <TableCell>
                        <button 
                          className="text-gray-400 hover:text-error transition-all"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          aria-label="Remove item"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="flex justify-between mt-6">
              <Link href="/products">
                <Button variant="outline" className="text-primary">
                  Continue Shopping
                </Button>
              </Link>
              
              <Button variant="outline" onClick={() => clearCart()} disabled={isLoading}>
                Clear Cart
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before checkout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="text-sm font-medium mb-2 block">Have a promo code?</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      className="flex-grow px-3 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-primary text-white">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="text-xs text-gray-500 text-center">
                  <p>We accept:</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Newsletter />
    </>
  );
}
