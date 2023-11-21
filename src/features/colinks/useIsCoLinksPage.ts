import { useLocation } from 'react-router-dom';

export const useIsCoLinksPage = () => {
  const coLinkSite = useIsCoLinksSite();
  const location = useLocation();
  if (coLinkSite) {
    return { isCoLinksPage: coLinkSite };
  }
  const isCoLinksPage = location.pathname.includes('colink');
  return { isCoLinksPage };
};

export const useIsCoLinksSite = () => {
  return window.location.origin.includes('colink');
};
