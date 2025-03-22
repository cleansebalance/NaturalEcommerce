import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { fetchProductById, fetchProductsByCategory } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Star,
  Truck,
  Leaf,
  Recycle,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const { addToCart, isLoading: cartLoading } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { 
    data: product, 
    isLoading: productLoading, 
    error: productError 
  } = useQuery({
    queryKey: [`/api/products/${productId}`],
    queryFn: () => fetchProductById(productId)
  });

  // Fetch related products
  const { 
    data: relatedProducts, 
    isLoading: relatedLoading 
  } = useQuery({
    queryKey: ['/api/products', product?.category],
    queryFn: () => product ? fetchProductsByCategory(product.category) : Promise.resolve([]),
    enabled: !!product
  });

  const handleAddToCart = () => {
    if (product && !cartLoading) {
      addToCart(product.id, quantity);
    }
  };

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2">
              <Skeleton className="w-full h-[500px] rounded-lg" />
            </div>
            
            <div className="w-full md:w-1/2">
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              
              <div className="flex items-center space-x-4 mb-8">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
              </div>
              
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products">
          <a className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
            Back to Products
          </a>
        </Link>
      </div>
    );
  }

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-8">
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/products?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{product.name}</BreadcrumbItem>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Product Image */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-serif font-semibold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={i < product.rating ? "text-accent fill-current" : "text-gray-300"} 
                      size={16} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
              
              <p className="text-2xl font-semibold mb-6">{formatPrice(Number(product.price))}</p>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-3 py-2 text-gray-500 hover:text-primary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 min-w-[40px] text-center">{quantity}</span>
                  <button 
                    className="px-3 py-2 text-gray-500 hover:text-primary"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all flex-grow"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <Truck className="mr-2 text-primary" size={18} />
                  <span className="text-sm">Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="mr-2 text-primary" size={18} />
                  <span className="text-sm">Natural ingredients, ethically sourced</span>
                </div>
                <div className="flex items-center">
                  <Recycle className="mr-2 text-primary" size={18} />
                  <span className="text-sm">Sustainable packaging, better for the planet</span>
                </div>
                <div className="flex items-center">
                  <Heart className="mr-2 text-primary" size={18} />
                  <span className="text-sm">Cruelty-free, never tested on animals</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-6">
                <h3 className="text-xl font-medium mb-4">Product Description</h3>
                <p className="text-gray-600 mb-4">
                  {product.description} Our {product.name} is designed to provide the best results for your wellness routine.
                  Made with carefully selected ingredients that work in harmony with your body.
                </p>
                <p className="text-gray-600">
                  Each {product.name} is handcrafted in small batches to ensure the highest quality and potency.
                  We've spent years perfecting this formula to create a product that truly delivers on its promises.
                </p>
              </TabsContent>
              
              <TabsContent value="ingredients" className="pt-6">
                <h3 className="text-xl font-medium mb-4">Ingredients</h3>
                <p className="text-gray-600 mb-4">
                  All ingredients are 100% natural, vegan, and ethically sourced:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Organic Aloe Vera Juice</li>
                  <li>Jojoba Oil</li>
                  <li>Shea Butter</li>
                  <li>Vitamin E</li>
                  <li>Essential Oil Blend (Lavender, Chamomile, Ylang Ylang)</li>
                  <li>Vegetable Glycerin</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="how-to-use" className="pt-6">
                <h3 className="text-xl font-medium mb-4">How to Use</h3>
                <ol className="list-decimal pl-5 text-gray-600 space-y-3">
                  <li>Start with clean, dry skin.</li>
                  <li>Apply a small amount to your fingertips.</li>
                  <li>Gently massage into the skin using circular motions.</li>
                  <li>Allow to absorb completely before applying other products.</li>
                  <li>For best results, use morning and evening as part of your daily routine.</li>
                </ol>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className="text-accent fill-current" size={16} />
                        ))}
                      </div>
                      <span className="font-medium">Sarah J.</span>
                      <span className="text-gray-500 text-sm ml-2">1 month ago</span>
                    </div>
                    <p className="text-gray-600">
                      This product has completely transformed my routine. I've been using it for a month and already see amazing results. Will definitely repurchase!
                    </p>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {Array(4).fill(0).map((_, i) => (
                          <Star key={i} className="text-accent fill-current" size={16} />
                        ))}
                      </div>
                      <span className="font-medium">Mark T.</span>
                      <span className="text-gray-500 text-sm ml-2">2 months ago</span>
                    </div>
                    <p className="text-gray-600">
                      Good product overall. I love the scent and how it feels, but I wish the packaging was a bit more sturdy. Still, I'm happy with my purchase.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className="text-accent fill-current" size={16} />
                        ))}
                      </div>
                      <span className="font-medium">Emma R.</span>
                      <span className="text-gray-500 text-sm ml-2">3 weeks ago</span>
                    </div>
                    <p className="text-gray-600">
                      I love that all the ingredients are natural and sustainably sourced. The product works incredibly well and lasts a long time. Highly recommend!
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-semibold mb-8">You Might Also Like</h2>
            
            {relatedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredRelatedProducts.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {filteredRelatedProducts.map((product) => (
                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            ) : (
              <p className="text-gray-500 text-center py-8">No related products found</p>
            )}
          </div>
        </div>
      </div>
      
      <Newsletter />
    </>
  );
}
