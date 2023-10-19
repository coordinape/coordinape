import { isFeatureEnabled } from '../../config/features';
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
      <Panel css={{ maxWidth: '$readable' }}>
        <Text large semibold>
          Email Addresses
        </Text>
        <EditEmailForm />
      </Panel>
      {isFeatureEnabled('twitter') && (
        <Panel css={{ maxWidth: '$readable', mt: '$xl' }}>
          <Text large semibold css={{ mb: '$lg' }}>
            Twitter
          </Text>
          <ShowOrConnectTwitter />
        </Panel>
      )}
    </SingleColumnLayout>
  );
}
