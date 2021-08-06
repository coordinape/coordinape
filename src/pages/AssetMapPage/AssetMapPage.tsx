import React, { useEffect, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { useAmEpochs, useStateAmEpochId, useStateAmSearch } from 'recoilState';

import AMDrawer from './AMDrawer';
import AMForceGraph from './AMForceGraph';
import RedSearch from './RedSearch';
import RedSelect from './RedSelect';

const useStyles = makeStyles((theme) => ({
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
    justifyContent: 'flex-start',
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

export const AssetMapPage = () => {
  const classes = useStyles();

  const amEpochs = useAmEpochs();
  const [amEpochId, setAmEpochId] = useStateAmEpochId();
  const [search, setSearch] = useStateAmSearch();

  // This is the AssetMapPage Controller
  useEffect(() => {
    if (amEpochs.length === 0) {
      return;
    }
    setAmEpochId(amEpochs[amEpochs.length - 1]?.id);
    // TODO: Load gifts for selected epoch
  }, [amEpochs]);

  const epochOptions = useMemo(() => {
    return amEpochs.length > 0
      ? [
          {
            label: 'ALL',
            value: -1,
          },
        ].concat(
          amEpochs.map((e) => ({
            label: e.labelGraph,
            value: e.id,
          }))
        )
      : [];
  }, [amEpochs]);

  if (!epochOptions || amEpochId === undefined) {
    // TODO: Improve this.
    return <div className={classes.root}>Loading</div>;
  }

  return (
    <div className={classes.root}>
      <AMDrawer />
      <AMForceGraph />
      <div className={classes.controls}>
        <RedSearch onChange={(v) => setSearch(v)} />
        <RedSelect
          value={amEpochId}
          options={epochOptions}
          onChange={setAmEpochId}
        />
      </div>
    </div>
  );
};

export default AssetMapPage;
