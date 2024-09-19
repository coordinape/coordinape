import { ActivityAvatar } from 'features/activities/ActivityAvatar';
import { easAttestUrl } from 'features/eas/eas';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import useProfileId from '../../hooks/useProfileId';
import {
  AppLink,
  Flex,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { ExternalLink, GemCoOutline, X } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

type Gives = {
  id: number;
  skill?: string;
  attestation_uid?: string;
  giver_profile_public?: {
    name?: string;
    id?: number;
    address?: string;
    avatar?: string;
  };
}[];
export const PostGives = ({
  gives,
  clearSkill,
}: {
  clearSkill: () => void;
  gives: Gives;
}) => {
  const profileId = useProfileId(false);
  const sortedGives = groupAndSortGive(gives);
  return (
    <>
      <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
        {sortedGives.map(g => (
          <Flex key={g.skill} css={{ gap: '$md', flexWrap: 'wrap' }}>
            <Popover>
              <PopoverTrigger css={{ cursor: 'pointer' }}>
                <Text
                  tag
                  size="medium"
                  color="complete"
                  css={{
                    gap: '$xs',
                    ...(g.gives.some(
                      give => give.giver_profile_public?.id === profileId
                    ) && { outline: '1px solid $complete' }),
                  }}
                >
                  {g.skill ? (
                    <>
                      {' '}
                      <Text
                        size="small"
                        css={{ fontWeight: 'normal' }}
                      >{`+${g.count}`}</Text>
                      <GemCoOutline fa size={'md'} />
                      <Text css={skillTextStyle}>{g.skill}</Text>
                    </>
                  ) : (
                    <>
                      <Text
                        size="small"
                        css={{ fontWeight: 'normal' }}
                      >{`+${g.count}`}</Text>
                      <GemCoOutline fa size={'md'} />
                    </>
                  )}

                  {g.gives.some(
                    give => give.giver_profile_public?.id === profileId
                  ) && (
                    <IconButton
                      as="span"
                      onClick={() => clearSkill()}
                      css={{ pr: '$sm', width: 'auto' }}
                    >
                      <X size={'sm'} color="complete" />
                    </IconButton>
                  )}
                </Text>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                css={{
                  background: '$dim',
                  mt: '$sm',
                  p: '$sm $sm',
                }}
              >
                <AppLink
                  to={coLinksPaths.exploreSkill(g.skill)}
                  css={{
                    ...skillTextStyle,
                    color: '$complete',
                    fontSize: '$small',
                    ...(g.skill && {
                      borderBottom: '0.5px solid $border',
                      pb: '$xs',
                      mb: '$sm',
                    }),
                  }}
                >
                  {g.skill}
                </AppLink>
                <Flex column css={{ gap: '$sm' }}>
                  {g.gives
                    .filter(give => give.giver_profile_public?.name)
                    .map(
                      give =>
                        give.giver_profile_public && (
                          <Flex
                            key={give.giver_profile_public.address}
                            css={{ alignItems: 'center', gap: '$sm' }}
                          >
                            <>
                              <ActivityAvatar
                                size="xs"
                                profile={give.giver_profile_public}
                              />
                              <Text
                                size="small"
                                semibold
                                css={{ textDecoration: 'none' }}
                                as={NavLink}
                                to={coLinksPaths.profileGive(
                                  give.giver_profile_public.address || ''
                                )}
                              >
                                {give.giver_profile_public?.name}
                              </Text>
                              {give.attestation_uid && (
                                <Text size="small">
                                  <Link
                                    inlineLink
                                    href={easAttestUrl(
                                      give.attestation_uid as string
                                    )}
                                    css={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    onchain
                                    <ExternalLink css={{ ml: '$xs' }} />
                                  </Link>
                                </Text>
                              )}
                            </>
                          </Flex>
                        )
                    )}
                </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

const groupedGives = (gives: Gives) => {
  return gives.reduce(
    (acc, give) => {
      if (give.skill) {
        if (!acc[give.skill]) {
          acc[give.skill] = [];
        }
        acc[give.skill].push(give);
      } else {
        if (!acc['']) {
          acc[''] = [];
        }
        acc[''].push(give);
      }
      return acc;
    },
    {} as Record<string, Gives>
  );
};

const sortedGives = (groupedGives: Record<string, Gives>) => {
  return Object.entries(groupedGives)
    .map(([skill, gives]) => ({
      count: gives.length,
      gives: gives,
      skill: skill,
    }))
    .sort((a, b) => {
      const diff = b.count - a.count;
      if (diff == 0) {
        return a.skill.localeCompare(b.skill);
      }
      return diff;
    });
};

export const groupAndSortGive = (gives: Gives) => {
  return sortedGives(groupedGives(gives));
};
