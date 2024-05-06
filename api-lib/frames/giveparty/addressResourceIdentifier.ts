import { ResourceIdentifier } from '../frames.ts';

export const addressResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:address',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.address}`;
  },
};
