import { Command } from 'cmdk';
import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { SkillComboBox } from '../../components/SkillComboBox/SkillComboBox';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { BoltFill, GemCoFill, GemCoFillSm } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Button, Flex, Text } from '../../ui';
import { OrBar } from 'components/OrBar';
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
      <Flex column css={{ gap: '$sm' }}>
        {!isMyPost && (
          <>
            {myGive ? (
              <Button
                className="clickProtect"
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
      giveSkillSelector
      excludeSkills={[]}
      addSkill={async (skill: string) => {
        setSkill(skill);
      }}
      placeholder={placeholder}
      trigger={trigger}
      sortSkills={sortSkills}
      popoverCss={{ mt: -56 }}
      customRender={skill => (
        <Flex
          css={{
            justifyContent: 'space-between',
            width: '100%',
            px: '$sm',
            '*': { color: '$tagSuccessText' },
          }}
        >
          <Text semibold>
            <GemCoFillSm fa css={{ mr: '$xs' }} />
            {skill}
          </Text>
          {profile_skills.some(ps => ps.skill_name === skill) && (
            <Text tag color={'complete'} size={'xs'}>
              <BoltFill fa />
            </Text>
          )}
        </Flex>
      )}
      prependedItems={[
        <Flex
          column
          key={'header'}
          css={{
            width: '100%',
            p: '$md $md $sm',
            gap: '$sm',
          }}
        >
          <Text variant="label" size="small">
            Use your GIVE
            <br />
            to show your appreciation
          </Text>
          <Command.Item
            color={'cta'}
            key={'noskill'}
            value={'noskill'}
            onSelect={() => setSkill(undefined)}
          >
            <Button
              color="primary"
              size="small"
              css={{
                width: '100%',
                svg: { color: 'currentColor !important' },
              }}
            >
              <GemCoFillSm fa css={{ mr: '$xs' }} /> Just GIVE - no particular
              skill
            </Button>
          </Command.Item>
          <OrBar>Or Choose a GIVE Reason</OrBar>
        </Flex>,
      ]}
    />
  );
};
