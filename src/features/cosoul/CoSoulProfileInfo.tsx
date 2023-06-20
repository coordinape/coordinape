import { DateTime } from 'luxon';

import { Avatar, Flex, Panel, Text } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulProfileInfo = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  const member_since_date = cosoul_data.profileInfo?.created_at
    ? DateTime.fromISO(cosoul_data.profileInfo.created_at).toFormat('DD')
    : undefined;

  return (
    <Flex
      column
      css={{
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
        mb: '$1xl',
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: 'auto',
          gap: '$1xl',
        },
      }}
    >
      <Panel
        ghost
        css={{
          justifyContent: 'space-between',
        }}
      >
        <Flex column css={{ gap: '$sm' }}>
          <Text
            h1
            display
            css={{
              color: '$linkHover',
              borderBottom: '1px solid $linkHover',
              pb: '$xs',
              mb: '$md',
            }}
          >
            CoSoul
          </Text>
          <Text h2 display css={{ color: '$secondaryButtonText' }}>
            <Avatar
              size="large"
              name={cosoul_data.profileInfo.name}
              path={cosoul_data.profileInfo.avatar}
              margin="none"
              css={{ mr: '$sm' }}
            />
            {cosoul_data.profileInfo.name}
          </Text>
          <Text color="secondary">
            Coordinape member since {member_since_date}
          </Text>
        </Flex>
      </Panel>
    </Flex>
  );
};
