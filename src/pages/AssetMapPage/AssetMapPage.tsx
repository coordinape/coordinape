import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { makeStyles } from '@material-ui/core';

import { useSetAmEgoAddress } from 'recoilState/map';
import { rDevMode } from 'recoilState/ui';
import { MAP_HIGHLIGHT_PARAM } from 'routes/paths';

import { AMDrawer } from './AMDrawer';
import { AMForceGraph } from './AMForceGraph';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  controls: {
    padding: theme.spacing(2, 4),
    position: 'absolute',
    top: 0,
    left: 0,
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
      <AMForceGraph />
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.setDevMode = setDevMode;
  }, [setDevMode]);

  return <></>;
};

export default AssetMapPage;
