import { Command } from 'cmdk';
import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { SkillComboBox } from '../../components/SkillComboBox/SkillComboBox';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { GemCoFill, GemCoFillSm, User, Zap } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Button, Flex, Text } from '../../ui';
import isFeatureEnabled from 'config/features';

import { POINTS_QUERY_KEY } from './PointsBar';

export const CoLinksGiveButton = ({
  activityId,
  targetProfileId,
  isMyPost,
  gives,
}: {
  activityId: number;
  targetProfileId: number;
  isMyPost: boolean;
  gives: {
    id: number;
    skill?: string;
    giver_profile_public?: {
      name?: string;
      id?: number;
    };
  }[];
}) => {
  const profileId = useProfileId(true);
  const { showError } = useToast();

  const queryClient = useQueryClient();

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const createGiveMutation = (skill: string | undefined) => {
    return client.mutate(
      {
        createCoLinksGive: [
          {
            payload: {
              activity_id: activityId,
              skill,
            },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'createCoLinksGive',
      }
    );
  };

  const invalidateActivities = () => {
    queryClient.invalidateQueries([
      ACTIVITIES_QUERY_KEY,
      [QUERY_KEY_COLINKS, 'activity'],
    ]);
  };

  const invalidatePointsBar = () => {
    queryClient.invalidateQueries([POINTS_QUERY_KEY]);
  };

  const { mutate: createGive } = useMutation(createGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
      invalidatePointsBar();
    },
    onError: error => {
      showError(error);
    },
  });

  if (!isFeatureEnabled('colinks_give')) return null;

  return (
    <>
      <Flex className="clickThrough" column css={{ gap: '$sm' }}>
        {!isMyPost && (
          <>
            {myGive ? (
              <Button
                as="span"
                noPadding
                color="cta"
                css={{
                  pointerEvents: 'none',
                  cursor: 'default',
                  p: '3px 5px',
                  background: 'linear-gradient(.33turn, $cta 23%, $complete)',
                  boxShadow: '#1e00312e -2px -2px 7px 1px inset',
                }}
              >
                <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                  <GemCoFill fa size="xl" />
                  <Text size="xs">GIVE</Text>
                </Flex>
              </Button>
            ) : (
              <PickOneSkill
                setSkill={skill => createGive(skill)}
                placeholder={'Choose a GIVE Reason'}
                targetProfileId={targetProfileId}
                trigger={
                  <>
                    <Button
                      as="span"
                      noPadding
                      color="secondary"
                      css={{
                        cursor: 'pointer',
                        p: '3px 5px',
                      }}
                    >
                      <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                        <GemCoFill fa size="xl" />
                        <Text size="xs">GIVE</Text>
                      </Flex>
                    </Button>
                  </>
                }
              />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

type PickOneSkillProps = {
  targetProfileId: number;
  setSkill: (skill: string | undefined) => void;
  placeholder?: string;
  trigger: React.ReactNode;
};
export const PickOneSkill = ({
  targetProfileId,
  placeholder,
  setSkill,
  trigger,
}: PickOneSkillProps) => {
  const { data: profile_skills } = useQuery(
    ['target_give_skills'],
    async () => {
      const { profile_skills } = await client.query(
        {
          profile_skills: [
            {
              where: {
                profile_id: {
                  _eq: targetProfileId,
                },
              },
              order_by: [{ skill_name: order_by.asc }],
            },
            {
              skill_name: true,
            },
          ],
        },
        {
          operationName: 'fetchGiveTargetSkills',
        }
      );
      return profile_skills;
    }
  );

  if (!profile_skills) return null;

  const sortSkills = (
    a: { name: string; count: number },
    b: { name: string; count: number }
  ) => {
    // if the skill is in the profile_skills, then it should be at the top
    if (
      profile_skills.some(skill => skill.skill_name === a.name) &&
      profile_skills.some(skill => skill.skill_name === b.name)
    ) {
      return a.count > b.count ? -1 : 1;
    }
    if (profile_skills.some(skill => skill.skill_name === a.name)) {
      return -1;
    }
    if (profile_skills.some(skill => skill.skill_name === b.name)) {
      return 1;
    }
    return a.count > b.count ? -1 : 1;
  };

  return (
    <SkillComboBox
      excludeSkills={[]}
      addSkill={async (skill: string) => {
        setSkill(skill);
      }}
      placeholder={placeholder}
      trigger={trigger}
      sortSkills={sortSkills}
      customRender={(skill, count) => (
        <Flex
          css={{
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text semibold>{skill}</Text>
          {/*TODO: @wingfeatherwave make this whole thing pretty */}
          {profile_skills.some(ps => ps.skill_name === skill) ? (
            <Text tag color={'complete'} size={'xs'}>
              <Zap /> &nbsp;
            </Text>
          ) : (
            <Text tag color={'secondary'} size={'xs'}>
              <User /> {count}
            </Text>
          )}
        </Flex>
      )}
      extraItems={[
        <Command.Item
          color={'cta'}
          key={'noskill'}
          value={'noskill'}
          onSelect={() => setSkill(undefined)}
        >
          <Flex
            css={{
              justifyContent: 'space-between',
              width: '100%',
              gap: '$lg',
            }}
          >
            <Text semibold>
              <GemCoFillSm fa css={{ mr: '$xs' }} /> Just GIVE - no particular
              skill
            </Text>
          </Flex>
        </Command.Item>,
      ]}
    />
  );
};
