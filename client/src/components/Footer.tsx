import { Link } from "wouter";
import { footerLinks } from "@/lib/data";
import { 
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl mb-4">Pure Balance</h3>
            <p className="text-sm text-white/80 mb-4">
              Clean, ethically sourced wellness products that restore balance to your mind and body.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="hover:text-white transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {footerLinks.information.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="hover:text-white transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {footerLinks.customerService.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="hover:text-white transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 text-sm text-white/60 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Pure Balance. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <svg className="h-8 w-12" viewBox="0 0 48 40" fill="currentColor">
              <path d="M44 0H4C1.8 0 0 1.8 0 4v32c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm0 36H4V4h40v32z" />
              <path d="M13 16h10v3H13z" />
            </svg>
            <svg className="h-8 w-12" viewBox="0 0 48 40" fill="currentColor">
              <path d="M44 0H4C1.8 0 0 1.8 0 4v32c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm0 36H4V4h40v32z" />
              <path d="M16 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm11 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
            </svg>
            <svg className="h-8 w-12" viewBox="0 0 48 40" fill="currentColor">
              <path d="M44 0H4C1.8 0 0 1.8 0 4v32c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm0 36H4V4h40v32z" />
              <path d="M24 20c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm6-8h12v16H30z" />
            </svg>
            <svg className="h-8 w-12" viewBox="0 0 48 40" fill="currentColor">
              <path d="M44 0H4C1.8 0 0 1.8 0 4v32c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm0 36H4V4h40v32z" />
              <path d="M22 20l-8-8v16zm4 0l8-8v16z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
