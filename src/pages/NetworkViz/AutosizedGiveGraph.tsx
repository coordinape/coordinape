import { useDebounce, useElementSize } from 'usehooks-ts';

import { ThemeContext } from '../../features/theming/ThemeProvider';
import { Box } from '../../ui';

import { GiveGraph } from './GiveGraph';

export const AutosizedGiveGraph = ({
  mapHeight,
  expand,
  targetAddress,
  skill,
}: {
  mapHeight: number;
  expand: boolean;
  skill?: string;
  targetAddress?: string;
}) => {
  const [setRef, size] = useElementSize();

  const debouncedSize = useDebounce(size);

  return (
    <ThemeContext.Consumer>
      {({ stitchesTheme }) => (
        <Box
          ref={setRef}
          css={{
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            height: mapHeight,
          }}
        >
          <Box
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: debouncedSize.width,
              height: mapHeight,
            }}
          >
            <GiveGraph
              address={targetAddress}
              skill={skill}
              height={mapHeight}
              width={debouncedSize.width}
              expand={expand}
              stitchesTheme={stitchesTheme}
              zoom={false}
              compact={true}
            />
          </Box>
        </Box>
      )}
    </ThemeContext.Consumer>
  );
};
