import { useRef, useEffect } from 'react';

import { Box, Canvas } from 'ui';

import initDisplay from './initdisplay.js';
import { genParamsObj } from './mainparams.js';

var glview = undefined;

export default function Display({
  params = {},
  resolution = [2000, 2000],
  lineWidth = 1,
  canvasStyles = {},
  animate = true,
  useGui = false,
}) {
  const canvasForegroundRef = useRef(null);
  const canvasBackgroundRef = useRef(null);
  const webglTest = useRef(null);

  // on init
  useEffect(() => {
    if (canvasForegroundRef.current && canvasBackgroundRef.current) {
      const webglEnabled = !!webglTest.current.getContext('webgl2');
      if (webglEnabled) {
        let paramObj = genParamsObj(params);
        glview = initDisplay(
          canvasForegroundRef.current,
          canvasBackgroundRef.current,
          resolution,
          paramObj,
          useGui,
          lineWidth
        );
      }
    }
    return () => {
      // important:
      glview.stop();
    };
  }, []);

  // on params
  useEffect(() => {
    if (glview) {
      let p = genParamsObj(params);
      glview.setParams(p, animate);
    }
  }, [params]);

  return (
    <Box
      css={{
        ...canvasStyles,
        background: 'black',
        position: 'relative',
      }}
    >
      <Canvas
        ref={webglTest}
        css={{
          position: 'absolute',
          zIndex: -1,
        }}
      />
      <Canvas
        ref={canvasForegroundRef}
        css={{
          ...canvasStyles,
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <Canvas
        ref={canvasBackgroundRef}
        css={{
          ...canvasStyles,
          position: 'absolute',
          zIndex: 0,
        }}
      />
    </Box>
  );
}
