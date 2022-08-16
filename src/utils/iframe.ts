export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const isLoadedInOtherDomain = (domain: string) => {
  return (
    isInIframe() &&
    (window?.location?.ancestorOrigins?.[0]?.includes(domain) ||
      document?.referrer?.includes(domain))
  );
};

export const isGnosisApp = () => {
  return isLoadedInOtherDomain('gnosis');
};
