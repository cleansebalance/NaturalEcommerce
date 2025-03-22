import { ReactNode } from "react";
import { Announcement } from "@/components/Announcement";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingCart } from "@/components/ShoppingCart";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <Announcement />
        <Header />
      </div>
      <main className="flex-grow mt-[120px] mb-[200px]">
        {children}
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background">
        <Footer />
      </div>
      <ShoppingCart />
    </div>
  );
}
