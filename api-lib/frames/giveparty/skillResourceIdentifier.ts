import { ResourceIdentifier } from '../frames.ts';

export const skillResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:skill',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.skill}`;
  },
};
