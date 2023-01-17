import { useEffect } from 'react';

import { ThemeContext } from 'features/theming/ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { makeStyles } from '@material-ui/core';

import { rDevMode } from 'recoilState';
import { useSetAmEgoAddress } from 'recoilState/map';

import { AMDrawer } from './AMDrawer';
import { AMForceGraph } from './AMForceGraph';

const MAP_HIGHLIGHT_PARAM = 'highlight';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  controls: {
    padding: theme.spacing(2, 4),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    '& > *': {
      marginRight: theme.spacing(4),
    },
  },
}));

export const AssetMapPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const setAmEgoAddress = useSetAmEgoAddress();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newAddress = queryParams.get(MAP_HIGHLIGHT_PARAM);
    if (newAddress) {
      setAmEgoAddress(newAddress);
      queryParams.delete(MAP_HIGHLIGHT_PARAM);
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <AMDrawer />
      <ThemeContext.Consumer>
        {({ stitchesTheme }) => <AMForceGraph stitchesTheme={stitchesTheme} />}
      </ThemeContext.Consumer>
      <DevModeInjector />
    </div>
  );
};

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

export default AssetMapPage;
