import { SoulKeyWizard } from 'features/soulkeys/SoulKeyWizard';

import isFeatureEnabled from 'config/features';
import { Flex } from 'ui';

export const SoulKeysWizardPage = () => {
  return <SoulKeysWizardPageContents />;
};

const SoulKeysWizardPageContents = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <Flex css={{ flexGrow: 1, height: '100vh' }}>
      <SoulKeyWizard />
    </Flex>
  );
};
