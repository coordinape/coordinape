import { useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { useQuery } from 'react-query';

import { User } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, PopoverContent, Text, TextField } from '../../ui';
import { ComboBox } from '../ComboBox';
import { LoadingIndicator } from '../LoadingIndicator';

export const QUERY_KEY_ALL_SKILLS = 'skills';
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

type SkillComboBoxProps = {
  hideInput: boolean;
  excludeSkills: string[];
  placeholder?: string;
  addSkill(skill: string): Promise<void>;
};

export const SkillComboBox = ({
  hideInput,
  excludeSkills,
  addSkill,
  placeholder = 'Search or Add Interest',
}: SkillComboBoxProps) => {
  const { data: skills, isLoading } = useQuery(
    [QUERY_KEY_ALL_SKILLS],
    fetchSkills
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  if (!skills || isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
      {!hideInput && (
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
            placeholder={placeholder}
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
            if (value == search.toLowerCase()) {
              return 1;
            } else if (value.includes(search.toLowerCase())) return 0.9;
            return 0;
          }}
        >
          <Command.Input
            ref={inputRef}
            placeholder={placeholder}
            maxLength={30}
          />

          <Command.List>
            {isLoading ? (
              <Command.Loading>LoadingMate</Command.Loading>
            ) : (
              <>
                <AddItem
                  addSkill={skill =>
                    addSkill(skill).then(() => setPopoverOpen(false))
                  }
                  alreadyAddedSkills={Array.from(excludeSkills)}
                  allSkills={skills}
                />

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
                        onSelect={skill =>
                          addSkill(skill).then(() => setPopoverOpen(false))
                        }
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
  );
};

type Skill = Awaited<ReturnType<typeof fetchSkills>>[number];

const AddItem = ({
  addSkill,
  alreadyAddedSkills,
  allSkills,
}: {
  addSkill(skill: string): void;
  alreadyAddedSkills: string[];
  allSkills: Skill[];
}) => {
  const search = useCommandState(state => state.search);
  if (
    search.trim() === '' ||
    allSkills.some(s => s.name.toLowerCase() === search.toLowerCase())
  ) {
    return null;
  }

  if (alreadyAddedSkills.some(s => s.toLowerCase() === search.toLowerCase())) {
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