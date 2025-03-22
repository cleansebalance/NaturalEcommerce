import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { Link, useLocation } from "wouter";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, CheckCircle } from "lucide-react";

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  paymentMethod: z.enum(["credit-card", "paypal"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  saveInfo: z.boolean().optional(),
  sameAsShipping: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      paymentMethod: "credit-card",
      saveInfo: false,
      sameAsShipping: true,
    },
  });

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0 && !checkoutComplete) {
    toast({
      title: "Your cart is empty",
      description: "Please add items to your cart before checkout.",
      variant: "destructive",
    });
    setLocation("/cart");
    return null;
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate processing payment
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    try {
      // In a real app, this would be an API call to process the order
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the cart after successful checkout
      await clearCart();
      
      setCheckoutComplete(true);
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order has been confirmed.",
      });
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order success screen
  if (checkoutComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-success/10 rounded-full p-4 text-success">
              <CheckCircle className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-semibold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been successfully placed. We've sent a confirmation email to your inbox.
          </p>
          <p className="text-gray-600 mb-8">
            Order reference: <span className="font-semibold">PB-{Math.floor(100000 + Math.random() * 900000)}</span>
          </p>
          <div className="flex flex-col space-y-4">
            <Link href="/products">
              <a className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium inline-block w-full">
                Continue Shopping
              </a>
            </Link>
            <Link href="/">
              <a className="border-2 border-primary text-primary px-8 py-3 rounded-md hover:bg-primary hover:text-white transition-all font-medium inline-block w-full">
                Return Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-center">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Checkout Form */}
        <div className="w-full lg:w-2/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>We'll use this to send your order confirmation</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Where should we send your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Save this information for next time</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>All transactions are secure and encrypted</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="border rounded-md p-4 cursor-pointer transition-all hover:border-primary">
                              <RadioGroupItem
                                value="credit-card"
                                id="credit-card"
                                className="sr-only"
                              />
                              <label
                                htmlFor="credit-card"
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <CreditCard className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium">Credit Card</p>
                                  <p className="text-sm text-gray-500">Pay securely with your card</p>
                                </div>
                              </label>
                            </div>
                            
                            <div className="border rounded-md p-4 cursor-pointer transition-all hover:border-primary opacity-50">
                              <RadioGroupItem
                                value="paypal"
                                id="paypal"
                                className="sr-only"
                                disabled
                              />
                              <label
                                htmlFor="paypal"
                                className="flex items-center gap-3 cursor-not-allowed"
                              >
                                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.023-.019.1a.804.804 0 0 1-.794.679h-2.8a.483.483 0 0 1-.477-.558l.033-.158.789-4.997a.981.981 0 0 1 .97-.805h2.53c2.243 0 4.01-.921 4.53-3.637.279-1.43.14-2.62-.412-3.46-.118-.181-.269-.35-.437-.504 1.029-.511 1.878-1.39 2.258-2.03zm-2.21-1.862c-.89-.968-2.461-1.39-4.544-1.39h-4.54a.804.804 0 0 0-.794.68l-2.402 15.22-.02.1a.483.483 0 0 0 .477.558h2.74c.292 0 .54-.213.584-.503l.657-4.15a.805.805 0 0 1 .794-.679h.5c3.237 0 5.774-1.313 6.514-5.12.034-.173.064-.34.089-.501.195-1.412-.056-2.352-.055-2.352-.135-.362-.357-.659-.638-.93l.022-.013.116.08z" />
                                </svg>
                                <div>
                                  <p className="font-medium">PayPal</p>
                                  <p className="text-sm text-gray-500">Coming soon</p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("paymentMethod") === "credit-card" && (
                    <div className="mt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiration Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardCvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="sameAsShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same as shipping address</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {!form.watch("sameAsShipping") && (
                    <div className="mt-6 space-y-4 animate-in fade-in">
                      <p className="text-sm text-gray-500">Please enter your billing address</p>
                      {/* Additional billing address fields would go here */}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {isSubmitting && (
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <p className="mb-2 text-center">Processing your payment...</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Link href="/cart">
                  <Button variant="outline" type="button">
                    Back to Cart
                  </Button>
                </Link>
                
                <Button 
                  type="submit" 
                  className="bg-primary text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cartItems.length} items in your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="items">
                <AccordionItem value="items">
                  <AccordionTrigger>Order Items</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 max-h-60 overflow-auto pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium">
                            {formatPrice(Number(item.product.price) * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartTotal >= 75 ? "Free" : formatPrice(10)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cartTotal * 0.08)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      cartTotal + 
                      (cartTotal >= 75 ? 0 : 10) + 
                      (cartTotal * 0.08)
                    )}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">WELCOME15:</span> 15% off your first order
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
