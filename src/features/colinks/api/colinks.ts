import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../cosoul/chains';
import { Contracts } from '../../cosoul/contracts';

export function getCoLinksContract() {
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  return contracts.soulKeys;
}
