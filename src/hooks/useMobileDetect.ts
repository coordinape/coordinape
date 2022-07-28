import React from 'react';

export default function useMobileDetect() {
  const [isMobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    // safe to refer to window here because we are in a useEffect -g
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);
  }, []);

  return { isMobile };
}
