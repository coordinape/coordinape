import React from 'react';

import {
  Button,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';

import { ReactComponent as AllocationFire } from 'assets/svgs/button/allocation-fire.svg';
import { ReactComponent as MinusCircleSVG } from 'assets/svgs/button/minus-circle.svg';
import { ReactComponent as PlusCircleSVG } from 'assets/svgs/button/plus-circle.svg';
import { Img } from 'components';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 270,
    height: 360,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  fireIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    border: `1.34426px solid ${theme.colors.border}`,
  },
  name: {
    height: 29,
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bioContainer: {
    height: 80,
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
  },
  bio: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    overflow: 'hidden',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  label: {
    height: 14,
    margin: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.3)',
  },
  tokenInputContainer: {
    height: 66,
    marginTop: theme.spacing(1.5),
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
  },
  tokenInput: {
    width: 66,
    marginTop: theme.spacing(1),
    fontSize: 36,
    fontWeight: 600,
    textDecorationLine: 'underline',
    color: theme.colors.text,
    background: 'none',
    border: 0,
    outline: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  noteTextareaContainer: {
    height: 68,
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  noteTextarea: {
    height: 47,
    marginTop: 7,
    marginLeft: 0,
    marginRight: 0,
    padding: 10,
    resize: 'none',
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.text,
    background: 'rgba(81, 99, 105, 0.2)',
    border: 0,
    borderRadius: 8,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&::placeholder': {
      opacity: 0.3,
    },
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `13px 20px`,
    maxWidth: 240,
    fontSize: 15,
    fontWeight: 500,
    color: 'white',
    background: '#828F93',
  },
})(Tooltip);

interface IProps {
  className?: string;
  user: IUser;
  tokenName: string;
  tokens: number;
  note: string;
  disabled: boolean;
  updateTokens: (tokens: number) => void;
  updateNote: (note: string) => void;
}

export const TeammateCard = (props: IProps) => {
  const classes = useStyles();
  const { disabled, note, tokenName, tokens, user } = props;

  // onChange Tokens
  const onChangeTokens = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) {
      const newValue = Math.min(Math.abs(Number(e.target.value)), 100);
      e.target.value = String(newValue);
      props.updateTokens(newValue);
    }
  };

  // spin Tokens
  const spinTokens = (increment: number) => {
    const newValue = Math.max(0, Math.min(tokens + increment, 100));
    props.updateTokens(newValue);
  };

  // onChange Note
  const onChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.updateNote(e.target.value);
  };

  // Return
  return (
    <div className={classes.root}>
      {user.regift_percent === 100 && (
        <div className={classes.fireIcon}>
          <TextOnlyTooltip
            TransitionComponent={Zoom}
            placement="bottom-start"
            title={`This user is currently set to burn 100% of the ${tokenName} they receive this epoch.`}
          >
            <AllocationFire />
          </TextOnlyTooltip>
        </div>
      )}
      <Img
        alt="avatar"
        className={classes.avatar}
        placeholderImg="/imgs/avatar/placeholder.jpg"
        src={(process.env.REACT_APP_S3_BASE_URL as string) + user.avatar}
      />
      <p className={classes.name}>{user.name}</p>
      <div className={classes.bioContainer}>
        <p className={classes.bio}>{user.bio}</p>
      </div>
      <div className={classes.tokenInputContainer}>
        <p className={classes.label}>
          {user.non_receiver ? '' : `${tokenName} to Allocate`}
        </p>
        <div>
          <Button disabled={disabled} onClick={() => spinTokens(-1)}>
            <MinusCircleSVG />
          </Button>
          <input
            className={classes.tokenInput}
            disabled={disabled}
            min="0"
            onChange={onChangeTokens}
            onWheel={(e) => e.currentTarget.blur()}
            pattern="[0-9]*"
            type="number"
            value={tokens}
          />
          <Button disabled={disabled} onClick={() => spinTokens(1)}>
            <PlusCircleSVG />
          </Button>
        </div>
      </div>
      <div className={classes.noteTextareaContainer}>
        <p className={classes.label}>Leave a Note</p>
        <textarea
          className={classes.noteTextarea}
          disabled={disabled}
          maxLength={280}
          onChange={onChangeNote}
          placeholder="Why are you contributing?"
          value={note}
        />
      </div>
    </div>
  );
};
