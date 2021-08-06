import React, { useState, useMemo } from 'react';

import clsx from 'clsx';
import reactStringReplace from 'react-string-replace';

import {
  makeStyles,
  Typography,
  Divider,
  Select,
  MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

// import SearchIcon from '@material-ui/icons/Search';
import { Spacer, ApeAvatar, Drawer } from 'components';
import {
  useSelectedCircle,
  useStateAmSearch,
  useAmSearchRegex,
  useStateAmMetric,
  useStateAmEgoAddress,
  useAmResults,
  useAmMeasures,
  useAmEgo,
} from 'recoilState';
import { assertDef } from 'utils/tools';

import { IFilledProfile, MetricEnum } from 'types';

interface MetricOption {
  label: string;
  value: MetricEnum;
}

const metricOptions = [
  {
    label: '# of tokens received',
    value: 'give',
  },
  {
    label: 'received from most people',
    value: 'in_degree',
  },
  {
    label: 'gave to most people',
    value: 'out_degree',
  },
  {
    label: 'Normalization = GIVE * #out / #maxOut',
    value: 'standardized',
  },
] as MetricOption[];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  searchBar: {},
  colorBlack: {
    color: theme.colors.black,
  },
  listbox: {
    overflowX: 'hidden',
  },
  backgroundColorWhite: {
    backgroundColor: theme.colors.white,
  },
  rankHeader: {},
  sortTitle: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.3,
    margin: theme.spacing(4, 0, 2),
  },
  results: {
    flexGrow: 1,
    overflowY: 'auto',
    scrollbarColor: `${theme.colors.secondary} #EAEFF0`,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      backgroundColor: '#EAEFF0',
      width: 3,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#EAEFF0',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.secondary,
    },
  },
  userResult: {
    padding: theme.spacing(0, 1.25, 0, 3),
    width: theme.custom.appDrawerWidth - 15,
    overflowX: 'hidden',
  },
  userResultBody: {
    display: 'flex',
    '& img': {
      marginRight: theme.spacing(0.75),
    },
    '& p': {
      width: '100%',
    },
  },
  userResultHeader: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    margin: theme.spacing(1.5, 0, 1.3),
  },
  userResultName: {
    color: theme.colors.red,
  },
  userResultOpt: {
    fontSize: '10px',
  },
  avatar: {
    cursor: 'pointer',
    margin: theme.spacing(0, 0.5, 2, 0),
    width: 35,
    height: 35,
  },
  selectedAvatar: {
    border: `2px solid ${theme.colors.black}`,
  },
  userResultDescription: {
    flexGrow: 1,
  },
  selectRoot: {
    backgroundColor: 'white',
  },
}));

const AMDrawer = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);

  const circle = assertDef(useSelectedCircle(), 'Missing selected circle');
  const [search, setSearch] = useStateAmSearch();
  const searchRegex = useAmSearchRegex();
  const [metric, setMetric] = useStateAmMetric();
  const [egoAddress, setEgoAddress] = useStateAmEgoAddress();
  const rawProfiles = useAmResults();
  const [profile, user] = useAmEgo();
  const { min, max, measures } = useAmMeasures(metric);

  const profiles = useMemo(
    () =>
      [...rawProfiles].sort(
        (pa, pb) =>
          (measures.get(pb.address) ?? 0) - (measures.get(pa.address) ?? 0)
      ),
    [rawProfiles, measures]
  );

  const handleSetOpen = (value: boolean) => {
    if (!value) {
      setSearch('');
    }
    setOpen(value);
  };

  const onClickProfile = (profile: IFilledProfile) => {
    if (egoAddress === profile.address) {
      setEgoAddress('');
    } else {
      setEgoAddress(profile.address);
    }
  };

  const renderProfile = (profile: IFilledProfile) => {
    const user = assertDef(
      profile.users.find((u) => u.circle_id === circle.id),
      `No user matching ${circle.id}`
    );

    return (
      <div key={profile.id} className={classes.userResult}>
        <div
          className={classes.userResultHeader}
          onClick={() => onClickProfile(profile)}
        >
          {String(measures.get(profile.address) ?? 0)}
          <Typography variant="body1" className={classes.userResultName}>
            {reactStringReplace(user.name, searchRegex, (match, i) =>
              i === 1 ? <strong key={match}>{match}</strong> : null
            )}
          </Typography>
          {user.non_receiver ? (
            <Typography variant="body1" className={classes.userResultOpt}>
              Opt Out
            </Typography>
          ) : (
            <span />
          )}
        </div>
        <div className={classes.userResultBody}>
          <ApeAvatar
            user={user}
            className={clsx(classes.avatar, {
              [classes.selectedAvatar]: egoAddress === profile.address,
            })}
            onClick={() => onClickProfile(profile)}
          />
          <Typography variant="body2" className={classes.userResultDescription}>
            {reactStringReplace(profile.bio, searchRegex, (match, i) =>
              i === 1 ? <strong key={match}>{match}</strong> : null
            )}
          </Typography>
        </div>
        <Divider variant="middle" />
      </div>
    );
  };

  return (
    <Drawer
      open={open}
      setOpen={handleSetOpen}
      Icon={<SearchIcon />}
      anchorRight
    >
      <Spacer h={42} />
      <div className={classes.rankHeader}>
        <h5 className={classes.sortTitle}>Sort By</h5>
        <Select
          variant="outlined"
          onChange={({ target: { value } }) => setMetric(value as MetricEnum)}
          value={metric}
          classes={{
            root: classes.selectRoot,
          }}
        >
          {Object.values(metricOptions).map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.results}>{profiles.map(renderProfile)}</div>
    </Drawer>
  );
};

export default AMDrawer;
