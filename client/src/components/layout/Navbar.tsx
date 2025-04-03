import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import { UserProfileDrawer } from '@/components/UserProfileDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserProfile = () => {
    setIsUserProfileOpen(!isUserProfileOpen);
  };

  return (
    <>
      <nav className={`fixed w-full bg-white bg-opacity-80 z-40 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-display font-bold text-primary">Harmony Balance</h1>
              </Link>
            </div>
            
            {/* Navigation Items - Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link href="/" className="font-medium text-dark hover:text-primary transition-colors duration-300">Home</Link>
                <Link href="/shop" className="font-medium text-dark hover:text-primary transition-colors duration-300">Shop</Link>
                <Link href="/shop" className="font-medium text-dark hover:text-primary transition-colors duration-300">Collections</Link>
                <Link href="/about" className="font-medium text-dark hover:text-primary transition-colors duration-300">About</Link>
                <Link href="/contact" className="font-medium text-dark hover:text-primary transition-colors duration-300">Contact</Link>
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center">
              <button 
                className="p-2 rounded-full hover:bg-light transition-all duration-300 mr-2"
                onClick={() => setLocation('/shop')}
              >
                <i className="fas fa-search text-dark"></i>
              </button>
              <button 
                className="user-profile-toggle p-2 rounded-full hover:bg-light transition-all duration-300 mr-2"
                onClick={toggleUserProfile}
                aria-label={user ? "My Account" : "Sign In"}
              >
                <i className="fas fa-user text-dark"></i>
              </button>
              <button 
                className="p-2 rounded-full hover:bg-light relative transition-all duration-300"
                onClick={() => toggleCart(true)}
              >
                <i className="fas fa-shopping-bag text-dark"></i>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="ml-4 md:hidden rounded-md p-2 hover:bg-light transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                <i className="fas fa-bars text-dark"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white p-4 border-t border-neutral`}>
          <div className="space-y-3">
            <Link href="/" 
              className="block font-medium text-dark hover:text-primary transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link href="/shop" 
              className="block font-medium text-dark hover:text-primary transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link href="/shop" 
              className="block font-medium text-dark hover:text-primary transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link href="/about" 
              className="block font-medium text-dark hover:text-primary transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link href="/contact" 
              className="block font-medium text-dark hover:text-primary transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* User Profile Drawer */}
      <UserProfileDrawer 
        isOpen={isUserProfileOpen} 
        onClose={() => setIsUserProfileOpen(false)} 
      />
    </>
  );
};

export default Navbar;
