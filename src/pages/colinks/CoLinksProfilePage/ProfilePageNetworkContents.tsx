import { colinksProfileColumnWidth } from 'features/cosoul/constants';
import { useParams } from 'react-router-dom';

import { ProfileNetwork } from 'pages/GiveParty/ProfileNetwork';
import { Box, Flex } from 'ui';

export const ProfilePageNetworkContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <Flex column>
      derp
      <Flex
        css={{
          maxWidth: colinksProfileColumnWidth,
          width: '100%',
          margin: 'auto',
        }}
      >
        <ProfileNetwork targetAddress={targetAddress} />
      </Flex>
    </Flex>
  );
};
