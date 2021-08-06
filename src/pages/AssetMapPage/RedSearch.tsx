import React from 'react';

import { TextField, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';

import { SKILLS } from 'config/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  colorBlack: {
    color: theme.colors.black,
  },
  listbox: {
    overflowX: 'hidden',
  },
  backgroundColorWhite: {
    backgroundColor: theme.colors.white,
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.red,
  },
  input: {
    padding: '6px 4px 5px',
    color: theme.colors.red,
    '&::placeholder': {
      color: theme.colors.red + '80',
    },
  },
  autocompleteAdornment: {
    '& .MuiButtonBase-root': {
      color: theme.colors.red,
    },
  },
  epochSelect: {
    color: theme.colors.red,
  },
  epochSelectIcon: {
    fill: theme.colors.red,
  },
  epochSelectMenuPaper: {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
  },
  epochMenuItem: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.colors.text,
  },
}));

const skillNames = SKILLS.map(({ name }) => name);

export const RedSearch = ({ onChange }: { onChange: (v: string) => void }) => {
  const classes = useStyles();

  return (
    <Autocomplete
      classes={{
        root: classes.root,
        endAdornment: classes.autocompleteAdornment,
        paper: classes.epochSelectMenuPaper,
        // listbox: classes.listbox,
        // clearIndicator: classes.colorBlack,
      }}
      freeSolo
      onInputChange={(_event: any, v: string) => onChange(v)}
      options={skillNames}
      renderInput={(params: any) => (
        <TextField
          {...params}
          size="small"
          // InputLabelProps={{ classes: { root: classes.autocompleteLabel } }}
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon />,
            classes: {
              root: classes.backgroundColorWhite,
              inputAdornedEnd: classes.colorBlack,
              input: classes.input,
            },
          }}
          placeholder="Search by Keyword"
          variant="standard"
        />
      )}
    />
  );
};

export default RedSearch;
