import {useRef, useEffect} from 'react';
import { Box, Canvas } from 'ui';
import {genParamsObj} from './mainparams.js';
import initDisplay from './initdisplay.js';

var glview = undefined;
const animate = true; // <keep this locked to true for now.
const useGui = false;

export default function Display({params={}, resolution=[600,600], lineWidth=1, canvasStyles={}}){

  const canvasForegroundRef = useRef(null);
  const canvasBackgroundRef = useRef(null);

	// on init
	useEffect(()=>{
		if(canvasForegroundRef.current && canvasBackgroundRef .current){
			let paramObj = genParamsObj(params);
			glview = initDisplay(
        canvasForegroundRef.current, 
        canvasBackgroundRef .current, 
        resolution, 
        paramObj,
        useGui,
        lineWidth);
		}
		return ()=>{
			// important:
			glview.stop();
		}
	},[]);

	// on params
	useEffect(()=>{
		if(glview){
			let p = genParamsObj(params);
			glview.setParams(p, animate);
		}
	},[params]);


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