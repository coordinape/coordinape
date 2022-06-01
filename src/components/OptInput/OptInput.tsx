import React from 'react';

import { FormControlLabel, Radio, makeStyles } from '@material-ui/core';

import { CheckedRadio, UnCheckedRadio } from 'icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: 222,
    margin: 0,
    textAlign: 'center',
    color: 'rgba(81, 99, 105, 0.7)',
    '&:hover': {
      color: 'rgba(81, 99, 105, 0.85)',
    },
    '&:checked': {
      color: theme.colors.text,
    },
  },
  radioInput: {
    height: 24,
    width: 24,
    padding: 0,
  },
  title: {
    margin: theme.spacing(1, 0, 0.5),
    fontSize: 40,
    fontWeight: 700,
  },
  subTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 300,
  },
}));

interface IProps {
  className?: string;
  isChecked: boolean;
  title: string;
  subTitle: string;
  updateOpt: () => void;
}

export const OptInput = (props: IProps) => {
  const classes = useStyles();
  const { isChecked, subTitle, title, updateOpt } = props;

  // Return
  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Radio
            checked={isChecked}
            checkedIcon={<CheckedRadio color="complete" />}
            className={classes.radioInput}
            icon={<UnCheckedRadio />}
            onChange={() => updateOpt()}
          />
        }
        label={
          <>
            <p className={classes.title}>{title}</p>
            <p className={classes.subTitle}>{subTitle}</p>
          </>
        }
        labelPlacement="bottom"
      />
    </div>
  );
};
