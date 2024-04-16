import { ResourceIdentifier } from '../../../_api/frames/router';

export const skillResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:skill',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.skill}`;
  },
};
