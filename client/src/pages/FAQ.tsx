import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

// FAQ data structure
const faqData = {
  products: [
    {
      question: "Are your products suitable for sensitive skin?",
      answer: "Most of our products are formulated with sensitive skin in mind. We avoid common irritants and use gentle, natural ingredients. However, skin sensitivities vary from person to person. We recommend checking the full ingredients list before purchasing and doing a patch test before applying to larger areas. Our Pure Sensitive line is specifically designed for very sensitive skin types."
    },
    {
      question: "Do you test on animals?",
      answer: "Absolutely not. We are proud to be Leaping Bunny certified, which means we never test on animals at any stage of product development. We also ensure our ingredient suppliers adhere to the same cruelty-free standards."
    },
    {
      question: "Are your products vegan?",
      answer: "The majority of our products are vegan. Any products containing beeswax, honey, or other non-vegan ingredients are clearly labeled on our website and packaging. We're constantly working on vegan alternatives to our few non-vegan formulations."
    },
    {
      question: "What does 'natural' really mean in your products?",
      answer: "For us, 'natural' means that our ingredients come from plants, minerals, and other natural sources. We avoid synthetic chemicals, artificial fragrances, and preservatives whenever possible. Any preservatives we do use are chosen for their safety profile and used at minimal effective concentrations to ensure product safety and shelf life."
    },
    {
      question: "How should I store my Pure Balance products?",
      answer: "Most of our products should be stored in a cool, dry place away from direct sunlight. Some products, particularly those containing vitamin C and other antioxidants, may have special storage instructions on their packaging. Following these guidelines will help maintain product efficacy and extend shelf life."
    }
  ],
  orders: [
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with a tracking number and link. You can also log into your account and view your order status and tracking information from your order history page."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Shop Pay. Gift cards can also be applied to your purchase at checkout."
    },
    {
      question: "Can I modify or cancel my order after it's placed?",
      answer: "We process orders quickly to ensure fast shipping. If you need to modify or cancel your order, please contact us immediately at help@purebalance.com. We'll do our best to accommodate your request, but we cannot guarantee changes once the order has entered the processing stage."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Any applicable customs fees, duties, or taxes are the responsibility of the recipient and are not included in our shipping charges."
    },
    {
      question: "How long will it take to receive my order?",
      answer: "Domestic orders typically ship within 1-2 business days and arrive within 3-5 business days. Expedited shipping options are available at checkout. International orders generally take 7-14 business days to arrive, depending on the destination country and customs processing."
    }
  ],
  shipping: [
    {
      question: "What are your shipping rates?",
      answer: "We offer free standard shipping on all domestic orders over $50. For orders under $50, standard shipping is $5.95. Expedited and overnight shipping options are available at additional costs calculated at checkout based on weight and destination."
    },
    {
      question: "Do you ship to PO boxes or APO/FPO addresses?",
      answer: "Yes, we can ship to PO boxes and APO/FPO addresses using USPS. Please note that delivery times may be longer for these addresses, and certain shipping methods may not be available."
    },
    {
      question: "What if my package is lost or damaged?",
      answer: "If your package is lost, damaged, or shows signs of tampering, please contact our customer service team within 48 hours of delivery (or expected delivery date if it didn't arrive). We'll work with the shipping carrier to resolve the issue and ensure you receive your products in perfect condition."
    },
    {
      question: "Are shipping costs refundable?",
      answer: "If you return a product due to our error (wrong item shipped, defective product, etc.), we'll refund the full purchase price including any shipping charges. For other returns, the original shipping costs are not refundable, and return shipping costs are the responsibility of the customer unless otherwise noted."
    },
    {
      question: "Do you use eco-friendly shipping materials?",
      answer: "Yes! Sustainability is core to our mission. We use recycled, recyclable, or biodegradable packaging materials including recycled cardboard boxes, compostable mailers, paper tape, and plant-based packing peanuts. We're constantly looking for ways to reduce our environmental impact throughout our supply chain."
    }
  ],
  returns: [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day satisfaction guarantee on most products. If you're not completely satisfied, you can return unopened and gently used products within 30 days of delivery for a full refund of the purchase price (excluding shipping costs). Some items, such as final sale items or personal care products that have been substantially used, may not be eligible for return."
    },
    {
      question: "How do I initiate a return?",
      answer: "To start a return, log into your account and go to your order history. Select the order and items you wish to return and follow the prompts to generate a return shipping label. You can also contact our customer service team at returns@purebalance.com for assistance."
    },
    {
      question: "How long does the refund process take?",
      answer: "Once we receive your return, it typically takes 3-5 business days to process. After processing, you'll receive a confirmation email. Refunds usually appear on your original payment method within 5-10 business days, depending on your financial institution."
    },
    {
      question: "Can I exchange a product instead of returning it?",
      answer: "Yes, we're happy to exchange products. To request an exchange, follow the same process as a return but select 'exchange' instead of 'refund' and specify which product you'd like instead. If there's a price difference, we'll either charge or refund the difference accordingly."
    },
    {
      question: "What if I received a defective product?",
      answer: "If you received a defective product, please contact us at quality@purebalance.com within 14 days of delivery. Include your order number and photos of the defective item. We'll send a replacement right away or issue a full refund including shipping costs. You won't need to return the defective item in most cases."
    }
  ],
  account: [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking 'Sign In' at the top of our website, then selecting 'Create Account.' You'll need to provide your email address and create a password. You can also create an account during the checkout process."
    },
    {
      question: "Can I place an order without creating an account?",
      answer: "Yes, we offer guest checkout for your convenience. However, creating an account makes future purchases faster and allows you to track orders, save favorite products, and earn rewards points."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click 'Sign In' and then 'Forgot Password.' Enter the email address associated with your account, and we'll send you instructions to reset your password. For security reasons, password reset links expire after 24 hours."
    },
    {
      question: "How can I update my account information?",
      answer: "Once logged in, click on 'My Account' and select 'Account Settings' to update your personal information, shipping addresses, payment methods, and communication preferences."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. We use industry-standard encryption and security measures to protect your personal information. We never store complete credit card numbers on our servers, and we do not sell your personal information to third parties. Please see our Privacy Policy for more details."
    }
  ]
};

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{category: string, question: string, answer: string}[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results: {category: string, question: string, answer: string}[] = [];
    
    Object.entries(faqData).forEach(([category, questions]) => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      
      questions.forEach(item => {
        if (
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            category: categoryName,
            question: item.question,
            answer: item.answer
          });
        }
      });
    });
    
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto mb-8">
            Find answers to commonly asked questions about our products, shipping, returns, and more.
            If you can't find what you're looking for, please contact our customer support team.
          </p>
          
          <div className="flex gap-2 max-w-xl mx-auto">
            <Input
              placeholder="Search our FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="flex-grow"
            />
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {hasSearched && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-medium text-dark mb-6">
              Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ""}
            </h2>
            
            {searchResults.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {searchResults.map((result, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-lg">
                      {result.question}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {result.category}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent className="text-dark opacity-80">
                      {result.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 bg-muted rounded-lg">
                <p className="text-lg text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="mt-2">Try different keywords or browse our FAQ categories below</p>
              </div>
            )}
            
            <Separator className="my-8" />
          </div>
        )}

        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Accordion type="single" collapsible className="w-full">
              {faqData.products.map((item, index) => (
                <AccordionItem key={index} value={`product-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-dark opacity-80">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="orders">
            <Accordion type="single" collapsible className="w-full">
              {faqData.orders.map((item, index) => (
                <AccordionItem key={index} value={`order-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-dark opacity-80">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="shipping">
            <Accordion type="single" collapsible className="w-full">
              {faqData.shipping.map((item, index) => (
                <AccordionItem key={index} value={`shipping-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-dark opacity-80">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="returns">
            <Accordion type="single" collapsible className="w-full">
              {faqData.returns.map((item, index) => (
                <AccordionItem key={index} value={`return-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-dark opacity-80">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="account">
            <Accordion type="single" collapsible className="w-full">
              {faqData.account.map((item, index) => (
                <AccordionItem key={index} value={`account-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-dark opacity-80">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl">
          <h2 className="text-2xl font-display font-medium text-dark mb-4">Still Have Questions?</h2>
          <p className="text-dark opacity-70 max-w-2xl mx-auto mb-6">
            Our customer support team is here to help. Contact us for personalized assistance with your questions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              Contact Support
            </Button>
            <Button variant="outline">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

// Don't forget to import the Badge component if it's not already in the imports
import { Badge } from "@/components/ui/badge";