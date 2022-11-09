import { useState } from 'react';

import { client } from 'lib/gql/client';
import { useParams } from 'react-router-dom';

import { useMyProfile } from 'recoilState';
import { Box, Button, CenteredBox, Flex, Text } from 'ui';

export const DiscordPage = () => {
  const snowflake = useParams().snowflake ?? '-1';
  const [isLinking, setIsLinking] = useState(false);
  const { id } = useMyProfile();

  const handleLinkDiscordUser = async () => {
    try {
      setIsLinking(true);
      await linkDiscordUser({ discord_id: snowflake });
      setIsLinking(false);
    } catch (error) {
      setIsLinking(false);
      console.error('handleLinkDiscordUser', error);
    }
  };

  return (
    <CenteredBox>
      <Text h1 css={{ justifyContent: 'center' }}>
        Link Coordinape &harr; Discord
      </Text>
      <Box css={{ pt: '$md', color: '$text' }}>
        {`Clicking the button below will link your profileId ${id} with your Discord's snowflake ${snowflake}`}
      </Box>
      <Flex css={{ justifyContent: 'center', mt: '$md' }}>
        <Button
          size="large"
          color="primary"
          disabled={isLinking}
          onClick={handleLinkDiscordUser}
        >
          {isLinking ? 'Linking...' : 'Link'}
        </Button>
      </Flex>
    </CenteredBox>
  );
};

const linkDiscordUser = (payload: { discord_id: string }) =>
  client.mutate(
    { linkDiscordUser: [{ payload }, { id: true }] },
    { operationName: 'linkDiscordUser' }
  );

export default DiscordPage;
