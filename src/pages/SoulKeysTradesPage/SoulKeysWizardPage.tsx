import { SoulKeyWizard } from 'features/soulkeys/SoulKeyWizard';

import isFeatureEnabled from 'config/features';
import { ContentHeader, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const SoulKeysWizardPage = () => {
  return <SoulKeysWizardPageContents />;
};

const SoulKeysWizardPageContents = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <SingleColumnLayout css={{ flexGrow: 1 }}>
      <Flex css={{ gap: '$lg' }}>
        <Flex css={{ flex: 2 }} column>
          <ContentHeader>
            <Flex
              column
              css={{
                gap: '$md',
                flexGrow: 1,
                alignItems: 'flex-start',
              }}
            >
              <Text h2 display>
                Get started wizard
              </Text>
            </Flex>
          </ContentHeader>
          <Flex>
            <SoulKeyWizard />
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
