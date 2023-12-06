import { CoLinksWizard } from '../../../features/colinks/wizard/CoLinksWizard';
import { Flex } from '../../../ui';

export const WizardPage = () => {
  return <WizardPageContents />;
};

const WizardPageContents = () => {
  return (
    <Flex css={{ flexGrow: 1, height: '100vh' }}>
      <CoLinksWizard />
    </Flex>
  );
};
