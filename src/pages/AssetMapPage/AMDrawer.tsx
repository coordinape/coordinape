import { useState, useMemo, useEffect } from 'react';

import clsx from 'clsx';

import { makeStyles, Button as MUButton } from '@material-ui/core';

import { Drawer, ApeAutocomplete } from 'components';
import { SKILLS } from 'config/constants';
import { Filter, Search, Collapse } from 'icons/__generated';
import { useSelectedCircle } from 'recoilState/app';
import {
  useMapMetric,
  useMapResults,
  useMapMeasures,
  useSetAmSearch,
  useStateAmMetric,
  useStateAmEpochId,
  useMapEpochs,
} from 'recoilState/map';
import { useDevMode } from 'recoilState/ui';
import { IconButton, Text, Panel, Select } from 'ui';

import AMProfileCard from './AMProfileCard';

import { MetricEnum } from 'types';

interface MetricOption {
  label: string;
  value: MetricEnum;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    border: 1,
  },
  title: {
    fontWeight: 300,
    fontSize: 20,
    lineHeight: 1.3,
    margin: theme.spacing(2.5, 0, 0),
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.surface,
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(1, 2),
    marginBottom: 16,
  },
  filterHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15 - 8,
    color: theme.colors.secondaryText,
  },
  rank: {
    minWidth: 47,
    padding: 0,
    marginRight: theme.spacing(3),
  },
  rankOff: {
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    '&:hover': {
      backgroundColor: theme.colors.white,
      background: theme.colors.white,
      color: theme.colors.black,
    },
  },
  // Users
  users: {
    flexGrow: 1,
    width: '100%',
    overflowY: 'scroll',
    padding: theme.spacing(2, 0),
    scrollbarColor: theme.colors.secondaryText,
    scrollbarWidth: 'thin',
    backgroundColor: theme.colors.surface,
    '&::-webkit-scrollbar': {
      backgroundColor: theme.colors.surface,
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.colors.surface,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.borderMedium,
    },
    borderRadius: 8,
  },
  toggleButton: {
    width: 50,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),
  },
}));

export const AMDrawer = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [showRank, setShowRank] = useState<boolean>(false);

  const { circle } = useSelectedCircle();
  const setSearch = useSetAmSearch();
  const metric = useMapMetric();
  const rawProfiles = useMapResults();
  const { measures } = useMapMeasures(metric);
  const showHiddenFeatures = useDevMode();
  const [metric2, setMetric2] = useStateAmMetric();
  const amEpochs = useMapEpochs();
  const [amEpochId, setAmEpochId] = useStateAmEpochId();

  // This is the AssetMapPage Controller
  useEffect(() => {
    if (amEpochs.length === 0) {
      return;
    }
    setAmEpochId(amEpochs[amEpochs.length - 1]?.id);
  }, [amEpochs]);

  const epochOptions = useMemo(() => {
    return amEpochs.length > 0
      ? [
          {
            label: 'ALL',
            value: -1,
          },
        ].concat(
          amEpochs.map(e => ({
            label: e.labelGraph,
            value: e.id,
          }))
        )
      : [];
  }, [amEpochs]);

  const profiles = useMemo(
    () =>
      [...rawProfiles].sort((pa, pb) =>
        showRank
          ? (measures.get(pb.address) ?? 0) - (measures.get(pa.address) ?? 0)
          : pa.users[0]?.name < pb.users[0]?.name
          ? -1
          : 1
      ),
    [rawProfiles, measures, showRank]
  );

  const metricOptions = [
    {
      label: `Number of ${circle.tokenName} received`,
      value: 'give',
    },
    {
      label: 'In Degree (# incoming links)',
      value: 'in_degree',
    },
    {
      label: 'Out Degree (# outgoing links)',
      value: 'out_degree',
    },
    {
      label: `Degree Standardization (${circle.tokenName} * #outDeg / #maxOutDeg)`,
      value: 'standardized',
    },
  ] as MetricOption[];

  const handleSetOpen = (value: boolean) => {
    if (!value) {
      setSearch('');
    }
    setOpen(value);
  };

  const onRankToggle = () => {
    setShowRank(!showRank);
  };

  if (!epochOptions || amEpochId === undefined) {
    return <div className={classes.root}></div>;
  }

  return (
    <>
      <Drawer open={open} setOpen={handleSetOpen}>
        <div className={classes.controls}>
          <div className={classes.filterHeader}>
            <Text
              css={{
                fontWeight: '$bold',
                fontSize: '$large',
                lineHeight: '$short',
                color: '$headingText',
              }}
            >
              Filters
            </Text>
            <IconButton onClick={() => setOpen(!open)}>
              <Collapse size="lg" />
            </IconButton>
          </div>
          {showHiddenFeatures && (
            <MUButton
              onClick={onRankToggle}
              variant="contained"
              color="primary"
              size="small"
              className={clsx(classes.rank, { [classes.rankOff]: !showRank })}
            >
              <Filter size="lg" />
            </MUButton>
          )}
          <Panel invertForm css={{ px: 0, gap: '$md' }}>
            <Select
              defaultValue={String(amEpochId)}
              options={epochOptions}
              onValueChange={value => setAmEpochId(Number(value))}
            />
            {showHiddenFeatures && (
              <Select
                defaultValue={metric2}
                options={metricOptions}
                onValueChange={value => setMetric2(value as MetricEnum)}
              />
            )}
          </Panel>
          <ApeAutocomplete
            onChange={setSearch}
            freeSolo
            options={SKILLS}
            color="secondary"
            placeholder="Search"
            isSelect
            InputProps={{
              endAdornment: <Search color="neutral" />,
            }}
          />
        </div>
        <div className={classes.users}>
          {profiles.map(profile => (
            <AMProfileCard
              key={profile.id}
              profile={profile}
              summarize={showRank}
              circle={circle}
            />
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default AMDrawer;
