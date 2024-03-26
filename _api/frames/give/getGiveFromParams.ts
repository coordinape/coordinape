import { NotFoundError } from '../../../api-lib/HttpError';
import { ResourceIdentifier } from '../router';

import { getGive } from './getGive';

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
