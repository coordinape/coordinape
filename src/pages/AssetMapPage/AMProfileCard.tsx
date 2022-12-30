import React, { useRef, useEffect } from 'react';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { ProfileSocialIcons } from 'components';
import {
  useMapMetric,
  useStateAmEgoAddress,
  useMapMeasures,
  useMapSearchRegex,
} from 'recoilState/map';
import { Avatar, Box, Button, Flex, Text } from 'ui';
import { assertDef } from 'utils';

import { IProfile, ICircle } from 'types';

const AMProfileCard = ({
  profile,
  summarize,
  circle,
}: {
  profile: IProfile;
  summarize: boolean;
  circle: ICircle;
}) => {
  const elemRef = useRef<HTMLDivElement | null>(null);
  const metric = useMapMetric();
  const [egoAddress, setEgoAddress] = useStateAmEgoAddress();
  const { min, max, measures } = useMapMeasures(metric);
  const searchRegex = useMapSearchRegex();

  const user = assertDef(
    profile.users.find(u => u.circle_id === circle.id),
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

  const onClick = (profile: IProfile) => {
    if (egoAddress === profile.address) {
      setEgoAddress('');
    } else {
      setEgoAddress(profile.address);
    }
  };

  return (
    <Box
      ref={elemRef}
      css={{
        position: 'relative',
        marginBottom: '$lg',
        padding: '$lg',
        borderRadius: '$3',
        backgroundColor: '$surfaceNested',
        '&:first-child': {
          marginTop: 0,
        },
        '&.root .scale': {
          backgroundColor: 'transparent',
        },
        '&.rootSummary .scale': {
          backgroundColor: '$tagPrimaryBackground',
        },
        '.rootSelected': {
          backgroundColor: '$secondary',
        },
        '.scale': {
          position: 'absolute',
          borderRadius: '$3',
          left: 0,
          top: 0,
          bottom: 0,
        },
        '.content': {
          position: 'relative',
          left: 0,
          right: 0,
          top: 0,
        },
        '.socialContainer': {
          margin: '$lg 0',
        },
        '.skillContainer': {
          display: 'flex',
          flexWrap: 'wrap',
          margin: '$lg 0',
          '& > *': {
            padding: '$xs $md',
            margin: '$md 0',
            background: '$secondary',
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 300,
            color: '$background',
            borderRadius: 4,
          },
          '& > *:not(:first-child)': {
            marginLeft: '$sm',
          },
        },
        '.skillMatch': {
          fontWeight: 700,
        },
        '.bioContainer': {
          marginTop: '$md',
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.3,
          color: '$text',
        },
        '.seeFullProfile': {
          marginTop: '$lg',
          textAlign: 'center',
        },
      }}
      className={clsx({
        ['root']: true,
        ['rootSummary']: summarize,
        ['rootSelected']: isSelected,
      })}
    >
      <Box className="scale" css={{ width: `${fraction * 100}%` }} />
      <div className="content">
        <Flex
          css={{ alignItems: 'center', gap: '$md', cursor: 'pointer' }}
          onClick={() => onClick(profile)}
        >
          <Avatar
            path={user.profile?.avatar}
            name={user.profile?.name ?? user.name}
          />
          <Box>
            <Text h3 css={{ display: 'block' }}>
              {reactStringReplace(
                user.profile?.name ?? user.name,
                searchRegex,
                (match, i) =>
                  i === 1 ? <strong key={match}>{match}</strong> : null
              )}
            </Text>
            <Text>
              {myMeasure && summarize
                ? myMeasure
                : user.non_receiver || user.fixed_non_receiver
                ? 'Opt Out'
                : ''}
            </Text>
          </Box>
        </Flex>
        {(!summarize || isSelected) && (
          <>
            {profile?.skills && profile.skills.length > 0 && (
              <div className="skillContainer">
                {profile.skills.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className={
                      searchRegex?.test(skill) ? 'skillMatch' : undefined
                    }
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {isSelected && (
              <div className="socialContainer">
                <ProfileSocialIcons profile={profile} />
              </div>
            )}
            <div className="bioContainer">
              {reactStringReplace(bio, searchRegex, (match, i) =>
                i === 1 ? <strong key={match}>{match}</strong> : null
              )}
            </div>

            {isSelected && (
              <div className="seeFullProfile">
                <Button
                  size="small"
                  as={NavLink}
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
    </Box>
  );
};

export default AMProfileCard;
