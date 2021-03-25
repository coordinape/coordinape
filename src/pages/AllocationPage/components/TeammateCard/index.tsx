import {
  Button,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import { ReactComponent as AlertCircleSVG } from 'assets/svgs/button/alert-circle.svg';
import { ReactComponent as MinusCircleSVG } from 'assets/svgs/button/minus-circle.svg';
import { ReactComponent as PlusCircleSVG } from 'assets/svgs/button/plus-circle.svg';
import { Img } from 'components';
import React from 'react';
import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 320,
    height: 400,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.75),
    paddingRight: theme.spacing(2.75),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
  },
  name: {
    height: 29,
    marginTop: 12,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bioContainer: {
    height: 50,
    marginTop: 1,
    marginBottom: 0,
  },
  bio: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
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
    height: 67,
    marginTop: 20,
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
  },
  tokenInput: {
    width: 66,
    marginTop: 12,
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
  alertContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alertLabel: {
    width: '80%',
    margin: `${theme.spacing(0.5)}px 0`,
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.3)',
    textDecoration: 'underline',
  },
  noteTextareaContainer: {
    height: 68,
    marginTop: 29,
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
    padding: `4px 8px`,
    width: '80%',
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

interface IProps {
  className?: string;
  user: IUser;
  tokens: number;
  note: string;
  disabled: boolean;
  updateTokens: (tokens: number) => void;
  updateNote: (note: string) => void;
}

export const TeammateCard = (props: IProps) => {
  const classes = useStyles();
  const { disabled, note, tokens, user } = props;

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
      <Img
        alt="avatar"
        className={classes.avatar}
        placeholderImg="/imgs/avatar/placeholder.jpg"
        src={(process.env.REACT_APP_S3_BASE_URL as string) + user.avatar}
      />
      <p className={classes.name}>{user.name}</p>
      <div className={classes.bioContainer}>
        <TextOnlyTooltip
          TransitionComponent={Zoom}
          placement="bottom"
          title={user.bio}
        >
          <p className={classes.bio}>{user.bio}</p>
        </TextOnlyTooltip>
      </div>
      <div className={classes.tokenInputContainer}>
        {!user.non_receiver ? (
          <>
            <p className={classes.label}>
              {user.non_receiver ? '' : 'GIVE to Allocate'}
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
          </>
        ) : (
          <div className={classes.alertContainer}>
            <TextOnlyTooltip
              TransitionComponent={Zoom}
              placement="top-start"
              title="This contributor opted out of receiving GIVE. They are paid through other channels or are not currently active."
            >
              <AlertCircleSVG />
            </TextOnlyTooltip>
            <p className={classes.alertLabel}>
              This contributor opted out of receiving GIVE this epoch.
            </p>
          </div>
        )}
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
