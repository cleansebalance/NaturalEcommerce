import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { X, User, ShoppingBag, Heart, Settings, LogOut, Database, Loader2, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register form schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function UserProfileDrawer({ isOpen, onClose }: UserProfileDrawerProps) {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation, logoutMutation } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  // Handle register submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

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
    logoutMutation.mutate();
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
              {user ? 'My Account' : 'Sign In'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6">
            {user ? (
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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Form */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full mt-2" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* Register Form */}
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full mt-2" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          
          {user && (
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