import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "The Science Behind Natural Skincare Ingredients",
    excerpt: "Discover how natural ingredients can effectively address common skin concerns through science-backed benefits.",
    coverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Skincare",
    author: "Dr. Emma Reynolds",
    date: "June 15, 2023",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Creating Your Perfect Daily Self-Care Ritual",
    excerpt: "Learn how to develop a personalized self-care routine that nurtures your mind, body, and spirit for greater wellbeing.",
    coverImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Wellness",
    author: "Sarah Mitchell",
    date: "May 22, 2023",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Sustainable Beauty: Making Eco-Conscious Choices",
    excerpt: "Explore how your beauty choices impact the planet and discover simple ways to make your routine more sustainable.",
    coverImage: "https://images.unsplash.com/photo-1532413778408-b2113acd2a7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Sustainability",
    author: "James Taylor",
    date: "April 10, 2023",
    readTime: "7 min read"
  },
  {
    id: 4,
    title: "Essential Oils Guide: Benefits and Uses",
    excerpt: "A comprehensive guide to understanding different essential oils and how to incorporate them into your wellness routine.",
    coverImage: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Aromatherapy",
    author: "Lisa Chen",
    date: "March 28, 2023",
    readTime: "9 min read"
  },
  {
    id: 5,
    title: "Seasonal Skincare: Adjusting Your Routine Through the Year",
    excerpt: "How to adapt your skincare routine to address changing environmental conditions and keep your skin balanced year-round.",
    coverImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Skincare",
    author: "Dr. Emma Reynolds",
    date: "February 14, 2023",
    readTime: "5 min read"
  },
  {
    id: 6,
    title: "Mindfulness and Beauty: The Connection Between Inner Peace and Outer Radiance",
    excerpt: "Understanding how reducing stress and practicing mindfulness can significantly improve your skin's appearance.",
    coverImage: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80",
    category: "Wellness",
    author: "Michael Wong",
    date: "January 30, 2023",
    readTime: "10 min read"
  }
];

const categories = ["All", "Skincare", "Wellness", "Sustainability", "Aromatherapy"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    // Filter by category
    const categoryMatch = activeCategory === "All" || post.category === activeCategory;
    
    // Filter by search query
    const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">Pure Balance Blog</h1>
          <p className="text-lg text-dark opacity-70 max-w-3xl mx-auto">
            Explore our collection of articles on natural skincare, wellness tips, sustainability practices, 
            and the science behind our ingredients.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex overflow-x-auto pb-3 md:pb-0 space-x-2 w-full md:w-auto">
              {categories.map(category => (
                <Badge 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"} 
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Separator className="my-8" />
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="font-normal">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-dark opacity-70 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      By {post.author} • {post.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Read more
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}

        <div className="text-center">
          <Separator className="my-8" />
          <h2 className="text-2xl font-display font-medium text-dark mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-dark opacity-70 max-w-2xl mx-auto mb-8">
            Stay updated with our latest articles, product launches, and exclusive offers.
            We promise to only send content you'll love, straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Your email address" className="flex-grow" />
            <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;