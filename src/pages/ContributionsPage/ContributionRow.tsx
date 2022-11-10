import React from 'react';

import { DateTime } from 'luxon';

import { Flex, Panel, Text } from '../../ui';

export const ContributionRow = ({
  description,
  datetime_created,
  active,
  disabled,
  ...rest
}: {
  description: string;
  datetime_created: string;
  active: boolean;
  disabled?: boolean;
} & React.ComponentProps<typeof Panel>) => {
  return (
    <Panel
      {...rest}
      tabIndex={0}
      css={{
        border: active ? '2px solid $link' : '2px solid $border',
        cursor: disabled ? 'auto' : 'pointer',
        opacity: disabled ? 0.5 : 1.0,
        transition: 'background-color 0.3s, border-color 0.3s',
        background: active ? '$highlight' : 'white',
        '&:hover': disabled
          ? {}
          : {
              background: '$highlight',
              border: '2px solid $link',
            },
      }}
      nested
    >
      <Flex css={{ justifyContent: 'space-between' }}>
        <Text
          ellipsis
          css={{
            mr: '10px',
            maxWidth: '60em',
          }}
        >
          {description}
        </Text>
        <Text variant="label" css={{ whiteSpace: 'nowrap' }}>
          {DateTime.fromISO(datetime_created).toFormat('LLL dd')}
        </Text>
      </Flex>
    </Panel>
  );
};
