import { useState } from "react";
import { Link, useLocation } from "wouter";
import { navItems } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { SearchIcon, User, ShoppingBag, Menu, X } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { cartItems, setIsCartOpen, cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCart = () => setIsCartOpen(true);

  return (
    <header className="sticky top-0 bg-white z-50 shadow-sm transition-all">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold text-primary">
          Pure Balance
        </Link>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`nav-link py-2 text-neutral-800 hover:text-primary transition-all ${
                location === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <button 
            className="hidden md:block text-neutral-800 hover:text-primary transition-all" 
            onClick={toggleSearch}
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link 
            href="/account" 
            className="text-neutral-800 hover:text-primary transition-all"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <button 
            className="text-neutral-800 hover:text-primary transition-all relative" 
            onClick={toggleCart}
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden text-neutral-800 hover:text-primary transition-all" 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="container mx-auto px-4 py-3 border-t border-gray-100">
          <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit" 
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-all"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="container mx-auto px-4 py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className="py-2 text-neutral-800 hover:text-primary transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-md focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-all"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
