import { ResourceIdentifier } from '../router';

export const personaResourceIdentifier: ResourceIdentifier = {
  resourcePathExpression: '/:personaId',
  getResourceId: (params: Record<string, string>) => {
    return `/${params.personaId}`;
  },
};
