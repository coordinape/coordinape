import { useRecoilValue } from 'recoil';

import { rMerkleDistributor } from 'recoilState/merkleDistributor';

export const useMerkleDistributor = (epochId: number) =>
  useRecoilValue(rMerkleDistributor(epochId));
