import React, { useState, useEffect } from 'react';

import reactStringReplace from 'react-string-replace';

import {
  makeStyles,
  Typography,
  TextField,
  MenuItem,
  Select,
  Box,
  Divider,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';

import { Drawer, Spacer, Img } from 'components';
import { FilterIcon } from 'icons';
import useCommonStyles from 'styles/common';
import { getAvatarPath } from 'utils/domain';
import { getNotableWords } from 'utils/string';

import { IGraphNode } from 'types';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing(0.75),
  },
  colorBlack: {
    color: theme.colors.black,
  },
  listbox: {
    overflowX: 'hidden',
  },
  backgroundColorWhite: {
    backgroundColor: theme.colors.white,
  },
  epochSelect: {
    color: theme.colors.red,
  },
  epochSelectIcon: {
    fill: theme.colors.red,
  },
  epochMenuItem: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.colors.text,
  },
  epochMenuItemSelected: {
    background: `${theme.colors.third} !important`,
  },
  divider: {
    alignSelf: 'stretch',
    background: theme.colors.text,
    opacity: 0.25,
    margin: theme.spacing(0.75, 2),
  },
  results: {
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
    borderRadius: 17.5,
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
  },
  selectedAvatar: {
    borderRadius: 17.5,
    border: `2px solid ${theme.colors.black}`,
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
  },
  userResultDescription: {
    flexGrow: 1,
  },
}));

interface IProps {
  onClickUser: (user: IGraphNode) => void;
  users: IGraphNode[];
  filteredUsers: IGraphNode[];
  selectedUser: IGraphNode | undefined;
  regExp: RegExp | undefined;
  onSearchChange: (_event: any, value: string) => void;
}

const FilterDrawer = ({
  onClickUser,
  regExp,
  selectedUser,
  users,
  filteredUsers,
  onSearchChange,
}: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [notableWords, setNotableWords] = useState<string[]>([]);

  // TODO: Filter down to the current Epoch
  useEffect(() => {
    console.log('useres change', users);
    setNotableWords(getNotableWords(users.map((u) => u.bio).join(' '), 20));
  }, [users]);

  const handleSetOpen = (value: boolean) => {
    if (!value) {
      onSearchChange(undefined, '');
    }
    setOpen(value);
  };

  return (
    <Drawer open={open} setOpen={handleSetOpen} Icon={<FilterIcon />}>
      <Spacer h={42} />
      <Typography variant="h5">Search Circle</Typography>
      <Box width="100%" px={3} mt={1} mb={4}>
        <Autocomplete
          classes={{
            paper: classes.backgroundColorWhite,
            listbox: classes.listbox,
            clearIndicator: classes.colorBlack,
          }}
          freeSolo
          fullWidth
          onInputChange={onSearchChange}
          options={notableWords}
          renderInput={(params: any) => (
            <TextField
              {...params}
              size="small"
              InputProps={{
                value: typeof console.log('autocomplete input params', params),
                ...params.InputProps,
                startAdornment: <SearchIcon />,
                classes: {
                  root: classes.backgroundColorWhite,
                  inputAdornedEnd: classes.colorBlack,
                },
              }}
              placeholder="Search by Keyword"
              variant="outlined"
            />
          )}
        />
      </Box>
      {/* <Typography variant="h5">Filter by Epoch</Typography>
      <Box width="100%" px={3} mt={1} mb={7}>
        <Select
          fullWidth
          variant="outlined"
          classes={{
            root: classes.selectRoot,
            icon: classes.colorBlack,
          }}
          MenuProps={{
            classes: {
              paper: classes.backgroundColorWhite,
            },
          }}
          onChange={({ target: { value } }) =>
            setEpochSelection(value as number)
          }
          value={epochSelection}
        >
          {Object.values(epochOptions).map(({ label, value }) => (
            <MenuItem
              className={classes.epochMenuItem}
              classes={{ selected: classes.epochMenuItemSelected }}
              key={value}
              value={value}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box> */}
      <Typography variant="h5">Results:</Typography>
      <Divider variant="middle" className={classes.divider} />
      <div className={classes.results}>
        {filteredUsers.map((user) => (
          <div key={user.id} className={classes.userResult}>
            <div
              className={classes.userResultHeader}
              onClick={() => onClickUser(user)}
            >
              <Typography variant="body1" className={classes.userResultName}>
                {reactStringReplace(user.name, regExp, (match, i) =>
                  i === 1 ? <strong key={match}>{match}</strong> : null
                )}
              </Typography>
              {user.non_receiver ? (
                <Typography variant="body1" className={classes.userResultOpt}>
                  Opt Out
                </Typography>
              ) : (
                ''
              )}
            </div>
            <div className={classes.userResultBody}>
              <Img
                alt={user.name}
                className={
                  selectedUser === user
                    ? classes.selectedAvatar
                    : classes.avatar
                }
                placeholderImg="/imgs/avatar/placeholder.jpg"
                src={getAvatarPath(user.avatar)}
                width={35}
                height={35}
                onClick={() => onClickUser(user)}
              />
              <Typography
                variant="body2"
                className={classes.userResultDescription}
              >
                {reactStringReplace(user.bio, regExp, (match, i) =>
                  i === 1 ? <strong key={match}>{match}</strong> : null
                )}
              </Typography>
            </div>
            <Divider variant="middle" className={classes.divider} />
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
