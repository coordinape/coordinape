import { FormControlLabel, Radio, makeStyles } from '@material-ui/core';
import { ReactComponent as CheckedRadioSVG } from 'assets/svgs/button/checked-radio.svg';
import { ReactComponent as UnCheckedRadioSVG } from 'assets/svgs/button/unchecked-radio.svg';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 222,
    margin: `0 ${theme.spacing(4)}px`,
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.8),
    fontSize: 40,
    fontWeight: 'bold',
  },
  subTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 'normal',
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
            checkedIcon={<CheckedRadioSVG />}
            className={classes.radioInput}
            icon={<UnCheckedRadioSVG />}
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
