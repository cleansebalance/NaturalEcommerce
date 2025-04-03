import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { 
  Package,
  Truck, 
  CheckCircle2, 
  ClipboardList,
  BadgeCheck
} from "lucide-react";

// Form validation schema
const trackingFormSchema = z.object({
  orderNumber: z.string().min(6, "Order number must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

// Mock order status for demonstration
const mockOrderStatus = {
  orderNumber: "ORD123456",
  placedDate: "March 15, 2023",
  status: "Shipped",
  estimatedDelivery: "March 20, 2023",
  trackingNumber: "USPS123456789",
  items: [
    {
      name: "Hydrating Facial Serum",
      quantity: 1,
      price: 48.00,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "Gentle Cleansing Foam",
      quantity: 1,
      price: 28.00,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ],
  timeline: [
    {
      date: "March 15, 2023",
      time: "09:45 AM",
      status: "Order Placed",
      description: "Your order has been received and is being processed",
      completed: true
    },
    {
      date: "March 16, 2023",
      time: "11:20 AM",
      status: "Order Processed",
      description: "Your order has been prepared and is ready for shipping",
      completed: true
    },
    {
      date: "March 17, 2023",
      time: "02:30 PM",
      status: "Shipped",
      description: "Your order has been shipped via USPS Priority Mail",
      completed: true
    },
    {
      date: "March 20, 2023",
      time: "End of day",
      status: "Out for Delivery",
      description: "Your package is out for delivery",
      completed: false
    },
    {
      date: "March 20, 2023",
      time: "End of day",
      status: "Delivered",
      description: "Your package has been delivered",
      completed: false
    }
  ],
  shippingAddress: {
    name: "Jane Smith",
    street: "123 Wellness Ave",
    city: "Portland",
    state: "OR",
    zip: "97201",
    country: "United States"
  }
};

const TrackOrder = () => {
  const [showResults, setShowResults] = useState(false);
  const [orderStatus, setOrderStatus] = useState(mockOrderStatus);

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      orderNumber: "",
      email: "",
    },
  });

  function onSubmit(data: TrackingFormValues) {
    console.log(data);
    // In a real application, we would fetch the order status here
    // For demo purposes, we'll just show the mock data
    setShowResults(true);
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Track Your Order</h1>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Enter your order number and email address to check the status of your purchase.
          </p>
        </div>

        <div className="bg-light p-8 rounded-xl mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dark">Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ORD123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dark">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="The email used for your order" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[200px]">
                  Track Order
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {showResults && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <h2 className="text-xl font-bold text-dark">{orderStatus.orderNumber}</h2>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center bg-primary/10 text-primary font-medium rounded-full px-4 py-1">
                    <Package className="h-4 w-4 mr-2" />
                    {orderStatus.status}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">{orderStatus.placedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-medium">{orderStatus.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <div className="flex items-center">
                    <p className="font-medium mr-2">{orderStatus.trackingNumber}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ClipboardList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-bold mb-4">Shipping Progress</h3>
              
              <div className="relative">
                <div className="absolute left-7 top-0 h-full w-0.5 bg-border"></div>
                <div className="space-y-8">
                  {orderStatus.timeline.map((event, index) => (
                    <div key={index} className="flex">
                      <div className={`relative flex h-14 w-14 flex-none items-center justify-center rounded-full ${event.completed ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {event.status === "Order Placed" && <ClipboardList className="h-6 w-6" />}
                        {event.status === "Order Processed" && <CheckCircle2 className="h-6 w-6" />}
                        {event.status === "Shipped" && <Package className="h-6 w-6" />}
                        {event.status === "Out for Delivery" && <Truck className="h-6 w-6" />}
                        {event.status === "Delivered" && <BadgeCheck className="h-6 w-6" />}
                      </div>
                      <div className="ml-4 mt-1">
                        <p className="font-bold text-dark">{event.status}</p>
                        <time className="text-sm text-muted-foreground">{event.date} · {event.time}</time>
                        <p className="mt-1 text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    {orderStatus.items.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">{orderStatus.shippingAddress.name}</p>
                    <p>{orderStatus.shippingAddress.street}</p>
                    <p>
                      {orderStatus.shippingAddress.city}, {orderStatus.shippingAddress.state} {orderStatus.shippingAddress.zip}
                    </p>
                    <p>{orderStatus.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Need help with your order? Our customer support team is here to assist you.
              </p>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        )}

        {!showResults && (
          <div className="space-y-8 mt-16">
            <div className="text-center">
              <h2 className="text-2xl font-display font-medium text-dark mb-6">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold mb-3">Where's my order?</h3>
                <p className="text-muted-foreground">
                  After placing your order, you'll receive a confirmation email with your order details.
                  Once your order ships, you'll receive another email with tracking information.
                  Allow 1-2 business days for processing before shipping.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold mb-3">How long will shipping take?</h3>
                <p className="text-muted-foreground">
                  Standard shipping (3-5 business days), Expedited shipping (2 business days),
                  and Overnight shipping (next business day) options are available at checkout.
                  International shipping times vary by destination.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold mb-3">Can I change my shipping address?</h3>
                <p className="text-muted-foreground">
                  Address changes can only be made before your order ships. Please contact
                  customer service immediately if you need to update your shipping information.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-bold mb-3">What if I don't have my order number?</h3>
                <p className="text-muted-foreground">
                  If you created an account, log in to view your order history. If you checked out as a guest,
                  check your email for your order confirmation, which contains your order number.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;