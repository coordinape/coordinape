import { optimism, optimismSepolia } from '@wagmi/core/chains';

import { IN_PREVIEW, IN_PRODUCTION } from '../../config/env';
import { isFeatureEnabled } from '../../config/features';
import { localhost } from '../../utils/viem/chains';

const getChain = () => {
  if (isFeatureEnabled('test_decent') || IN_PRODUCTION) {
    return optimism;
  } else if (IN_PREVIEW) {
    return optimismSepolia;
  } else {
    return localhost;
  }
};

export const wagmiChain = getChain();
