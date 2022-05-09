import React from 'react';

import { MenuItem, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  selectRoot: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.alert,
    '&:hover': {
      '&::before': {
        borderBottomColor: `${theme.colors.alert} !important`,
      },
    },
    '&::after': {
      borderBottomColor: `transparent !important`,
    },
  },
  select: {
    color: theme.colors.alert,
  },
  selectIcon: {
    fill: theme.colors.alert,
  },
  selectMenuPaper: {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
  },
  menuItem: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.colors.text,
  },
  menuItemSelected: {
    background: `${theme.colors.surface} !important`,
  },
}));

export const RedSelect = ({
  value,
  options,
  onChange,
}: {
  value: number | string;
  options: { value: number | string; label: string }[];
  onChange: (value: number | string) => void;
}) => {
  const classes = useStyles();

  return (
    <Select
      MenuProps={{
        classes: {
          paper: classes.selectMenuPaper,
        },
      }}
      className={classes.selectRoot}
      classes={{
        select: classes.select,
        icon: classes.selectIcon,
      }}
      onChange={({ target: { value } }) => onChange(value as number | string)}
      value={value}
    >
      {options.map(({ label, value }) => (
        <MenuItem
          className={classes.menuItem}
          classes={{ selected: classes.menuItemSelected }}
          key={value}
          value={value}
        >
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RedSelect;
