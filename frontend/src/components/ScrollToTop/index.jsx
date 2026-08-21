import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop resets the window scroll position to the top
 * whenever the route (pathname) changes.
 *
 * This prevents the issue where navigating between sidebar links
 * (e.g., Products → Customers) keeps the previous page's scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
