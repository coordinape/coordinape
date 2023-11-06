import { isFeatureEnabled } from '../../config/features';
import { ShowOrConnectGitHub } from '../../features/github/ShowOrConnectGitHub';
import { ShowOrConnectTwitter } from '../../features/twitter/ShowOrConnectTwitter';
import { EditEmailForm } from 'pages/ProfilePage/EmailSettings/EditEmailForm';
import { ContentHeader, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export default function AccountPage() {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Account Settings</Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ maxWidth: '$readable', gap: '$lg' }}>
        <Panel>
          <Text large semibold>
            Email Addresses
          </Text>
          <EditEmailForm />
        </Panel>
        <Flex css={{ gap: '$lg' }}>
          {isFeatureEnabled('twitter') && (
            <Panel css={{ maxWidth: '$readable', flex: 1 }}>
              <Text large semibold css={{ mb: '$lg' }}>
                Twitter
              </Text>
              <ShowOrConnectTwitter />
            </Panel>
          )}
          {isFeatureEnabled('github') && (
            <Panel css={{ maxWidth: '$readable', flex: 1 }}>
              <Text large semibold css={{ mb: '$lg' }}>
                GitHub
              </Text>
              <ShowOrConnectGitHub />
            </Panel>
          )}
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
}
