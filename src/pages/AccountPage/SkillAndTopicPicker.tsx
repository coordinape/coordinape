import assert from 'assert';
import { useRef } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { ComboBox } from '../../components/ComboBox';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useAuthStore } from '../../features/auth';
import { User, X } from '../../icons/__generated';
import { order_by, skills_constraint } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import {
  Flex,
  IconButton,
  Panel,
  PopoverContent,
  Text,
  TextField,
} from '../../ui';

const QUERY_KEY_PROFILE_SKILLS = 'profile_skills';
const QUERY_KEY_ALL_SKILLS = 'skills';

const MAX_POTENTIAL_SKILLS = 1000;

// TODO: maybe this should do server-side filtering but prob not needed for awhile
// that's why there is the commented out where clause.
const fetchSkills = async () => {
  const { skills } = await client.query(
    {
      skills: [
        {
          // where: query
          //   ? {
          //       name: {
          //         _ilike: '%' + query + '%',
          //       },
          //     }
          //   : undefined,
          order_by: [{ count: order_by.desc }, { name: order_by.asc }],
          limit: MAX_POTENTIAL_SKILLS,
        },
        {
          name: true,
          count: true,
        },
      ],
    },
    {
      operationName: 'fetchPotentialSkills',
    }
  );
  return skills;
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
  const profileId = useAuthStore(state => state.profileId) ?? -1;

  // TODO: this is annoying
  assert(profileId);

  const MAX_SKILLS = 5;

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
        await queryClient.invalidateQueries([QUERY_KEY_ALL_SKILLS]);
      },
    }
  );

  const { mutate: addSkill } = useMutation(
    async (skill: string) => {
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
  const { data: skills, isLoading: skillsLoading } = useQuery(
    [QUERY_KEY_ALL_SKILLS],
    fetchSkills
  );
  const { data: profileSkills, isLoading: profileSkillsLoading } = useQuery(
    [QUERY_KEY_PROFILE_SKILLS],
    () => fetchMySkills(profileId)
  );

  const isLoading = profileSkillsLoading || skillsLoading;

  const maxedOut = (profileSkills?.length ?? 0) === MAX_SKILLS;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Panel css={{ alignItems: 'flex-start' }}>
      <Flex column>
        <Text large semibold>
          Skills and Topics
        </Text>
        {skills === undefined ||
          (profileSkills === undefined && <LoadingIndicator />)}
      </Flex>
      {skills !== undefined && profileSkills !== undefined && (
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
                <Text semibold>
                  Add up to {MAX_SKILLS} skills or topics you are interested in
                </Text>
              ) : (
                Array.from(profileSkills).map(s => (
                  <Text
                    tag
                    size="medium"
                    color="secondary"
                    key={s}
                    css={{ pr: 0 }}
                  >
                    {s}
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
              {maxedOut ? `${MAX_SKILLS} Skills Max` : `Add Skills/Topics`}
            </Text>
            <Flex>
              <Popover.Root open={maxedOut ? false : undefined}>
                {!maxedOut && (
                  <Flex
                    column
                    as={Popover.Trigger}
                    css={{ alignItems: 'flex-start', gap: '$sm' }}
                  >
                    {/* This TextField is just a popover trigger */}
                    <TextField
                      placeholder="Search or Add Skill/Topic"
                      disabled={maxedOut}
                      css={{ width: '302px' }}
                      value=""
                    />
                  </Flex>
                )}
                <PopoverContent
                  align={'start'}
                  css={{
                    background: 'transparent',
                    mt: 'calc(-$1xl + 0.5px)',
                    p: 0,
                  }}
                >
                  <ComboBox
                    filter={(value, search) => {
                      if (value == search) {
                        return 1;
                      } else if (value.includes(search)) return 0.9;
                      return 0;
                    }}
                  >
                    <Command.Input
                      ref={inputRef}
                      placeholder={'Search or Add Skill/Topic'}
                      maxLength={30}
                    />

                    <Command.List>
                      {isLoading ? (
                        <Command.Loading>LoadingMate</Command.Loading>
                      ) : (
                        <>
                          <AddItem
                            addSkill={addSkill}
                            mySkills={Array.from(profileSkills)}
                            allSkills={skills}
                          />

                          <Command.Group>
                            {skills
                              .filter(
                                sk =>
                                  !profileSkills.some(
                                    ps =>
                                      ps.toLowerCase() === sk.name.toLowerCase()
                                  )
                              )
                              .map(skill => (
                                <Command.Item
                                  key={skill.name}
                                  value={skill.name}
                                  onSelect={addSkill}
                                  defaultChecked={false}
                                  disabled={profileSkills.some(
                                    ps =>
                                      ps.toLowerCase() ===
                                      skill.name.toLowerCase()
                                  )}
                                >
                                  <Flex
                                    css={{
                                      justifyContent: 'space-between',
                                      width: '100%',
                                    }}
                                  >
                                    <Text semibold>{skill.name}</Text>
                                    <Text tag color={'secondary'} size={'xs'}>
                                      <User /> {skill.count}
                                    </Text>
                                  </Flex>
                                </Command.Item>
                              ))}
                          </Command.Group>
                        </>
                      )}
                    </Command.List>
                  </ComboBox>
                </PopoverContent>
              </Popover.Root>
            </Flex>
          </Flex>
        </>
      )}
    </Panel>
  );
};

type Skill = Awaited<ReturnType<typeof fetchSkills>>[number];

const AddItem = ({
  addSkill,
  mySkills,
  allSkills,
}: {
  addSkill(skill: string): void;
  mySkills: string[];
  allSkills: Skill[];
}) => {
  const search = useCommandState(state => state.search);
  if (
    search.trim() === '' ||
    allSkills.some(s => s.name.toLowerCase() === search.toLowerCase())
  ) {
    return null;
  }

  if (mySkills.some(s => s.toLowerCase() === search.toLowerCase())) {
    return (
      <Command.Item color={'cta'} key={search} value={search} disabled={true}>
        <Text semibold>Already added {search}</Text>
      </Command.Item>
    );
  }

  return (
    <Command.Item
      color={'cta'}
      key={search}
      value={search}
      onSelect={() => addSkill(search)}
    >
      <Flex
        css={{ justifyContent: 'space-between', width: '100%', gap: '$lg' }}
      >
        <Text>Be the First to Add</Text>
        <Text tag color={'complete'} semibold size={'medium'}>
          {search}
        </Text>
      </Flex>
    </Command.Item>
  );
};
