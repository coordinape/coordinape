import { dark } from 'stitches.config';

import { Box, Flex } from 'ui';

const CoSoulLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      className={dark}
      css={{
        background: '$background',
      }}
    >
      <Flex css={{ height: 'auto' }}>
        <Box css={{ width: '100%' }}>
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CoSoulLayout;
