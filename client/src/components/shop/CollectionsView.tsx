import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useProducts } from '@/context/ProductsContext';
import { Loader2 } from 'lucide-react';

interface CollectionGroup {
  title: string;
  description: string;
  imageUrl: string;
  categoryId?: number;
  url: string;
}

const CollectionsView = () => {
  const { categories } = useProducts();
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  
  useEffect(() => {
    if (categories.data) {
      // Create collection groups from categories
      const collectionGroups: CollectionGroup[] = categories.data.map(category => ({
        title: category.name,
        description: category.description || `Explore our ${category.name.toLowerCase()} collection.`,
        imageUrl: category.imageUrl || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
        categoryId: category.id,
        url: `/shop?category=${category.id}`
      }));
      
      // Add featured collections
      const featuredCollections: CollectionGroup[] = [
        {
          title: 'New Arrivals',
          description: 'The latest additions to our wellness collection, fresh and ready to transform your self-care routine.',
          imageUrl: 'https://images.unsplash.com/photo-1624454002302-c8d774558088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          url: '/shop?sort=newest'
        },
        {
          title: 'Best Sellers',
          description: 'Our most popular products that customers love and come back for again and again.',
          imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          url: '/shop?sort=popular'
        },
        {
          title: 'Gift Sets',
          description: 'Curated collections perfect for gifting to yourself or a loved one.',
          imageUrl: 'https://images.unsplash.com/photo-1561693556-70e28cce27ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          url: '/shop?tag=gift'
        }
      ];
      
      setCollections([...featuredCollections, ...collectionGroups]);
    }
  }, [categories.data]);
  
  if (categories.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <Link 
          key={index} 
          href={collection.url} 
          className="group bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative h-64 overflow-hidden">
            <img 
              src={collection.imageUrl} 
              alt={collection.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-display font-bold mb-1">{collection.title}</h3>
                <p className="text-sm opacity-90">{collection.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CollectionsView;