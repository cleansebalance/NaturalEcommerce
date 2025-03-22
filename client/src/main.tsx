import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom CSS for nav-link hover effect
const style = document.createElement('style');
style.textContent = `
  .nav-link {
    position: relative;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #3B5249;
    transition: width 0.3s ease;
  }
  
  .nav-link:hover::after,
  .nav-link.active::after {
    width: 100%;
  }
  
  .product-card:hover .product-image {
    transform: scale(1.05);
  }
  
  .product-card:hover .quick-view {
    opacity: 1;
  }
  
  .scroll-hidden::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
