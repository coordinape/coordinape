import { ResourceIdentifier } from '../frames.ts';

export const giveResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:giveId',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.giveId}`;
  },
};
