import { useState } from 'react';

import { client } from 'lib/gql/client';
import { useLocation } from 'react-router-dom';

import { Box, Button, CenteredBox, Flex, Text } from 'ui';

type LinkStatus = 'loading' | 'detached' | 'linking' | 'linked';

export const DiscordPage = () => {
  const { search } = useLocation();
  const parameters = new URLSearchParams(search);

  const [linkStatus, setLinkStatus] = useState<LinkStatus>('detached');

  // TODO Get link status of the user before attempt to link

  const handleLinkDiscordUser = async () => {
    try {
      setLinkStatus('linking');
      const code = parameters.get('code');
      if (!code) {
        throw new Error('Discord code is required');
      }

      const response = await fetch(
        '/api/discord/oauth?' + new URLSearchParams({ code })
      );
      const discordUser = await response.json();
      await linkDiscordUser({ discord_id: discordUser.id });

      setLinkStatus('linked');
    } catch (error) {
      setLinkStatus('detached');
      console.error('handleLinkDiscordUser', error);
    }
  };

  return (
    <CenteredBox>
      <Text h1 css={{ justifyContent: 'center' }}>
        Link Coordinape &harr; Discord
      </Text>
      <Box css={{ pt: '$md', color: '$text' }}>
        {`Clicking the button below will link coordinape to discord`}
      </Box>
      <Flex css={{ justifyContent: 'center', mt: '$md' }}>
        <Button
          size="large"
          color="primary"
          disabled={linkStatus !== 'detached'}
          onClick={handleLinkDiscordUser}
        >
          {getLinkStatusLabel(linkStatus)}
        </Button>
      </Flex>
    </CenteredBox>
  );
};

const linkDiscordUser = async (payload: {
  discord_id: string;
}): Promise<void> => {
  await client.mutate(
    { linkDiscordUser: [{ payload }, { id: true }] },
    { operationName: 'linkDiscordUser' }
  );
};

const getLinkStatusLabel = (linkStatus: LinkStatus): string => {
  if (linkStatus === 'linking') {
    return 'Linking';
  }

  if (linkStatus === 'linked') {
    return 'Linked';
  }

  return 'Link';
};

export default DiscordPage;
