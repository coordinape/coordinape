import { Flex } from '../../../ui';

import { CoSoulWizard } from './CoSoulWizard';

export const CoSoulPage = () => {
  return <CoSoulPageContents />;
};

const CoSoulPageContents = () => {
  return (
    <Flex css={{ flexGrow: 1, height: '100vh' }}>
      <CoSoulWizard />
    </Flex>
  );
};
