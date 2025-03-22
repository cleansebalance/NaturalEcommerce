import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate sending the message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Contact Us</h1>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-display font-medium text-dark mb-6">Get in Touch</h2>
            <p className="text-dark opacity-80 mb-8">
              We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your inquiry..." 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </div>

          <div className="bg-light p-8 rounded-xl">
            <h2 className="text-2xl font-display font-medium text-dark mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">Our Location</h3>
                  <p className="text-dark opacity-70">
                    123 Wellness Way<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">Email Us</h3>
                  <p className="text-dark opacity-70">
                    hello@harmonybalance.com<br />
                    support@harmonybalance.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-phone-alt text-primary"></i>
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">Call Us</h3>
                  <p className="text-dark opacity-70">
                    +1 (555) 123-4567<br />
                    Monday-Friday: 9AM-5PM PST
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-clock text-primary"></i>
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1">Business Hours</h3>
                  <p className="text-dark opacity-70">
                    Monday-Friday: 9AM-5PM PST<br />
                    Saturday: 10AM-3PM PST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-dark mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <i className="fab fa-instagram text-primary"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <i className="fab fa-facebook-f text-primary"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <i className="fab fa-twitter text-primary"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <i className="fab fa-pinterest-p text-primary"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-neutral rounded-xl overflow-hidden h-96">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.03112961377!2d-122.43115225!3d37.773329850000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sbd!4v1656568062599!5m2!1sen!2sbd" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Harmony Balance Store Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;