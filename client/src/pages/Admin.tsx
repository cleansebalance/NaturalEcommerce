import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Database, Check, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { MainLayout } from '@/layouts/MainLayout';

export default function Admin() {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMigration = async () => {
    try {
      setMigrationStatus('loading');
      setMessage('Migration in progress. This may take a few minutes...');
      
      const response = await apiRequest(
        'POST',
        '/api/supabase/migrate',
        {}
      );
      
      setMigrationStatus('success');
      setMessage('Migration completed successfully! Your product catalog is now stored in Supabase.');
      
      return response;
    } catch (error) {
      setMigrationStatus('error');
      setMessage('Migration failed. Please check server logs for details.');
      console.error('Migration error:', error);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your store settings and data</p>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Migration
              </CardTitle>
              <CardDescription>
                Migrate your product catalog data to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will create the necessary tables in your Supabase database and migrate your product catalog data.
                The migration will preserve all your existing products, categories, and testimonials.
              </p>
              
              {migrationStatus === 'success' && (
                <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              {migrationStatus === 'error' && (
                <Alert variant="destructive" className="mb-4">
                  <X className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              {migrationStatus === 'loading' && (
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Processing</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleMigration} 
                disabled={migrationStatus === 'loading'}
                className="w-full"
              >
                {migrationStatus === 'loading' ? 'Migrating...' : 'Start Migration'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Additional admin cards can be added here */}
        </div>
      </div>
    </MainLayout>
  );
}