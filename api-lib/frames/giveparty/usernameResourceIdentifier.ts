import { ResourceIdentifier } from '../frames.ts';

export const usernameResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:username',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.username}`;
  },
};
