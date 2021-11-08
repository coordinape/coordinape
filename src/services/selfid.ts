import { Core } from '@self.id/core';

let selfId: Core;

export const getSelfIdCore = (): Core => {
  if (selfId) {
    return selfId;
  }
  selfId = new Core({ ceramic: 'mainnet-gateway' });
  return selfId;
};
