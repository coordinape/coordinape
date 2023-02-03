import React from 'react';

import { styled } from '../stitches.config';
import { Flex, Panel, Text } from '../ui';

const HintBanner = ({
  title,
  type = 'info',
  children,
}: {
  title: string;
  type?: 'info' | 'alert';
  children: React.ReactNode;
}) => {
  return (
    <Panel {...{ [type]: true }} css={{ mb: '$lg' }}>
      <Flex
        column
        css={{
          gap: '$md',
          width: '100%',
          maxWidth: '40em',
          alignItems: 'flex-start',
        }}
      >
        <Text h2>{title}</Text>
        {children}
      </Flex>
    </Panel>
  );
};

export default styled(HintBanner);
