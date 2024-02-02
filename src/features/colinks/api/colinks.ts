import deploymentInfo from '@coordinape/contracts/deploymentInfo.json';
import { CoLinks__factory } from '@coordinape/contracts/typechain';

import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../cosoul/chains';

export function getCoLinksContract() {
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const info = (deploymentInfo as any)[chainId];
  if (!info) {
    throw new Error(`No info for chain ${chainId}`);
  }
  return CoLinks__factory.connect(info.CoLinks.address, provider);
}
