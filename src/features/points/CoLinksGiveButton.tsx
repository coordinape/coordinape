import { Command } from 'cmdk';
import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQueryClient } from 'react-query';

import { SkillComboBox } from '../../components/SkillComboBox/SkillComboBox';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { GemCoFill, GemCoFillSm, User } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Text } from '../../ui';
import isFeatureEnabled from 'config/features';

import { POINTS_QUERY_KEY } from './PointsBar';

export const CoLinksGiveButton = ({
  activityId,
  isMyPost,
  gives,
}: {
  activityId: number;
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
                noPadding
                color="cta"
                css={{
                  pointerEvents: 'none',
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
                trigger={
                  <>
                    <Button
                      noPadding
                      color="secondary"
                      css={{
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
  setSkill: (skill: string | undefined) => void;
  placeholder?: string;
  trigger: React.ReactNode;
};
export const PickOneSkill = ({
  placeholder,
  setSkill,
  trigger,
}: PickOneSkillProps) => {
  return (
    <SkillComboBox
      excludeSkills={[]}
      addSkill={async (skill: string) => {
        setSkill(skill);
      }}
      placeholder={placeholder}
      trigger={trigger}
      customRender={(skill, count) => (
        <Flex
          css={{
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text semibold>{skill}</Text>
          <Text tag color={'complete'} size={'xs'}>
            <User /> {count}
          </Text>
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
