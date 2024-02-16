import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQueryClient } from 'react-query';

import { SkillComboBox } from '../../components/SkillComboBox/SkillComboBox';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { client } from '../../lib/gql/client';
import { Button, Flex } from '../../ui';

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

  const { mutate: createGive } = useMutation(createGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
    },
    onError: error => {
      showError(error);
    },
  });

  return (
    <>
      <Flex className="clickThrough" column css={{ gap: '$sm' }}>
        {/*{!isMyPost && !myGive && (*/}
        {/*  <Button*/}
        {/*    size={'small'}*/}
        {/*    color={'transparent'}*/}
        {/*    css={{ '&:hover': { color: '$ctaHover' } }}*/}
        {/*    onClick={() => createGive()}*/}
        {/*  >*/}
        {/*    +GIVE*/}
        {/*  </Button>*/}
        {/*)}*/}
        {!isMyPost && !myGive && (
          <>
            <PickOneSkill
              setSkill={skill => createGive(skill)}
              placeholder={'Choose a GIVE Reason'}
              trigger={
                <Button
                  size={'small'}
                  color={'transparent'}
                  css={{ '&:hover': { color: '$ctaHover' } }}
                >
                  +GIVE
                </Button>
              }
            />
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
    />
  );
};
