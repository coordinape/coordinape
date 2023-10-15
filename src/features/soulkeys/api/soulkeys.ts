import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../cosoul/chains';
import { Contracts } from '../../cosoul/contracts';

export function getSoulKeysContract() {
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  return contracts.soulKeys;
}

// export async function getTradeInfofromLogs(log: any) {
//   if (log === undefined) return null;
//   const iface = getSoulKeysContract().interface;
//   const {
//     args: { from, to, tokenId: tokenIdBN },
//   } = iface.parseLog(log);
//   const tokenId = tokenIdBN.toNumber();
//   return { from, to, tokenId };
// }
