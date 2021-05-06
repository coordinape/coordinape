import { IconButton, Typography, makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { IGraphNode } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 500,
    maxWidth: '50vw',
    minHeight: 50,
    zIndex: 10,
    padding: theme.spacing(1.5, 2),
    transition: 'height .8s ease',
    height: '0%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 10.75,
    backgroundColor: '#DFE7E8',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  body: {
    marginTop: theme.spacing(1.5),
    height: '100%',
    overflowY: 'auto',
  },
  user: {
    marginTop: theme.spacing(3),
  },
  selectedTitle: {
    color: theme.colors.secondary,
    cursor: 'pointer',
  },
  title: {
    cursor: 'pointer',
  },
  optOut: {
    marginTop: theme.spacing(1),
    fontWeight: 800,
  },
}));

interface IProps {
  onClickUser: (user: IGraphNode) => void;
  onClose: () => void;
  users: IGraphNode[];
  selectedUser: IGraphNode | undefined;
  regExp: RegExp | undefined;
}

const GraphInfoPanel = ({
  onClickUser,
  onClose,
  regExp,
  selectedUser,
  users,
}: IProps) => {
  const [expanded, setExpandedState] = useState<boolean>(false);
  const classes = useStyles();

  const setExpanded = (value: boolean) => {
    if (expanded && !value) {
      onClose();
    }
    setExpandedState(value);
  };

  useEffect(() => {
    setExpanded(users.length > 0);
  }, [users]);

  const content = regExp ? (
    <div className={classes.body}>
      {users.map((user) => (
        <div className={classes.user} key={user.id}>
          <Typography
            className={
              selectedUser === user ? classes.selectedTitle : classes.title
            }
            onClick={() => onClickUser(user)}
            variant="h4"
          >
            {user.name}
          </Typography>
          <Typography variant="body1">
            {reactStringReplace(user.bio, regExp, (match, i) =>
              i === 1 ? <strong key={match}>{match}</strong> : null
            )}
          </Typography>
          {!!user.non_receiver && (
            <Typography className={classes.optOut} variant="body2">
              Opt Out
            </Typography>
          )}
        </div>
      ))}
    </div>
  ) : users.length === 1 ? (
    <div className={classes.body}>
      <Typography variant="body1">{users[0].bio}</Typography>
      {!!users[0].non_receiver && (
        <Typography className={classes.optOut} variant="body2">
          Opt Out
        </Typography>
      )}
    </div>
  ) : (
    <div className={classes.body}>Search biographies above.</div>
  );

  return (
    <div
      className={classes.root}
      style={{ height: !expanded ? 0 : users.length > 1 ? '70vh' : '180px' }}
    >
      <div className={classes.header}>
        <Typography variant="h2">
          {regExp ? 'Results' : users.length ? users[0].name : '~'}
        </Typography>

        <IconButton
          color="inherit"
          onClick={() => setExpanded(!expanded)}
          size="small"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </IconButton>
      </div>
      {content}
    </div>
  );
};

export default GraphInfoPanel;
