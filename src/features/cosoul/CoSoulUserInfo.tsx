import { Avatar, Flex, Panel, Text } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulUserInfo = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  return (
    <Panel
      ghost
      css={{
        justifyContent: 'space-between',
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
        mb: '$md',
        gap: '$3xl',
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: 'auto',
          gap: '$1xl',
        },
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        <Text h2 display>
          <Avatar
            size="large"
            name={cosoul_data.profileInfo.name}
            path={cosoul_data.profileInfo.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          {cosoul_data.profileInfo.name}
        </Text>
        <Text color="secondary">Member since 1999</Text>
      </Flex>
    </Panel>
  );
};
