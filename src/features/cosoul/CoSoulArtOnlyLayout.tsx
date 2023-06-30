import { useRef, useEffect, useState } from 'react';

import { dark } from 'stitches.config';

import { Box, Canvas, Flex } from 'ui';

import { WebglMessage } from './art/WebglMessage';

const CoSoulLayout = ({ children }: { children: React.ReactNode }) => {
  const webglTest = useRef<HTMLCanvasElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    if (webglTest.current) {
      const webglEnabled = !!webglTest.current.getContext('webgl2');
      if (webglEnabled) {
        setWebglEnabled(true);
        webglTest.current.remove();
      } else {
        setWebglEnabled(false);
      }
    }
  }, []);
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
              canvas: {
                width: '100vh !important',
                height: '100vh !important',
              },
            }}
          >
            <Canvas
              ref={webglTest}
              css={{
                position: 'absolute',
                zIndex: -1,
              }}
            />
            <WebglMessage webglEnabled={webglEnabled} />
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CoSoulLayout;
