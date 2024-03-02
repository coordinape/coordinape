import assert from 'assert';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { skillTextStyle } from 'stitches.config';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import {
  QUERY_KEY_SKILLS,
  SkillComboBox,
} from '../../components/SkillComboBox/SkillComboBox';
import useProfileId from '../../hooks/useProfileId';
import { X } from '../../icons/__generated';
import { skills_constraint } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, IconButton, Panel, Text } from '../../ui';

const QUERY_KEY_PROFILE_SKILLS = 'profile_skills';

const insertSkill = async (skill: string) => {
  await client.mutate(
    {
      insert_skills_one: [
        {
          object: {
            name: skill,
          },
          on_conflict: {
            constraint: skills_constraint.skills_pkey,
            update_columns: [],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'add_skill',
    }
  );
};

const fetchMySkills = async (profileId: number) => {
  const { profile_skills } = await client.query(
    {
      profile_skills: [
        {
          where: {
            profile_id: {
              _eq: profileId,
            },
          },
        },
        {
          skill_name: true,
        },
      ],
    },
    {
      operationName: 'fetchMySkills',
    }
  );
  return profile_skills.map(ps => ps.skill_name);
};

export const SkillAndTopicPicker = () => {
  const profileId = useProfileId(true);

  const MAX_SKILLS = 8;

  const queryClient = useQueryClient();

  const { mutate: deleteSkill } = useMutation(
    async (skill: string) => {
      assert(profileId);
      return client.mutate(
        {
          delete_profile_skills: [
            {
              where: {
                profile_id: { _eq: profileId },
                skill: { name: { _eq: skill } },
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'delete_profile_skill',
        }
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([QUERY_KEY_PROFILE_SKILLS]);
        await queryClient.invalidateQueries([QUERY_KEY_SKILLS]);
      },
    }
  );

  const { mutate: addSkillToProfile } = useMutation(
    async (skill: string) => {
      await insertSkill(skill);
      return client.mutate(
        {
          insert_profile_skills_one: [
            {
              object: {
                profile_id: profileId,
                skill_name: skill,
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'add_profile_skill',
        }
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([QUERY_KEY_PROFILE_SKILLS]);
      },
    }
  );

  const { data: profileSkills, isLoading: profileSkillsLoading } = useQuery(
    [QUERY_KEY_PROFILE_SKILLS],
    () => fetchMySkills(profileId)
  );

  const maxedOut = (profileSkills?.length ?? 0) === MAX_SKILLS;

  return (
    <Panel css={{ alignItems: 'flex-start' }}>
      <Flex column>
        <Text large semibold>
          Interests
        </Text>
        {(profileSkills === undefined || profileSkillsLoading) && (
          <LoadingIndicator />
        )}
      </Flex>
      {profileSkills !== undefined && (
        <>
          <Flex column>
            <Text css={{ mt: '$sm', mb: '$lg' }}>
              What do you want to discuss on CoLinks?
            </Text>
            <Flex
              css={{
                gap: '$sm',
                mb: '$lg',
                minHeight: '$lg',
                flexWrap: 'wrap',
              }}
            >
              {profileSkills.length === 0 ? (
                <Text semibold>Add up to {MAX_SKILLS} interests</Text>
              ) : (
                Array.from(profileSkills).map(s => (
                  <Text
                    tag
                    size="medium"
                    color="complete"
                    key={s}
                    css={{ pr: 0 }}
                  >
                    <Text css={skillTextStyle}>{s}</Text>
                    <IconButton
                      onClick={() => deleteSkill(s)}
                      css={{ pr: '$sm', width: 'auto' }}
                    >
                      <X size={'xs'} />
                    </IconButton>
                  </Text>
                ))
              )}
            </Flex>
          </Flex>
          <Flex column css={{ gap: '$sm' }}>
            <Text as="label" variant="label">
              {maxedOut ? `${MAX_SKILLS} Interests Max` : `Add Interests`}
            </Text>
            <Flex>
              <SkillComboBox
                excludeSkills={profileSkills}
                addSkill={async (skill: string) => addSkillToProfile(skill)}
              />
            </Flex>
          </Flex>
        </>
      )}
    </Panel>
  );
};
