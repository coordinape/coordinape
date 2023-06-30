import { useRef, useEffect, useState } from 'react';

import { dark } from 'stitches.config';

import { Box, Canvas, Flex } from 'ui';

import { WebglMessage } from './art/WebglMessage';

const CoSoulLayout = ({ children }: { children: React.ReactNode }) => {
  const webglTest = useRef<HTMLCanvasElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    const canvas = webglTest.current;
    const checkWebglEnabled = () => {
      if (canvas) {
        const webglEnabled = !!canvas.getContext('webgl2');
        setWebglEnabled(webglEnabled);
      }
    };
    checkWebglEnabled();
  }, []);
  return (
    <>
      <Canvas
        ref={webglTest}
        css={{
          position: 'absolute',
          zIndex: -1,
          left: -5000,
        }}
      />
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
              <WebglMessage webglEnabled={webglEnabled} />
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default CoSoulLayout;
