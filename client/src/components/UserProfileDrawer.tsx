import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { X, User, ShoppingBag, Heart, Settings, LogOut, Database } from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDrawer({ isOpen, onClose }: UserProfileDrawerProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add event listener to close the drawer when clicking outside
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('.user-profile-drawer-content') === null && 
            !target.closest('button')?.classList.contains('user-profile-toggle')) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Disable scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    setLocation('/');
  };

  const handleNavigation = (path: string) => {
    onClose();
    setLocation(path);
  };

  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`user-profile-drawer-content fixed top-0 right-0 h-full bg-white w-full max-w-sm shadow-xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-medium">
              {isAuthenticated ? 'My Account' : 'Sign In'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6">
            {isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-neutral-600">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 py-2">
                  <button 
                    onClick={() => handleNavigation('/account')}
                    className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-50 transition-colors text-left"
                  >
                    <User className="h-5 w-5 text-neutral-600" />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/account')}
                    className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-50 transition-colors text-left"
                  >
                    <ShoppingBag className="h-5 w-5 text-neutral-600" />
                    <span>My Orders</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/wishlist')}
                    className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-50 transition-colors text-left"
                  >
                    <Heart className="h-5 w-5 text-neutral-600" />
                    <span>Wishlist</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/account')}
                    className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-50 transition-colors text-left"
                  >
                    <Settings className="h-5 w-5 text-neutral-600" />
                    <span>Settings</span>
                  </button>
                  
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => handleNavigation('/admin')}
                      className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-50 transition-colors text-left"
                    >
                      <Database className="h-5 w-5 text-neutral-600" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <p className="text-neutral-600">Sign in to view your profile, track orders, and more.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleNavigation('/login')}
                    className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    Sign In
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/register')}
                    className="w-full py-3 px-4 border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {isAuthenticated && (
            <div className="p-6 border-t">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}