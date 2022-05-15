import React from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';
import MuiDrawer from '@material-ui/core/Drawer';

import { Text, Button } from 'ui';
import { ArrowIcon } from 'ui/icons/ArrowIcon';

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'stretch',
    transition: 'width .4s ease',
    border: 1,
    paddingBottom: 32,
    width: theme.custom.appDrawerWidth,
    maxWidth: '95vw',
    marginLeft: 26,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 50,
    width: theme.custom.appDrawerWidth,
  },
  content: {
    flexGrow: 1,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    flexGrow: 1,
    paddingTop: theme.spacing(1.5),
    opacity: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const Drawer = ({ open, setOpen, children }: IProps) => {
  const classes = useStyles();

  return (
    <MuiDrawer
      open
      onClose={() => setOpen(false)}
      classes={{
        root: classes.root,
        paper: clsx(classes.paper),
      }}
      variant="persistent"
      anchor={'left'}
    >
      <div className={classes.header}>
        <Text h2 css={{ fontSize: '$h1', fontWeights: '$semibold' }}>
          Circle Map
        </Text>
        <Text
          css={{
            fontSize: '$medium',
            color: '$text',
            marginTop: 20,
            marginBottom: 40,
          }}
        >
          See how gift circle rewards are flowing
        </Text>
        <Button
          outlined
          size="large"
          onClick={() => setOpen(!open)}
          css={{
            width: 'fit-content',
            justifyContent: 'flex-start',
          }}
        >
          Filters
          <ArrowIcon
            size="md"
            color={'secondaryText'}
            css={{ marginLeft: 8 }}
          />
        </Button>
      </div>
      {open ? <div className={classes.content}>{children}</div> : undefined}
    </MuiDrawer>
  );
};
