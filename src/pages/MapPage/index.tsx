import { useEffect, useState } from 'react';

import { AMDrawer } from 'features/map/AMDrawer';
import { AMForceGraph } from 'features/map/AMForceGraph';
import { useFetchCircle } from 'features/map/queries';
import { rMapEgoAddress } from 'features/map/state';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

import { Box } from '../../ui';
import { rDevMode } from 'recoilState';
import { useCircleIdParam } from 'routes/hooks';

import { IApiCircle } from 'types';

const MAP_HIGHLIGHT_PARAM = 'highlight';

export default function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setAmEgoAddress = useSetRecoilState(rMapEgoAddress);
  const fetchCircle = useFetchCircle();
  const circleId = useCircleIdParam();
  const [showPending, setShowPending] = useState(false);
  const [circle, setCircle] = useState<IApiCircle>();

  useEffect(() => {
    (async () => {
      const { circle: c } = await fetchCircle({ circleId, select: true });
      setCircle(c);
      setShowPending(c.show_pending_gives);
    })();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newAddress = queryParams.get(MAP_HIGHLIGHT_PARAM);
    if (newAddress) {
      setAmEgoAddress(newAddress);
      queryParams.delete(MAP_HIGHLIGHT_PARAM);
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [location]);

  if (!circle) return null;

  return (
    <Box css={{ position: 'relative', height: '100vh' }}>
      <AMDrawer circleId={circle.id} showPending={showPending} />
      <ThemeContext.Consumer>
        {({ stitchesTheme }) => <AMForceGraph stitchesTheme={stitchesTheme} />}
      </ThemeContext.Consumer>
      <DevModeInjector />
    </Box>
  );
}

const DevModeInjector = () => {
  const setDevMode = useRecoilCallback(({ set }) => async (active: boolean) => {
    set(rDevMode, active);
  });

  useEffect(() => {
    // Setup dev tool: trigger DevMode
    // this is safe to access window because useEffect is only run on client side
    (window as any).setDevMode = setDevMode;
  }, [setDevMode]);

  return <></>;
};
