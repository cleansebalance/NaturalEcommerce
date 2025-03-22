import { useState, useEffect } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Set initial value
      checkMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkMobile);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }
  }, []);

  return isMobile;
}
