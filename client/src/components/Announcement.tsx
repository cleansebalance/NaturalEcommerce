import { useState } from "react";

export function Announcement() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-primary text-white text-center py-2 text-sm font-medium relative">
      <p>Free shipping on all orders over $75 | Use code WELCOME15 for 15% off</p>
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
