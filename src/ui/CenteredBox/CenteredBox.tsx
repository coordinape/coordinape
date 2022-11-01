import React from 'react';

import { Flex } from '../../ui/Flex';
import { Panel } from '../Panel/Panel';

const CenteredBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      alignItems="center"
      css={{
        justifyContent: 'center',
        mt: '$4xl',
      }}
    >
      <Panel
        css={{
          width: '50%',
          textAlign: 'center',
          padding: '$xl',
          '@sm': { width: '90%' },
        }}
      >
        {children}
      </Panel>
    </Flex>
  );
};

export default CenteredBox;
