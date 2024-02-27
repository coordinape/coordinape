import { ActivityAvatar } from 'features/activities/ActivityAvatar';
import { NavLink } from 'react-router-dom';

import useProfileId from '../../hooks/useProfileId';
import {
  AppLink,
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { GemCoFillSm, X } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
type Gives = {
  id: number;
  skill?: string;
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
  const profileId = useProfileId(true);
  const sortedGives = groupAndSortGive(gives);
  return (
    <>
      <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
        {sortedGives.map(g => (
          <Flex key={`give_${g.skill}`} css={{ gap: '$md', flexWrap: 'wrap' }}>
            <Popover>
              <PopoverTrigger css={{ cursor: 'pointer' }}>
                <Text
                  tag
                  size="medium"
                  color="complete"
                  css={{
                    ...(g.gives.some(
                      give => give.giver_profile_public?.id === profileId
                    ) && { outline: '1px solid $complete' }),
                  }}
                >
                  {g.skill ? (
                    <>
                      {' '}
                      {`+${g.count}`}
                      <GemCoFillSm fa size={'md'} /> {g.skill}
                    </>
                  ) : (
                    <>
                      {`+${g.count}`}
                      <GemCoFillSm fa size={'md'} />
                    </>
                  )}

                  {g.gives.some(
                    give => give.giver_profile_public?.id === profileId
                  ) && (
                    <IconButton
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
                    fontSize: '$small',
                    color: '$complete',
                    fontWeight: '$semibold',
                    borderBottom: '0.5px solid $border',
                    pb: '$xs',
                    mb: '$sm',
                  }}
                >
                  {g.skill}
                </AppLink>
                <Flex column css={{ gap: '$sm' }}>
                  {g.gives
                    .filter(give => give.giver_profile_public?.name)
                    .map((give, index) => (
                      <Flex
                        key={`skill_${g.skill}_${index}`}
                        css={{ alignItems: 'center', gap: '$sm' }}
                      >
                        {give.giver_profile_public && (
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
                              to={coLinksPaths.profile(
                                give.giver_profile_public.address || ''
                              )}
                            >
                              {give.giver_profile_public?.name}
                            </Text>
                          </>
                        )}
                      </Flex>
                    ))}
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
