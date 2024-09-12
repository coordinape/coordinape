import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useIsCoLinksSite } from '../../features/colinks/useIsCoLinksSite';
import { ShowOrConnectFarcaster } from '../../features/farcaster/ShowOrConnectFarcaster';
import { ShowOrConnectGitHub } from '../../features/github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../../features/linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../../features/twitter/ShowOrConnectTwitter';
import { useToast } from '../../hooks';
import { EditEmailForm } from 'pages/ProfilePage/EmailSettings/EditEmailForm';
import { ContentHeader, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { EditProfileInfo } from './EditProfileInfo';
import { SkillAndTopicPicker } from './SkillAndTopicPicker';

export default function AccountPage() {
  const isCoLinksPage = useIsCoLinksSite();

  const [searchParams, setSearchParams] = useSearchParams();

  const error = searchParams.get('error');

  const { showError } = useToast();

  // Show the error and remove it from the URL
  // this error comes from the twitter/github/linkedin callbacks
  useEffect(() => {
    if (error) {
      showError(error);
      setSearchParams('');
    }
  }, [error]);
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Account Settings</Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ maxWidth: '$readable', gap: '$lg' }}>
        {isCoLinksPage && (
          <>
            <Panel css={{ gap: '$md' }}>
              <Text large semibold>
                Profile
              </Text>
              <EditProfileInfo />
            </Panel>
            <SkillAndTopicPicker />
          </>
        )}
        <Panel>
          <Text large semibold>
            Email Addresses
          </Text>
          <EditEmailForm />
        </Panel>

        {isCoLinksPage && (
          <>
            <Flex
              css={{
                gap: '$lg',
                '@sm': {
                  flexDirection: 'column',
                },
              }}
            >
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  Farcaster
                </Text>
                <ShowOrConnectFarcaster />
              </Panel>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  Twitter
                </Text>
                <ShowOrConnectTwitter />
              </Panel>
            </Flex>
            <Flex
              css={{
                gap: '$lg',
                '@sm': {
                  flexDirection: 'column',
                },
              }}
            >
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  GitHub
                </Text>
                <ShowOrConnectGitHub />
              </Panel>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  LinkedIn
                </Text>
                <ShowOrConnectLinkedIn />
              </Panel>
            </Flex>
          </>
        )}
      </Flex>
    </SingleColumnLayout>
  );
}
