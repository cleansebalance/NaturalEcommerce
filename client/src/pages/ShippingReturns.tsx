import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Truck, PackageCheck, Clock, Globe, ArrowLeftRight } from "lucide-react";

const ShippingReturns = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="shipping" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="shipping">Shipping Information</TabsTrigger>
            <TabsTrigger value="returns">Returns & Exchanges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipping">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-dark mb-4">Shipping Information</h1>
              <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
                We want to ensure your Pure Balance products reach you quickly and safely.
                Below you'll find everything you need to know about our shipping policies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-light p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Truck className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">Delivery Options</h3>
                <div className="space-y-4 text-dark opacity-80">
                  <p className="font-medium">Standard Shipping (3-5 business days)</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Free on orders over $50</li>
                    <li>$5.95 for orders under $50</li>
                  </ul>
                  
                  <p className="font-medium">Expedited Shipping (2 business days)</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>$12.95 for all orders</li>
                    <li>Order by 12pm EST for same-day processing</li>
                  </ul>
                  
                  <p className="font-medium">Overnight Shipping (Next business day)</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>$19.95 for all orders</li>
                    <li>Order by A 12pm EST for same-day processing</li>
                    <li>Not available for PO boxes</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-light p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">Processing Times</h3>
                <div className="space-y-4 text-dark opacity-80">
                  <p>
                    Orders are processed within 1-2 business days after being placed. During peak
                    seasons or promotional periods, processing may take an additional day.
                  </p>
                  <p>
                    Business days are Monday through Friday, excluding national holidays. Orders
                    placed after 12pm EST may be processed the following business day.
                  </p>
                  <p>
                    Once your order ships, you'll receive a confirmation email with tracking 
                    information. You can also view order status by logging into your account.
                  </p>
                  <p className="font-medium">
                    Please note: Shipping times are estimates and not guaranteed. Weather conditions
                    and carrier delays may impact delivery times.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-light p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Globe className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">International Shipping</h3>
                <div className="space-y-4 text-dark opacity-80">
                  <p>
                    We currently ship to over 40 countries worldwide. International shipping rates
                    are calculated at checkout based on destination and order weight.
                  </p>
                  <p className="font-medium">International Delivery Times:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Canada: 5-7 business days</li>
                    <li>Europe: 7-14 business days</li>
                    <li>Australia & New Zealand: 10-15 business days</li>
                    <li>Asia: 10-15 business days</li>
                    <li>Rest of World: 14-21 business days</li>
                  </ul>
                  <p>
                    Please note that international orders may be subject to customs duties, taxes,
                    and fees, which are the responsibility of the recipient and are not included in
                    our shipping charges.
                  </p>
                </div>
              </div>
              
              <div className="bg-light p-8 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <PackageCheck className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">Shipping FAQ</h3>
                <div className="space-y-4 text-dark opacity-80">
                  <p className="font-medium">Do you ship to PO boxes?</p>
                  <p>
                    Yes, we ship to PO boxes using USPS, but only for standard shipping. Expedited
                    and overnight options are not available for PO boxes.
                  </p>
                  
                  <p className="font-medium">Can I change my shipping address?</p>
                  <p>
                    Address changes can only be made before your order ships. Please contact customer
                    service immediately if you need to update your shipping information.
                  </p>
                  
                  <p className="font-medium">What if my package is lost or damaged?</p>
                  <p>
                    Please contact us within 14 days of the expected delivery date if your package 
                    is lost, damaged, or shows signs of tampering. We'll work with the carrier to 
                    resolve the issue promptly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl text-center mb-12">
              <h3 className="text-xl font-display font-bold mb-4">Our Eco-Friendly Shipping Commitment</h3>
              <p className="text-dark opacity-80 max-w-2xl mx-auto mb-6">
                As part of our sustainability commitment, we use recycled and biodegradable shipping materials,
                carbon-neutral shipping options, and optimize package sizes to reduce our environmental impact.
                Orders are consolidated whenever possible to minimize packaging waste.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="returns">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-dark mb-4">Returns & Exchanges</h1>
              <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
                We want you to be completely satisfied with your Pure Balance purchase.
                Our hassle-free return and exchange policy is designed with your satisfaction in mind.
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div className="bg-light p-8 rounded-xl">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowLeftRight className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-4">Return Policy Overview</h3>
                    <div className="space-y-4 text-dark opacity-80">
                      <p>
                        We offer a 30-day satisfaction guarantee on most products. If you're not completely
                        satisfied with your purchase, you can return it within 30 days of delivery for a full
                        refund of the purchase price (excluding shipping costs).
                      </p>
                      <p>
                        To be eligible for a return, items must be:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>In original or gently used condition (used no more than 1-2 times for skin products)</li>
                        <li>In the original packaging when possible</li>
                        <li>Accompanied by the original receipt or proof of purchase</li>
                      </ul>
                      <p className="font-medium">
                        The following items are not eligible for return or exchange:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Items marked as "Final Sale"</li>
                        <li>Gift cards</li>
                        <li>Personal care products that have been substantially used (more than 30% used)</li>
                        <li>Bundles or sets with missing components</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-light p-8 rounded-xl">
                <h3 className="text-xl font-display font-bold mb-4">How to Return or Exchange an Item</h3>
                <div className="space-y-6 text-dark opacity-80">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Initiate your return or exchange</p>
                      <p>
                        Log into your account, navigate to your order history, select the order and items
                        you wish to return, and follow the prompts to generate a return shipping label.
                        If you checked out as a guest, use our <a href="#" className="text-primary hover:underline">return portal</a> and
                        enter your order number and email address.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Package your return</p>
                      <p>
                        Carefully pack the item(s) in the original packaging when possible. Include any accessories
                        that came with the product. Place the return label on the outside of the package.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Ship your return</p>
                      <p>
                        Drop off your package at any authorized shipping location. We recommend keeping the
                        tracking information until your return has been processed. Return shipping costs are
                        the responsibility of the customer unless the return is due to our error.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Refund or exchange processing</p>
                      <p>
                        Once we receive your return, it typically takes 3-5 business days to process. After
                        processing, you'll receive a confirmation email. Refunds are issued to the original
                        payment method and usually appear within 5-10 business days, depending on your
                        financial institution. For exchanges, your new item will be shipped after your
                        return is processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-light p-8 rounded-xl">
                <h3 className="text-xl font-display font-bold mb-4">Damaged or Defective Products</h3>
                <div className="space-y-4 text-dark opacity-80">
                  <p>
                    If you received a damaged or defective product, please contact our customer service team
                    at quality@purebalance.com within 14 days of delivery. Include the following information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your order number</li>
                    <li>Description of the issue</li>
                    <li>Photos of the damaged or defective product</li>
                  </ul>
                  <p>
                    We'll arrange for a replacement to be sent right away or issue a full refund including shipping costs.
                    In most cases, you won't need to return the damaged or defective item.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl text-center mb-8">
              <h3 className="text-xl font-display font-bold mb-4">Our Satisfaction Guarantee</h3>
              <p className="text-dark opacity-80 max-w-2xl mx-auto">
                Your satisfaction is our top priority. If for any reason you're not completely happy with your
                Pure Balance purchase, we're here to make it right. If you have any questions about our return
                policy, please don't hesitate to contact our customer service team.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-12" />
        
        <div className="text-center">
          <h2 className="text-2xl font-display font-medium text-dark mb-6">Need Additional Help?</h2>
          <p className="text-dark opacity-70 max-w-2xl mx-auto mb-8">
            Our customer support team is available Monday through Friday, 9am-6pm EST.
            We're happy to assist with any questions about shipping, tracking, or returns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              Contact Support
            </Button>
            <Button variant="outline">
              Track Your Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;