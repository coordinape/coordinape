import { useRecoilValue } from 'recoil';

import { rReceivedGiftsByUser } from 'recoilState/receivedGiftsByUser';

export const useReceivedGiftsByUser = (epochId: number) =>
  useRecoilValue(rReceivedGiftsByUser(epochId));
