import { useState } from 'react';

import { Command } from 'cmdk';
import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { skillTextStyle } from 'stitches.config';

import {
  QUERY_KEY_SKILLS,
  SkillComboBox,
} from '../../components/SkillComboBox/SkillComboBox';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { GemCoOutline, Plus } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, Modal, Text } from '../../ui';

import { GiveAvailablePopover } from './GiveAvailablePopover';
import { GIVE_RECEIVED_QUERY_KEY } from './GiveReceived';
import { POINTS_QUERY_KEY, usePoints } from './usePoints';

const DISMISSIBLE_AS = `banner:colinks_give_intro`;

export const CoLinksGiveButton = ({
  activityId,
  castHash,
  targetAddress,
  targetProfileId,
  isMyPost = false,
  cta = false,
  gives,
}: {
  activityId?: number;
  castHash?: string;
  targetAddress?: string;
  targetProfileId?: number;
  isMyPost?: boolean;
  cta?: boolean;
  gives: {
    id: number;
    skill?: string;
    giver_profile_public?: {
      name?: string;
      id?: number;
    };
  }[];
}) => {
  const profileId = useProfileId(false);
  const { showError, showSuccess } = useToast();

  const queryClient = useQueryClient();

  const myGive = gives.find(
    give => give.giver_profile_public?.id === profileId
  );

  const [showBanner, setShowBanner] = useState(false);

  const shouldShowModal = () => {
    setShowBanner(!window.localStorage.getItem(DISMISSIBLE_AS));
  };

  const dismissModal = () => {
    setShowBanner(false);
    window.localStorage.setItem(DISMISSIBLE_AS, 'hidden');
  };

  const { points, canGive } = usePoints();

  const createGiveMutation = (skill: string | undefined) => {
    return client.mutate(
      {
        createCoLinksGive: [
          {
            payload: {
              activity_id: activityId,
              cast_hash: castHash,
              address: targetAddress,
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

  const invalidateProfileGives = () => {
    queryClient.invalidateQueries([GIVE_RECEIVED_QUERY_KEY, targetProfileId]);
  };

  const invalidatePointsBar = () => {
    queryClient.invalidateQueries([POINTS_QUERY_KEY]);
  };

  const { mutate: createGive } = useMutation(createGiveMutation, {
    onSuccess: () => {
      invalidateActivities();
      invalidateProfileGives();
      invalidatePointsBar();
      showSuccess('GIVE delivered!');
    },
    onError: error => {
      showError(error);
    },
  });

  if (!profileId) {
    return null;
  }
  return (
    <>
      <Flex column css={{ cursor: 'default', gap: '$sm' }}>
        {!isMyPost && (
          <>
            {myGive ? (
              <>
                <Button
                  className="clickProtect"
                  as="span"
                  color="dim"
                  size="small"
                  css={{
                    pointerEvents: 'none',
                    cursor: 'default',
                    p: '3px 7px',
                    height: 'auto',
                    minHeight: 0,
                    fontSize: '$small',
                    borderRadius: '4px',
                    background: 'linear-gradient(.33turn, $cta 23%, $complete)',
                    boxShadow: '#1e00312e -2px -2px 7px 1px inset',
                    color: '$background',
                  }}
                >
                  <GemCoOutline fa size="md" css={{ mr: '$xs' }} />
                  GIVE
                </Button>
              </>
            ) : (
              <>
                {points && canGive ? (
                  <PickOneSkill
                    setSkill={skill => createGive(skill)}
                    placeholder={'Or Support a Skill with GIVE...'}
                    targetProfileId={targetProfileId}
                    trigger={
                      <>
                        <Button
                          className="giveButton "
                          as="span"
                          color="dim"
                          onClick={shouldShowModal}
                          size={cta ? 'large' : 'small'}
                          css={{
                            ...(cta
                              ? {
                                  minHeight: '$xl',
                                  padding: '$sm calc($sm + $xs)',
                                  fontSize: '$medium',
                                  fontWeight: '$medium',
                                  lineHeight: '$none',
                                  borderRadius: '$4',
                                  backgroundColor: '$cta',
                                  color: '$textOnCta',
                                  '&:hover': {
                                    backgroundColor: '$ctaHover',
                                  },
                                }
                              : {
                                  p: '3px 7px',
                                  height: 'auto',
                                  minHeight: 0,
                                  fontSize: '$small',
                                  borderRadius: '4px',
                                  '&:hover': {
                                    background: '$tagLinkBackground',
                                    color: '$tagLinkText',
                                  },
                                }),
                          }}
                        >
                          <GemCoOutline fa size="md" css={{ mr: '$xs' }} />
                          +GIVE
                        </Button>
                      </>
                    }
                  />
                ) : (
                  <GiveAvailablePopover giveCharging cta={cta} />
                )}
              </>
            )}
          </>
        )}
      </Flex>
      {showBanner && (
        <Modal
          open={true}
          onOpenChange={dismissModal}
          css={{ maxWidth: '540px', p: 0, border: 'none' }}
        >
          <Flex
            className="art"
            onClick={dismissModal}
            css={{
              flexGrow: 1,
              height: '100%',
              width: '100%',
              minHeight: '280px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-give.jpg')",
            }}
          />
          <Flex column css={{ gap: '$md', p: '$lg' }}>
            <Text h1 semibold>
              <GemCoOutline fa size="xl" css={{ mr: '$sm' }} />
              So, you want to send a GIVE?
            </Text>
            <Text>
              Yes please! GIVE is a scarce signaling mechanism which you accrue
              over time.
            </Text>
            <Text semibold>
              You can use your GIVE in CoLinks by allocating to a post, to
              signal support for ideas and skills.
            </Text>
            <Text>
              GIVE you send will become an element of CoSouls&apos; onchain
              reputation.
            </Text>
            <Button onClick={dismissModal}>Got it!</Button>
          </Flex>
        </Modal>
      )}
    </>
  );
};

type PickOneSkillProps = {
  targetProfileId?: number;
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
    ['target_give_skills', targetProfileId],
    async () => {
      if (!targetProfileId) {
        return [];
      }
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
              profile_public: {
                avatar: true,
                name: true,
              },
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
    const a_name = a.name.toLowerCase();
    const b_name = b.name.toLowerCase();

    if (
      profile_skills.some(skill => skill.skill_name.toLowerCase() === a_name) &&
      profile_skills.some(skill => skill.skill_name.toLowerCase() === b_name)
    ) {
      return a.count > b.count ? -1 : 1;
    }
    if (
      profile_skills.some(skill => skill.skill_name.toLowerCase() === a_name)
    ) {
      return -1;
    }
    if (
      profile_skills.some(skill => skill.skill_name.toLowerCase() === b_name)
    ) {
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
      skillQueryKey={[
        QUERY_KEY_SKILLS,
        targetProfileId ? targetProfileId.toString() : '',
      ]}
      popoverCss={{ mt: -40, mx: 6 }}
      customRender={skill => {
        const skillOnProfile = profile_skills.find(
          s => s.skill_name.toLowerCase() === skill.toLowerCase()
        );
        const profile = skillOnProfile?.profile_public;
        return (
          <Flex
            css={{
              justifyContent: 'space-between',
              width: '100%',
              borderRadius: '$4 !important',
              height: '$xl',
              alignItems: 'center',
              px: '$sm',
              border: '1px solid',
              color: '$tagSuccessText',
              ...(skillOnProfile
                ? {
                    borderColor: '$tagSuccessText',
                    backgroundColor: '$tagSuccessBackground',
                  }
                : {
                    borderColor: 'transparent',
                  }),

              '&:not(button)': {
                '&:hover, &[data-selected="true"]': {
                  backgroundColor: '$tagSuccessText',
                  color: '$tagSuccessBackground',
                },
              },
            }}
          >
            <Text>
              <Plus css={{ mr: '$xs' }} />
              <GemCoOutline fa css={{ mr: '$xs' }} />
              <Text css={skillTextStyle}>{skill}</Text>
            </Text>
            {skillOnProfile && (
              <Avatar path={profile?.avatar} name={profile?.name} size="xs" />
            )}
          </Flex>
        );
      }}
      prependedItems={[
        <Flex
          key={'noskill'}
          css={{
            '[cmdk-item]': {
              p: 0,
              width: '100%',
              height: 'auto',
              background: 'transparent !important',
              border: 'none',
            },
          }}
        >
          <Command.Item
            color={'cta'}
            value={'noskill'}
            onSelect={() => setSkill(undefined)}
          >
            <Button
              as="span"
              color="complete"
              size="small"
              css={{
                width: '100%',
                height: 'auto',
                maxHeight: 'none',
              }}
            >
              <Flex
                column
                css={{ alignItems: 'center', width: '100%', gap: '$xs' }}
              >
                <Text css={{ fontWeight: '$medium' }}>
                  <GemCoOutline fa css={{ mr: '$xs' }} /> Just GIVE
                </Text>
              </Flex>
            </Button>
          </Command.Item>
        </Flex>,
      ]}
    />
  );
};
