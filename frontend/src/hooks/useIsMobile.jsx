import { useState, useEffect } from 'react';

export default function useIsMobile(width = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < width); // Adjust the breakpoint as per your requirements
    }

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  return isMobile;
}
