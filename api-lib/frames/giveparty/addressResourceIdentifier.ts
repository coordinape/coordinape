import { ResourceIdentifier } from '../../../_api/frames/router';

export const addressResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:address',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.address}`;
  },
};
