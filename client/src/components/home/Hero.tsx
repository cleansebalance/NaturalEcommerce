import { Link } from 'wouter';
import { useState } from 'react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556229174-5e85224f989c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Natural Beauty, Sustainable Balance",
    text: "Discover our range of natural, sustainable wellness products, designed to bring harmony to your body and mind."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Pure Ingredients, Beautiful Results",
    text: "Our skincare products are made with carefully selected natural ingredients that nourish and rejuvenate your skin."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Self-Care Rituals, Daily Harmony",
    text: "Transform your daily routine into a luxurious self-care ritual with our premium wellness collection."
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative pt-20">
      <div className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={slides[currentSlide].image} 
            alt="Natural wellness products" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-dark bg-opacity-30"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="lg:w-1/2 text-white space-y-6">
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                {slides[currentSlide].title.split(',').map((part, index) => (
                  <span key={index}>
                    {part}{index === 0 ? ',' : ''}
                    <br />
                  </span>
                ))}
              </h2>
              <p className="text-lg md:text-xl">
                {slides[currentSlide].text}
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link href="/shop" className="btn-hover-expand inline-block bg-primary text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg text-center">
                  Shop Now
                </Link>
                <Link href="/" className="btn-hover-expand inline-block bg-white text-primary px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg text-center">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slider Controls */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((slide, index) => (
            <button 
              key={slide.id} 
              className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
