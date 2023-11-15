import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useIsCoLinksPage } from '../../features/colinks/useIsCoLinksPage';
import { ShowOrConnectGitHub } from '../../features/github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../../features/linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../../features/twitter/ShowOrConnectTwitter';
import { useToast } from '../../hooks';
import { EditEmailForm } from 'pages/ProfilePage/EmailSettings/EditEmailForm';
import { ContentHeader, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { EditProfileInfo } from './EditProfileInfo';

export default function AccountPage() {
  const { isCoLinksPage } = useIsCoLinksPage();

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
          <Panel>
            <Text large semibold>
              Profile
            </Text>
            <EditProfileInfo />
          </Panel>
        )}
        <Panel>
          <Text large semibold>
            Email Addresses
          </Text>
          <EditEmailForm />
        </Panel>
        <Flex css={{ gap: '$lg' }}>
          {isCoLinksPage && (
            <>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  Twitter
                </Text>
                <ShowOrConnectTwitter />
              </Panel>
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
            </>
          )}
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
}
