import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-accent/10">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl mb-4 font-semibold">Join Our Community</h2>
        <p className="mb-8 text-gray-600">
          Subscribe to our newsletter for exclusive offers, wellness tips, and new product announcements.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row max-w-lg mx-auto">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow sm:mb-0 mb-3">
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      className="px-4 py-3 rounded-l-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary h-[50px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-3 rounded-r-md hover:bg-opacity-90 transition-all font-medium whitespace-nowrap h-[50px]"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
        
        <p className="mt-4 text-xs text-gray-500">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  );
}
