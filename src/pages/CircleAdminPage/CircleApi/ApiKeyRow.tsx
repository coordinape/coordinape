import React from 'react';

import pickBy from 'lodash/pickBy';

import { Trash2 } from '../../../icons/__generated';
import { Box, Button, Flex, HR, Text } from 'ui';

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
    <Flex css={{ flexDirection: 'column', flex: 1 }}>
      <Box css={{ display: 'flex', alignItems: 'start', gap: '$md', flex: 1 }}>
        <Box css={{ flexGrow: 1 }}>
          <Text h3 semibold>
            {apiKey.name}
          </Text>
          <Text size={'small'} color={'neutral'}>
            Created by{' '}
            {apiKey.createdByUser.profile.name ?? apiKey.createdByUser.name}
          </Text>
          <Button
            css={{ mt: '$md' }}
            color="destructive"
            size="small"
            onClick={e => {
              e.preventDefault();
              onDelete(apiKey.hash);
            }}
          >
            <Trash2 size="sm" color="inherit" />
            Remove
          </Button>
        </Box>

        <Text variant={'label'} css={{ mt: '$sm' }}>
          {permissionsString || 'No permissions given'}
        </Text>
      </Box>
      <HR />
    </Flex>
  );
}
