import { isAddress } from 'ethers/lib/utils';
import { colinksProfileColumnWidth } from 'features/cosoul/constants';
import { useParams } from 'react-router-dom';

import { NotFound } from '../NotFound';
import { ProfileNetwork } from 'pages/GiveParty/ProfileNetwork';
import { Box, Flex } from 'ui';

import { ProfileCards } from './ProfileCards';

export const ProfilePageNetworkContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  if (!isAddress(targetAddress) && !targetAddress.endsWith('.eth')) {
    return <NotFound />;
  }

  return <PageContents targetAddress={targetAddress} />;
};

export const PageContents = ({ targetAddress }: { targetAddress: string }) => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <Flex
      css={{
        alignItems: 'flex-start',
        gap: '$md',
        '@sm': {
          flexDirection: 'column ',
        },
      }}
    >
      <Flex
        css={{
          minWidth: colinksProfileColumnWidth,
          width: colinksProfileColumnWidth,
          margin: '0 auto',
        }}
      >
        <ProfileNetwork targetAddress={targetAddress} />
      </Flex>
      <ProfileCards targetAddress={targetAddress} />
    </Flex>
  );
};
