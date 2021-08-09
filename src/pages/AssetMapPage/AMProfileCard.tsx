import React, { useRef, useEffect } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { makeStyles, Box, Button } from '@material-ui/core';

import { ApeAvatar, ProfileSocialIcons } from 'components';
import { useSelectedCircle } from 'recoilState';
import {
  useMapMetric,
  useStateAmEgoAddress,
  useMapMeasures,
  useMapSearchRegex,
} from 'recoilState/mapState';
import { assertDef } from 'utils/tools';

import { IFilledProfile } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: theme.spacing(3, 1.75),
    padding: theme.spacing(1.5, 1.75),
    borderRadius: '10px',
    backgroundColor: '#DFE7E8',
    ['-webkit-mask-image']:
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)',
    '& $scale': {
      // backgroundColor: 'hsla(359, 79%, 69%, 0.05)',
      backgroundColor: 'transparent',
    },
  },
  rootSummary: {
    '& $scale': {
      backgroundColor: 'hsla(359, 79%, 69%, 0.3)',
    },
  },
  rootSelected: {
    backgroundColor: 'hsla(183, 40%, 65%, 0.15)',
    '& $scale': {
      backgroundColor: 'hsla(183, 40%, 65%, 0.2)',
    },
  },
  scale: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
  },
  header: {
    width: '100%',
    display: 'flex',
    cursor: 'pointer',
    '&:hover $headerName': {
      color: theme.colors.black,
    },
  },
  headerText: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    marginLeft: theme.spacing(1.25),
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  headerMeasure: {
    fontSize: 14,
    fontWeight: 300,
    lineHeight: 1,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  socialContainer: {
    margin: theme.spacing(2, 0),
  },
  skillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(1, 0),
    '& > *': {
      padding: theme.spacing(0.2, 1),
      margin: theme.spacing(0.5, 0),
      background: theme.colors.lightBlue,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: 300,
      color: theme.colors.white,
      borderRadius: 4,
    },
    '& > *:not(:first-child)': {
      marginLeft: theme.spacing(0.5),
    },
  },
  skillMatch: {
    fontWeight: 700,
  },
  bioContainer: {
    marginTop: theme.spacing(1),
    fontWeight: 300,
    fontSize: 14,
    lineHeight: 1.3,
    color: theme.colors.text + 'ee',
  },
  seeFullProfile: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
}));

const AMProfileCard = ({
  profile,
  summarize,
}: {
  profile: IFilledProfile;
  summarize: boolean;
}) => {
  const classes = useStyles();
  const elemRef = useRef<HTMLDivElement | null>(null);
  const circle = assertDef(useSelectedCircle(), 'Missing selected circle');
  const metric = useMapMetric();
  const [egoAddress, setEgoAddress] = useStateAmEgoAddress();
  const { min, max, measures } = useMapMeasures(metric);
  const searchRegex = useMapSearchRegex();

  const user = assertDef(
    profile.users.find((u) => u.circle_id === circle.id),
    `No user matching ${circle.id}`
  );

  const isSelected = profile.address === egoAddress;
  const myMeasure = measures.get(profile.address) ?? 0;
  const range = max - min;
  const fraction = range ? (myMeasure - min) / range : 1;

  useEffect(() => {
    if (profile.address === egoAddress && elemRef.current) {
      elemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [egoAddress]);

  const fullBio =
    profile.bio ?? ' ' + (user.bio ? `Latest Epoch: ${user.bio}` : '');

  const bio = fullBio.length > 300 ? fullBio.slice(0, 300) + '...' : fullBio;

  const onClick = (profile: IFilledProfile) => {
    if (egoAddress === profile.address) {
      setEgoAddress('');
    } else {
      setEgoAddress(profile.address);
    }
  };

  return (
    <div
      ref={elemRef}
      className={clsx({
        [classes.root]: true,
        [classes.rootSummary]: summarize,
        [classes.rootSelected]: isSelected,
      })}
    >
      <Box className={classes.scale} width={`${fraction * 100}%`} />
      <div className={classes.content}>
        <div className={classes.header} onClick={() => onClick(profile)}>
          <ApeAvatar user={user} className={classes.avatar} />
          <div className={classes.headerText}>
            <span className={classes.headerName}>
              {reactStringReplace(user.name, searchRegex, (match, i) =>
                i === 1 ? <strong key={match}>{match}</strong> : null
              )}
            </span>
            <span className={classes.headerMeasure}>
              {myMeasure && summarize
                ? myMeasure
                : user.non_receiver || user.fixed_non_receiver
                ? 'Opt Out'
                : ''}
            </span>
          </div>
        </div>
        {(!summarize || isSelected) && (
          <>
            {profile?.skills && profile.skills.length > 0 && (
              <div className={classes.skillContainer}>
                {profile.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className={
                      searchRegex?.test(skill) ? classes.skillMatch : undefined
                    }
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {isSelected && (
              <ProfileSocialIcons
                profile={profile}
                className={classes.socialContainer}
              />
            )}
            <div className={classes.bioContainer}>
              {reactStringReplace(bio, searchRegex, (match, i) =>
                i === 1 ? <strong key={match}>{match}</strong> : null
              )}
            </div>

            {isSelected && (
              <div className={classes.seeFullProfile}>
                <Button
                  variant="text"
                  size="small"
                  component={Link}
                  color="secondary"
                  to={`/profile/${profile.address}`}
                >
                  See Full Profile →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AMProfileCard;
