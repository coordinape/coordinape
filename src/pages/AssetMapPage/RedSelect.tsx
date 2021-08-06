import React from 'react';

import { MenuItem, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.red,
    '&:hover': {
      '&::before': {
        borderBottomColor: `${theme.colors.red} !important`,
      },
    },
    '&::after': {
      borderBottomColor: `${theme.colors.transparent} !important`,
    },
  },
  select: {
    color: theme.colors.red,
  },
  selectIcon: {
    fill: theme.colors.red,
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
    background: `${theme.colors.third} !important`,
  },
}));

export const RedSelect = ({
  value,
  options,
  onChange,
}: {
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
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
      onChange={({ target: { value } }) => onChange(value as number)}
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
