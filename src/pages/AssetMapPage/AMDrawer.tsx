import React, { useState, useMemo } from 'react';

import clsx from 'clsx';

import { makeStyles, Button } from '@material-ui/core';
import DnsIcon from '@material-ui/icons/Dns';
import SearchIcon from '@material-ui/icons/Search';
import SortIcon from '@material-ui/icons/Sort';

import { Drawer, ApeAutocomplete } from 'components';
import { SKILLS } from 'config/constants';
import {
  useMapMetric,
  useMapResults,
  useMapMeasures,
  useSetAmSearch,
  useTriggerMode,
} from 'recoilState';

import AMProfileCard from './AMProfileCard';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 3),
  },
  title: {
    fontWeight: 300,
    fontSize: 20,
    lineHeight: 1.3,
    margin: theme.spacing(2.5, 0, 2),
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: theme.spacing(2, 0, 4),
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
    scrollbarColor: `${theme.colors.secondary} #EAEFF0`,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      backgroundColor: '#EAEFF0',
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#EAEFF0',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.secondary,
    },
  },
}));

export const AMDrawer = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [showRank, setShowRank] = useState<boolean>(false);

  const setSearch = useSetAmSearch();
  const metric = useMapMetric();
  const rawProfiles = useMapResults();
  const { measures } = useMapMeasures(metric);
  const showHiddenFeatures = useTriggerMode();

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

  const handleSetOpen = (value: boolean) => {
    if (!value) {
      setSearch('');
    }
    setOpen(value);
  };

  const onRankToggle = () => {
    setShowRank(!showRank);
  };

  return (
    <Drawer open={open} setOpen={handleSetOpen} Icon={<DnsIcon />} anchorRight>
      <div className={classes.header}>
        <h5 className={classes.title}>Active Users</h5>
        <div className={classes.controls}>
          {showHiddenFeatures && (
            <Button
              onClick={onRankToggle}
              variant="contained"
              color="primary"
              size="small"
              className={clsx(classes.rank, { [classes.rankOff]: !showRank })}
            >
              <SortIcon />
            </Button>
          )}
          <ApeAutocomplete
            onChange={setSearch}
            freeSolo
            options={SKILLS}
            color="secondary"
            placeholder="Search by Keyword"
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </div>
      </div>
      <div className={classes.users}>
        {profiles.map(profile => (
          <AMProfileCard
            key={profile.id}
            profile={profile}
            summarize={showRank}
          />
        ))}
      </div>
    </Drawer>
  );
};

export default AMDrawer;
