import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useGAPageViews() {
  const location = useLocation();
  useEffect(() => {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: location.pathname,
      page_title: document.title
    });
  }, [location]);
}

export default useGAPageViews;