import { features } from "@/lib/data";
import { Leaf, Recycle, Heart } from "lucide-react";

export function FeaturesBanner() {
  // Function to get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "leaf":
        return <Leaf className="text-primary text-xl" />;
      case "recycle":
        return <Recycle className="text-primary text-xl" />;
      case "heart":
        return <Heart className="text-primary text-xl" />;
      default:
        return <Leaf className="text-primary text-xl" />;
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center">
                  {getIcon(feature.icon)}
                </div>
              </div>
              <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
