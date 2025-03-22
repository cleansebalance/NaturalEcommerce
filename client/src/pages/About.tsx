import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">About Harmony Balance</h1>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            Our journey to create natural wellness products that enhance your daily self-care rituals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Story</h2>
            <p className="text-dark opacity-80 mb-6">
              Founded in 2020, Harmony Balance began with a simple mission: to create effective, natural wellness products 
              that nurture both body and mind. Our founder, Emma Chen, struggled to find skincare solutions that were both
              gentle on her sensitive skin and created with sustainable practices.
            </p>
            <p className="text-dark opacity-80 mb-6">
              After years of research and collaboration with holistic practitioners and ethical suppliers, 
              Harmony Balance was born — offering a curated collection of products that prioritize your wellness and the health of our planet.
            </p>
            <p className="text-dark opacity-80">
              Today, we continue to innovate and expand our offerings while staying true to our core values of purity, 
              sustainability, and holistic wellness.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Harmony Balance founding team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Separator className="my-20" />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Values</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto mb-12">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-light p-8 rounded-xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-leaf text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Natural Ingredients</h3>
            <p className="text-dark opacity-70">
              We use only the finest natural ingredients, ethically sourced from sustainable suppliers around the world.
            </p>
          </div>

          <div className="bg-light p-8 rounded-xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-recycle text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Eco-Friendly Practices</h3>
            <p className="text-dark opacity-70">
              From our recyclable packaging to our carbon-neutral shipping, we're committed to minimizing our environmental footprint.
            </p>
          </div>

          <div className="bg-light p-8 rounded-xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-heart text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Holistic Wellness</h3>
            <p className="text-dark opacity-70">
              We believe in nurturing both body and mind, creating products that support your complete wellness journey.
            </p>
          </div>
        </div>

        <Separator className="my-20" />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Commitment</h2>
          <p className="text-lg text-dark opacity-70 max-w-3xl mx-auto">
            We're committed to transparency, quality, and continuous improvement. Every product we create undergoes 
            rigorous testing to ensure it meets our high standards for effectiveness and purity.
          </p>
        </div>

        <div className="bg-light p-10 rounded-2xl mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4">Cruelty-Free</h3>
              <p className="text-dark opacity-70 mb-6">
                We never test on animals and work only with suppliers who share this commitment.
              </p>
              
              <h3 className="text-xl font-display font-bold mb-4">Sustainable Sourcing</h3>
              <p className="text-dark opacity-70 mb-6">
                We carefully select ingredients that are harvested using sustainable methods to protect ecosystems and communities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-display font-bold mb-4">Ethical Manufacturing</h3>
              <p className="text-dark opacity-70 mb-6">
                Our products are crafted in small batches by artisans who receive fair compensation for their expertise.
              </p>
              
              <h3 className="text-xl font-display font-bold mb-4">Giving Back</h3>
              <p className="text-dark opacity-70">
                We donate 5% of our profits to organizations working to protect natural habitats and promote wellness in underserved communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;