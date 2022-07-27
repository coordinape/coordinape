import { useState, useEffect } from 'react';

import { MediaQueryKeys } from '../stitches.config';

type MediaQueryKeysType = typeof MediaQueryKeys[keyof typeof MediaQueryKeys];

export function useMediaQuery(query: MediaQueryKeysType) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // safe to use window here because we are in useEffect -g
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}
