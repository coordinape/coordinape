import React from 'react';

import clsx from 'clsx';

import { makeStyles, Typography, Box } from '@material-ui/core';

import { ReactComponent as CoordinapeLogoSvg } from 'assets/svgs/coordinape-logo.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    fill: 'currentColor',
  },
  title: {
    fontWeight: 700,
    color: 'currentColor',
  },
}));

interface IProps {
  withTitle: boolean;
  height: number;
  className: string;
}

export const CoordinapeLogo = ({ withTitle, height, className }: IProps) => {
  const classes = useStyles();
  const textSizeStyle = {
    fontSize: 0.52 * height,
    lineHeight: `${0.66 * height}px`,
  };

  return (
    <Box className={clsx(className, classes.root)} height={height}>
      <Box width={height} height={height} mr={`${height * 0.104}px`}>
        <CoordinapeLogoSvg className={classes.logo} />
      </Box>
      {withTitle && (
        <Typography
          variant="h1"
          className={classes.title}
          style={textSizeStyle}
        >
          Coordinape
        </Typography>
      )}
    </Box>
  );
};
