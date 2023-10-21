import { ReactNode } from 'react';

import { Flex, Panel, Text } from '../../ui';

export const RightColumnSection = ({
  children,
  title,
}: {
  children: ReactNode;
  title: ReactNode;
}) => {
  return (
    <Panel>
      <Flex column css={{ gap: '$md' }}>
        <Text
          // tag
          // color="neutral"
          semibold
          size="medium"
          css={{
            justifyContent: 'flex-start',
            // py: '$md',
            // px: '$md',
          }}
        >
          {title}
        </Text>
        <Flex>{children}</Flex>
      </Flex>
    </Panel>
  );
};
