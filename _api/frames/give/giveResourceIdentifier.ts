import { ResourceIdentifier } from '../router';

export const giveResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:giveId',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.giveId}`;
  },
};
