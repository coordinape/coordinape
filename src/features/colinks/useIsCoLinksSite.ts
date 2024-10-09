export const useIsCoLinksSite = () => {
  return !window.location.origin.includes('app');
};
