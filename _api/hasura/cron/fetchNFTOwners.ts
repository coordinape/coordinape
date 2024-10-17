import { VercelRequest, VercelResponse } from '@vercel/node';

import { updateNFTOwners } from '../../../api-lib/alchemy/nfts';
import { IS_LOCAL_ENV } from '../../../api-lib/config';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

export const GHOUL_CONTRACT = {
  address: '0xeF1a89cbfAbE59397FfdA11Fc5DF293E9bC5Db90',
  name: 'BasedGhouls',
  chainId: 1,
};

async function handler(_req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res.status(200).json({
      message: 'This endpoint is disabled in local environment.',
    });
  }

  const success = await fetchBasedGhouls();
  res.status(200).json(success);
}

export const fetchBasedGhouls = async () => {
  return await updateNFTOwners(
    GHOUL_CONTRACT.address,
    GHOUL_CONTRACT.name,
    GHOUL_CONTRACT.chainId
  );
};

export default verifyHasuraRequestMiddleware(handler);
