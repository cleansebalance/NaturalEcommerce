import { useState } from "react";
import { Link } from "wouter";
import { type Category } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
      <a 
        className="group relative rounded-lg overflow-hidden h-80 transition-all block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "scale-105" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white">
            <h3 className="font-serif text-xl mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-3">{category.description}</p>
            <span className="text-sm font-medium flex items-center">
              Shop Now
              <ArrowRight className={`ml-2 h-4 w-4 transition-all duration-300 ${
                isHovered ? "ml-3" : "ml-2"
              }`} />
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
