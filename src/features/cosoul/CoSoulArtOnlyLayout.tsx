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
              position: 'relative',
              canvas: {
                width: '100vh !important',
                height: '100vh !important',
              },
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
