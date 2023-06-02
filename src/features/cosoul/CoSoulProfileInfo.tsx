import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Avatar, Button, Flex, Panel, Text } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulProfileInfo = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  const address = useConnectedAddress();
  const created_at_date = DateTime.fromISO(
    cosoul_data.profileInfo.created_at
  ).toFormat('LLL yyyy');

  return (
    <Flex
      column
      css={{
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
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
          mb: '$md',
          gap: '$3xl',
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
            Coordinape member since {created_at_date}
          </Text>
        </Flex>
      </Panel>
      {!address && (
        <Panel css={{ mt: '$lg', gap: '$md', borderColor: '$cta' }}>
          <Text p as="p" color="secondary">
            CoSoul is your avatar in the Coordinape universe. It&apos;s a
            free-to-mint SoulBound NFT that grants you access and reputation
            into untold web3 worlds!
          </Text>
          <Button color="cta" as={NavLink} to={paths.cosoul}>
            Mint Your Own CoSoul
          </Button>
        </Panel>
      )}
    </Flex>
  );
};
