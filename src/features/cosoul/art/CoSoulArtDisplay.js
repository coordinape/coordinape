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
  webglEnabled = true,
}) {
  const canvasForegroundRef = useRef(null);
  const canvasBackgroundRef = useRef(null);

  // on init
  useEffect(() => {
    if (canvasForegroundRef.current && canvasBackgroundRef.current) {
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
        if (glview) {
          // eslint-disable-next-line no-console
          console.log('glview:', glview);
          // eslint-disable-next-line no-console
          console.log('gl compiled', glview.gl.compiled);
        }
        if (glview.gl.compiled) {
          const message = document.getElementById('aggressionMessage');
          if (message) {
            message.remove();
          }
        }
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
