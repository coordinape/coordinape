import { NotFoundError } from '../../../../../api-lib/HttpError.ts';
import { ResourceIdentifier } from '../../router.ts';

import { getGive } from './getGive.tsx';

export const giveResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:giveId',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.giveId}`;
  },
};

export const getGiveFromParams = async (params: Record<string, string>) => {
  const giveStr = params.giveId;
  if (!giveStr) {
    throw new NotFoundError('no giveId provided');
  }

  const giveId = Number(giveStr);
  const give = await getGive(giveId);

  return give;
};
