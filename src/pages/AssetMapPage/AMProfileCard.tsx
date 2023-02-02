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
      onClick={() => onClick(profile)}
      css={{
        position: 'relative',
        marginBottom: '$md',
        padding: '$md',
        borderRadius: '$3',
        cursor: 'pointer',
        backgroundColor: '$surface',
        border: '1px solid transparent',
        '&:hover': {
          borderColor: '$link',
        },
        '&:first-child': {
          marginTop: 0,
        },
        '&.root .scale': {
          backgroundColor: 'transparent',
          pointerEvents: 'none',
        },
        '&.rootSelected, &.rootSummary .scale': {
          // backgroundColor: '$tagPrimaryBackground',
          borderColor: '$borderFocus',
          backgroundColor: '$highlight',
        },
        '.scale': {
          position: 'absolute',
          borderRadius: '$3',
          left: 0,
          top: 0,
          bottom: 0,
        },
      }}
      className={clsx({
        ['root']: true,
        ['rootSummary']: summarize,
        ['rootSelected']: isSelected,
      })}
    >
      <Box className="scale" css={{ width: `${fraction * 100}%` }} />
      <Flex column css={{ gap: '$sm' }}>
        <Flex
          css={{
            alignItems: 'center',
            gap: '$sm',
          }}
        >
          <Avatar
            size="small"
            path={user.profile?.avatar}
            name={user.profile?.name ?? user.name}
          />
          <Box>
            <Text size="large" css={{ display: 'block' }}>
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
              <Flex css={{ gap: '$sm' }}>
                {profile.skills.slice(0, 3).map(skill => (
                  <Text tag color="secondary" key={skill}>
                    {skill}
                  </Text>
                ))}
              </Flex>
            )}
            {isSelected && (
              <Flex>
                <ProfileSocialIcons profile={profile} />
              </Flex>
            )}
            <Text p as="p" size="small">
              {reactStringReplace(bio, searchRegex, (match, i) =>
                i === 1 ? <strong key={match}>{match}</strong> : null
              )}
            </Text>

            {isSelected && (
              <Button
                size="small"
                as={NavLink}
                color="secondary"
                to={`/profile/${profile.address}`}
              >
                See Full Profile →
              </Button>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
};

export default AMProfileCard;
