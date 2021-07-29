import React from 'react';

import { Button, ButtonProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  button: {},
}));

// TODO: Move styles into global, may not need this

// ApeButton is a wrapper around Button to have default and styles match.
export const ApeButton = ({ children, ...props }: ButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      {...props}
    >
      {children}
    </Button>
  );
};
