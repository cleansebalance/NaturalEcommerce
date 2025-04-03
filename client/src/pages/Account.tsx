import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    setLocation('/auth');
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutMutation.mutateAsync();
      setLocation('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem logging out',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-medium mb-2">My Account</h1>
        <p className="text-neutral-600">Manage your personal information and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-neutral-50 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Account Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-500">Name</p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Email</p>
              <p>{user?.email}</p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-2 px-4 border border-neutral-300 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                {isLoggingOut ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-neutral-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-medium mb-4">Recent Orders</h2>
            <div className="text-center py-8 text-neutral-500">
              <p>You haven't placed any orders yet.</p>
              <button
                onClick={() => setLocation('/shop')}
                className="mt-4 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Saved Addresses</h2>
            <div className="text-center py-6 text-neutral-500">
              <p>You don't have any saved addresses yet.</p>
              <button
                className="mt-4 py-2 px-4 border border-neutral-300 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                Add New Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}