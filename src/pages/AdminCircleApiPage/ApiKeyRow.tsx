import pickBy from 'lodash/pickBy';

import { Box, Button, Panel, Text } from 'ui';

import { API_PERMISSION_LABELS } from './constants';
import {
  CircleApiKeysResponse,
  CircleApiPermissions,
  circleApiPermissionsSelector,
} from './useCircleApiKeys';

export function ApiKeyRow({
  apiKey,
  onDelete,
}: {
  apiKey: CircleApiKeysResponse;
  onDelete: (hash: string) => void;
}) {
  const permissions = pickBy(
    apiKey,
    (v, k) => v === true && k in circleApiPermissionsSelector
  );

  const permissionsString = Object.keys(permissions)
    .map(p => API_PERMISSION_LABELS[p as keyof CircleApiPermissions])
    .join(', ');

  return (
    <Panel>
      <Box css={{ display: 'flex', alignItems: 'center', gap: '$md' }}>
        <Box css={{ flexGrow: 1 }}>
          <Text h3>{apiKey.name}</Text>
          <Text size={'small'} color={'neutral'}>
            Created by {apiKey.createdByUser.name}
          </Text>
          <Text variant={'label'} css={{ mt: '$sm' }}>
            {permissionsString || 'No permissions given'}
          </Text>
        </Box>

        <Button
          color="destructive"
          outlined
          size="small"
          onClick={() => onDelete(apiKey.hash)}
        >
          Delete
        </Button>
      </Box>
    </Panel>
  );
}
