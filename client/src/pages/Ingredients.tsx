import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Ingredients = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Our Natural Ingredients</h1>
          <p className="text-lg text-dark opacity-70 max-w-3xl mx-auto">
            We believe in transparency. That's why we're proud to share the carefully selected natural ingredients
            that make our products so effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-display font-medium text-dark mb-6">The Pure Balance Difference</h2>
            <p className="text-dark opacity-70 mb-6">
              At Pure Balance, we're committed to using only the highest quality natural ingredients.
              We carefully source botanicals, essential oils, and minerals that are:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-dark opacity-70 mb-6">
              <li>Ethically and sustainably harvested</li>
              <li>Organic whenever possible</li>
              <li>Free from harmful chemicals and toxins</li>
              <li>Selected for their proven benefits</li>
              <li>Minimally processed to preserve their natural goodness</li>
            </ul>
            <p className="text-dark opacity-70">
              We believe that what goes onto your skin should be just as clean as what goes into your body.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1617500603321-aa294726a471?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80" 
              alt="Natural ingredients" 
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
        </div>

        <Separator className="my-20" />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-medium text-dark mb-6">Our Star Ingredients</h2>
          <p className="text-lg text-dark opacity-70 max-w-2xl mx-auto">
            These powerful natural ingredients are the foundation of our most beloved formulations.
          </p>
        </div>

        <Tabs defaultValue="botanical" className="mb-20">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10">
            <TabsTrigger value="botanical">Botanicals</TabsTrigger>
            <TabsTrigger value="essential">Essential Oils</TabsTrigger>
            <TabsTrigger value="minerals">Minerals & Clays</TabsTrigger>
          </TabsList>
          <TabsContent value="botanical">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1588940086836-36c7d89611a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Aloe Vera" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Aloe Vera</h3>
                <p className="text-dark opacity-70 mb-3">
                  A powerhouse of vitamins, minerals, and amino acids that soothes, hydrates, and promotes skin healing.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Facial Cleanser, Hydrating Serum</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Jojoba Oil" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Jojoba Oil</h3>
                <p className="text-dark opacity-70 mb-3">
                  Mimics skin's natural sebum to balance oil production while deeply nourishing and protecting.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Facial Oil, Body Lotion</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1612403516604-5b3f3d9456c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Green Tea Extract" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Green Tea Extract</h3>
                <p className="text-dark opacity-70 mb-3">
                  Packed with antioxidants that fight free radicals, reduce inflammation, and protect skin from damage.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Antioxidant Serum, Face Mask</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="essential">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1624726175512-8ccda36a96cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Lavender Oil" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Lavender Essential Oil</h3>
                <p className="text-dark opacity-70 mb-3">
                  Calms and soothes the skin while providing a gentle, natural fragrance that promotes relaxation.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Sleep Ritual Oil, Calming Mist</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1564185322728-74aece49163e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Frankincense Oil" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Frankincense Essential Oil</h3>
                <p className="text-dark opacity-70 mb-3">
                  Revered for centuries, it rejuvenates skin cells, reduces the appearance of scars, and promotes even skin tone.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Regenerative Serum, Night Cream</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1533792965403-32a7ffafc85e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Eucalyptus Oil" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Eucalyptus Essential Oil</h3>
                <p className="text-dark opacity-70 mb-3">
                  Refreshes and invigorates with antimicrobial properties that cleanse and purify the skin.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Purifying Mist, Bath Salts</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="minerals">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1529348915581-73ac378f1d3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Pink Clay" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Pink Clay</h3>
                <p className="text-dark opacity-70 mb-3">
                  Gently draws out impurities while delivering minerals that strengthen and rejuvenate the skin.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Clay Mask, Exfoliating Scrub</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1564277287253-934c868e54ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Dead Sea Salt" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Dead Sea Salt</h3>
                <p className="text-dark opacity-70 mb-3">
                  Rich in minerals like magnesium, calcium, and potassium that detoxify and restore skin's natural balance.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Bath Soak, Body Scrub</p>
              </div>
              
              <div className="bg-light p-6 rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1556228578-e276294ef80e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Zinc Oxide" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-display font-bold mb-2">Zinc Oxide</h3>
                <p className="text-dark opacity-70 mb-3">
                  A natural mineral that provides broad-spectrum sun protection and soothes irritated skin.
                </p>
                <p className="text-sm text-primary font-medium">Found in: Mineral Sunscreen, Soothing Balm</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 p-10 rounded-2xl mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-medium text-dark mb-6">Our Promise to You</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4">What's Never In Our Products</h3>
              <ul className="list-disc pl-5 space-y-2 text-dark opacity-70">
                <li>Parabens and phthalates</li>
                <li>Synthetic fragrances</li>
                <li>Artificial colors</li>
                <li>Formaldehyde and formaldehyde-releasing agents</li>
                <li>Sulfates (SLS & SLES)</li>
                <li>Silicones</li>
                <li>Petroleum derivatives</li>
                <li>Animal by-products</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold mb-4">Our Ingredient Standards</h3>
              <ul className="list-disc pl-5 space-y-2 text-dark opacity-70">
                <li>Full transparency with complete ingredient lists</li>
                <li>Rigorous testing for purity and potency</li>
                <li>Emphasis on organic and wild-harvested when possible</li>
                <li>Preference for fair-trade and regeneratively farmed sources</li>
                <li>Regular supplier audits to ensure ethical practices</li>
                <li>Continuous research to find the most effective natural alternatives</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-display font-medium text-dark mb-6">Questions About Our Ingredients?</h2>
          <p className="text-dark opacity-70 max-w-3xl mx-auto mb-8">
            We love talking about what goes into our products. If you have any questions about specific ingredients
            or would like to learn more about our sourcing practices, please don't hesitate to reach out.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;