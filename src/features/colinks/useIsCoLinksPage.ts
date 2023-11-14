import { useLocation } from 'react-router-dom';

export const useIsCoLinksPage = () => {
  const location = useLocation();
  const isCoLinksPage = location.pathname.includes('colink');
  return { isCoLinksPage };
};
