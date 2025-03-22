import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1770&auto=format&fit=crop" 
          alt="Natural wellness products on display" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl mb-4 font-bold leading-tight">
            Nature's Finest Wellness Products
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl mx-auto">
            Clean, ethically sourced ingredients that nourish your body and restore balance.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/products">
              <a className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium text-sm md:text-base inline-block">
                Shop Collection
              </a>
            </Link>
            <Link href="/about">
              <a className="bg-white text-primary px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium text-sm md:text-base inline-block">
                Learn More
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
