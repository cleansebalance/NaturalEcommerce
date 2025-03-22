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
      <Announcement />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ShoppingCart />
    </div>
  );
}
