import React from 'react';

import { NavLink } from 'react-router-dom';

import {
  Button,
  IconButton,
  Popover,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { ReactComponent as AlertCircleSVG } from 'assets/svgs/button/alert-circle.svg';
import { ReactComponent as DiscordSVG } from 'assets/svgs/social/discord.svg';
import { ReactComponent as GithubSVG } from 'assets/svgs/social/github.svg';
import { ReactComponent as MediumSVG } from 'assets/svgs/social/medium.svg';
import { ReactComponent as TelegramSVG } from 'assets/svgs/social/telegram-icon.svg';
import { ReactComponent as TwitterSVG } from 'assets/svgs/social/twitter-icon.svg';
import { ReactComponent as WebsiteSVG } from 'assets/svgs/social/website.svg';
import { ApeAvatar, ApeTextField } from 'components';
import { PlusCircleIcon, MinusCircleIcon } from 'icons';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 330,
    height: 452,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  socialContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 'calc(50% - 50px)',
  },
  socialItem: {
    margin: theme.spacing(0.5),
    width: 18,
    height: 18,
    '& svg': {
      width: '100%',
      height: '100%',
    },
  },
  moreContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 'calc(50% - 50px)',
  },
  moreButton: {
    margin: 0,
    padding: theme.spacing(0, 1),
    minWidth: 20,
    fontSize: 17,
    fontWeight: 800,
    color: theme.colors.text,
  },
  morePaper: {
    width: 150,
    maxHeight: 100,
    padding: theme.spacing(1),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    '& a': {
      margin: theme.spacing(0.5, 1.5),
      fontSize: 16,
      color: theme.colors.text,
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      '&:hover': {
        color: theme.colors.selected,
      },
    },
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
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
  topContainer: {
    height: 149,
  },
  skillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skillItem: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1.5),
    background: theme.colors.lightBlue,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.white,
    borderRadius: 4,
  },
  bioContainer: {
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
    margin: theme.spacing(0, 0, 1),
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.7)',
  },
  tokenInputContainer: {
    height: 66,
    marginTop: theme.spacing(1.5),
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
  },
  alertContainer: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alertLabel: {
    width: '80%',
    margin: `${theme.spacing(0.5)}px 0`,
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.9)',
    textDecoration: 'underline',
    wordBreak: 'break-word',
  },
  noteTextareaContainer: {
    height: 91,
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  noteTextarea: {
    '& textarea': {
      fontSize: 12,
    },
    '&.MuiInputBase-root': {
      backgroundColor: 'white',
    },
  },
  tokenInput: {
    '&.MuiInputBase-root': {
      backgroundColor: 'white',
    },
    width: 165,
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `4px 8px`,
    maxWidth: 240,
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  // onChange Tokens
  const onChangeTokens = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) {
      const newValue = Math.abs(Number(e.target.value));
      e.target.value = String(newValue);
      props.updateTokens(newValue);
    }
  };

  // spin Tokens
  const spinTokens = (increment: number) => {
    const newValue = Math.max(0, tokens + increment);
    props.updateTokens(newValue);
  };

  // onChange Note
  const onChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.updateNote(e.target.value);
  };

  // open More
  const openMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // close More
  const closeMore = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'more-popover' : undefined;

  // Return
  return (
    <div className={classes.root}>
      <NavLink to={`profile/${user.address}`}>
        <ApeAvatar user={user} className={classes.avatar} />
      </NavLink>
      {user.profile && (
        <div className={classes.socialContainer}>
          {user.profile?.twitter_username && (
            <Link
              href={`https://twitter.com/${user.profile?.twitter_username}`}
              target="_blank"
              className={classes.socialItem}
            >
              <TwitterSVG />
            </Link>
          )}
          {user.profile?.github_username && (
            <Link
              href={`https://github.com/${user.profile?.github_username}`}
              target="_blank"
              className={classes.socialItem}
            >
              <GithubSVG />
            </Link>
          )}
          {user.profile?.telegram_username && (
            <Link
              href={`https://t.me/${user.profile?.telegram_username}`}
              target="_blank"
              className={classes.socialItem}
            >
              <TelegramSVG />
            </Link>
          )}
          {user.profile?.discord_username && (
            <Link
              href={`https://discord.com/${user.profile?.discord_username}`}
              target="_blank"
              className={classes.socialItem}
            >
              <DiscordSVG />
            </Link>
          )}
          {user.profile?.medium_username && (
            <Link
              href={`https://medium.com/${user.profile?.medium_username}`}
              target="_blank"
              className={classes.socialItem}
            >
              <MediumSVG />
            </Link>
          )}
          {user.profile?.website && (
            <Link
              href={user.profile?.website}
              target="_blank"
              className={classes.socialItem}
            >
              <WebsiteSVG />
            </Link>
          )}
        </div>
      )}
      <div className={classes.moreContainer}>
        <Button
          aria-describedby={id}
          className={classes.moreButton}
          onClick={openMore}
        >
          ⋯
        </Button>
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.morePaper,
        }}
        id={id}
        onClose={closeMore}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <NavLink to={`map/?highlight=${user.address}`}>View on Graph</NavLink>
        <NavLink to={`profile/${user.address}`}>View Profile</NavLink>
      </Popover>
      <p className={classes.name}>{user.name}</p>
      <div className={classes.topContainer}>
        {user.profile && user.profile.skills && user.profile.skills.length > 0 && (
          <div className={classes.skillContainer}>
            {user.profile.skills.slice(0, 3).map((skill) => (
              <div key={skill} className={classes.skillItem}>
                {skill}
              </div>
            ))}
          </div>
        )}
        <div className={classes.bioContainer}>
          <p className={classes.bio}>{user.bio}</p>
        </div>
      </div>
      <div className={classes.tokenInputContainer}>
        {!user.non_receiver ? (
          <>
            <p className={classes.label}>
              {user.non_receiver ? '' : `${tokenName} Allocated`}
            </p>
            <ApeTextField
              value={tokens}
              onChange={onChangeTokens}
              InputProps={{
                classes: {
                  root: classes.tokenInput,
                },
                startAdornment: (
                  <IconButton
                    disabled={disabled}
                    onClick={() => spinTokens(-1)}
                  >
                    <MinusCircleIcon />
                  </IconButton>
                ),
                endAdornment: (
                  <IconButton disabled={disabled} onClick={() => spinTokens(1)}>
                    <PlusCircleIcon />
                  </IconButton>
                ),
              }}
              disabled={disabled}
              inputProps={{
                min: 0,
                type: 'number',
              }}
            />
          </>
        ) : (
          <div className={classes.alertContainer}>
            <TextOnlyTooltip
              TransitionComponent={Zoom}
              placement="top-start"
              title={`This contributor opted out of receiving ${tokenName}. They are paid through other channels or are not currently active.`}
            >
              <AlertCircleSVG />
            </TextOnlyTooltip>
            <p className={classes.alertLabel}>
              This contributor opted out of receiving {tokenName} this epoch.
            </p>
          </div>
        )}
      </div>
      <div className={classes.noteTextareaContainer}>
        <p className={classes.label}>Leave a Note</p>
        <ApeTextField
          onChange={onChangeNote}
          placeholder="Thank you for..."
          value={note}
          disabled={disabled}
          multiline
          fullWidth
          rows={3}
          inputProps={{
            maxLength: 280,
          }}
          InputProps={{
            classes: {
              root: classes.noteTextarea,
            },
          }}
        />
      </div>
    </div>
  );
};
