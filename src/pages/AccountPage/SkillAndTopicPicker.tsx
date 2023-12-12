import assert from 'assert';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { ComboBox } from '../../components/ComboBox';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import useProfileId from '../../hooks/useProfileId';
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

  const { data: profileSkills } = useQuery([QUERY_KEY_PROFILE_SKILLS], () =>
    fetchMySkills(profileId)
  );

  const maxedOut = (profileSkills?.length ?? 0) === MAX_SKILLS;

  return (
    <Panel css={{ alignItems: 'flex-start' }}>
      <Flex column>
        <Text large semibold>
          Skills and Topics
        </Text>
        {profileSkills === undefined && <LoadingIndicator />}
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
                <Text semibold>
                  Add up to {MAX_SKILLS} skills or topics you are interested in
                </Text>
              ) : (
                Array.from(profileSkills).map(s => (
                  <Text
                    tag
                    size="medium"
                    color="complete"
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
            <SkillComboBox
              allowAdd={true}
              onSelect={addSkill}
              show={!maxedOut}
              excludeSkills={Array.from(profileSkills)}
            />
          </Flex>
        </>
      )}
    </Panel>
  );
};

export const SkillComboBox = ({
  show,
  excludeSkills,
  allowAdd,
  onSelect,
}: {
  show: boolean;
  excludeSkills: string[];
  allowAdd: boolean;
  onSelect(skill: string): void;
}) => {
  const { data: skills, isLoading: skillsLoading } = useQuery(
    [QUERY_KEY_ALL_SKILLS],
    fetchSkills
  );

  if (!skills) {
    return <LoadingIndicator />;
  }
  return (
    <Flex>
      <Popover.Root open={!show ? false : undefined}>
        {show && (
          <Flex
            column
            as={Popover.Trigger}
            css={{
              alignItems: 'flex-start',
              gap: '$sm',
              borderRadius: '$3',
            }}
          >
            {/* This TextField is just a popover trigger */}
            <TextField
              placeholder="Search or Add Skill/Topic"
              disabled={!show}
              css={{ width: '302px' }}
              value=""
            />
          </Flex>
        )}
        <PopoverContent
          avoidCollisions={false}
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
              placeholder={'Search or Add Skill/Topic'}
              maxLength={30}
            />

            <Command.List>
              {skillsLoading ? (
                <Command.Loading>
                  <LoadingIndicator />
                </Command.Loading>
              ) : (
                <>
                  {allowAdd && (
                    <AddItem
                      addSkill={onSelect}
                      mySkills={excludeSkills}
                      allSkills={skills}
                    />
                  )}

                  <Command.Group>
                    {skills
                      .filter(
                        sk =>
                          !excludeSkills.some(
                            ps => ps.toLowerCase() === sk.name.toLowerCase()
                          )
                      )
                      .map(skill => (
                        <Command.Item
                          key={skill.name}
                          value={skill.name}
                          onSelect={onSelect}
                          defaultChecked={false}
                          disabled={excludeSkills.some(
                            ps => ps.toLowerCase() === skill.name.toLowerCase()
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
