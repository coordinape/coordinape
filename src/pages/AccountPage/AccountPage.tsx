import { EditEmailForm } from 'pages/ProfilePage/EmailSettings/EditEmailForm';
import { ContentHeader, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export default function AccountPage() {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Account Settings</Text>
        </Flex>
      </ContentHeader>
      <EditEmailForm />
    </SingleColumnLayout>
  );
}
