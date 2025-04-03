export default function TestPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4">App Diagnostic Page</h1>
        <p className="mb-4">This is a simple diagnostic page to verify the application is rendering correctly.</p>
        
        <div className="my-6 p-4 bg-gray-50 rounded-md">
          <h2 className="font-semibold mb-2">Status Check:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>React Rendering: ✅ Working</li>
            <li>CSS Styles: ✅ Working</li>
            <li>JavaScript Execution: ✅ Working</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          If you can see this page, it means the React application is functioning properly.
          The issue may be with routing or specific components.
        </p>
      </div>
    </div>
  );
}