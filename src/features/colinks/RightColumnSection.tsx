import { ReactNode } from 'react';

import { CSS } from '../../stitches.config';
import { Flex, Panel, Text } from '../../ui';

export const RightColumnSection = ({
  children,
  title,
  css,
}: {
  children: ReactNode;
  title?: ReactNode;
  css?: CSS;
}) => {
  return (
    <Panel css={{ ...css, border: 'none' }}>
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
