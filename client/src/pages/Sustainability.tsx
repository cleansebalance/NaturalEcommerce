import { Separator } from "@/components/ui/separator";
import { Leaf, Recycle, Droplet, Wind } from "lucide-react";

const Sustainability = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Our Sustainability Commitment</h1>
          <p className="text-lg text-dark opacity-70 max-w-3xl mx-auto">
            At Pure Balance, sustainability isn't just a buzzword—it's the foundation of everything we do. 
            We're committed to creating products that nurture both you and the planet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80" 
              alt="Sustainable practices" 
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Approach</h2>
            <p className="text-dark opacity-70 mb-6">
              We believe that wellness and sustainability go hand in hand. That's why we've built our business
              around practices that respect the earth's resources and the communities that provide our ingredients.
            </p>
            <p className="text-dark opacity-70">
              From sustainable harvesting methods to eco-friendly packaging, we consider the environmental impact
              of every decision we make. We're constantly innovating to reduce our footprint while delivering
              the pure, effective products you expect.
            </p>
          </div>
        </div>

        <Separator className="my-20" />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Sustainable Practices</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            These are the key ways we're working to protect our planet while creating products you'll love.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-light p-8 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Leaf className="text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Responsible Sourcing</h3>
            <p className="text-dark opacity-70">
              We carefully select suppliers who share our commitment to ethical and sustainable practices.
              We prioritize organic ingredients, fair trade certifications, and sustainable harvesting methods
              that protect biodiversity and support local communities.
            </p>
          </div>

          <div className="bg-light p-8 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Recycle className="text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Eco-Friendly Packaging</h3>
            <p className="text-dark opacity-70">
              Our packaging is designed with the planet in mind. We use recyclable, biodegradable, or
              compostable materials whenever possible. We're working towards eliminating virgin plastic
              from our supply chain and incorporating more post-consumer recycled materials.
            </p>
          </div>

          <div className="bg-light p-8 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Droplet className="text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Water Conservation</h3>
            <p className="text-dark opacity-70">
              We recognize that water is a precious resource. Our manufacturing processes are designed
              to minimize water usage, and we support water conservation initiatives in regions where
              our ingredients are harvested.
            </p>
          </div>

          <div className="bg-light p-8 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Wind className="text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-4">Carbon Footprint Reduction</h3>
            <p className="text-dark opacity-70">
              We're committed to reducing our carbon emissions throughout our supply chain. We use
              renewable energy in our facilities where possible, optimize shipping routes, and offset
              the carbon emissions we can't yet eliminate.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 p-10 rounded-2xl mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-medium text-dark mb-6">Our Sustainability Goals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
              <p className="text-dark opacity-70">
                Recyclable, reusable, or compostable packaging by 2025
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">50%</h3>
              <p className="text-dark opacity-70">
                Reduction in carbon emissions across our supply chain by 2030
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary mb-2">Zero</h3>
              <p className="text-dark opacity-70">
                Net waste to landfill from our operations by 2027
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-display font-medium text-dark mb-6">Our Certifications</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="w-32 h-32 bg-light rounded-full flex items-center justify-center">
              <span className="font-medium text-primary">Leaping Bunny</span>
            </div>
            <div className="w-32 h-32 bg-light rounded-full flex items-center justify-center">
              <span className="font-medium text-primary">FSC Certified</span>
            </div>
            <div className="w-32 h-32 bg-light rounded-full flex items-center justify-center">
              <span className="font-medium text-primary">B Corp</span>
            </div>
            <div className="w-32 h-32 bg-light rounded-full flex items-center justify-center">
              <span className="font-medium text-primary">Climate Neutral</span>
            </div>
          </div>
          <p className="text-dark opacity-70 max-w-3xl mx-auto">
            We're proud to partner with organizations that hold us accountable and push us to continually improve our sustainability practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;