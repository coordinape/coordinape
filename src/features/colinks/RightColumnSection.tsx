import { ReactNode } from 'react';

import { Flex, Panel, Text } from '../../ui';

export const RightColumnSection = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: ReactNode;
}) => {
  return (
    <Panel css={{ border: 'none' }}>
      <Flex column css={{ gap: '$md' }}>
        {title && (
          <Text
            // tag
            // color="neutral"
            semibold
            size="medium"
            css={{
              justifyContent: 'flex-start',
              ':first-child': { alignItems: 'center', gap: '$sm' },
            }}
          >
            {title}
          </Text>
        )}
        <Flex>{children}</Flex>
      </Flex>
    </Panel>
  );
};
