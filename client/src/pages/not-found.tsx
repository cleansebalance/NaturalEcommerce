export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">404 Page Not Found</h1>
        <p className="text-lg">The page you're looking for doesn't exist.</p>
        <p className="mt-4">APPLICATION DIAGNOSTIC: If you can see this, the React app is rendering correctly.</p>
      </div>
    </div>
  );
}
