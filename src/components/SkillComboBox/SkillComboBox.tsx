import { useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { useQuery } from 'react-query';
import { CSS } from 'stitches.config';

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
  excludeSkills: string[];
  placeholder?: string;
  addSkill(skill: string): Promise<void>;
  defaultOpen?: boolean;
  trigger?: React.ReactNode;
  prependedItems?: React.ReactNode[];
  extraItems?: React.ReactNode[];
  customRender?(skill: string, count: number): React.ReactNode;
  sortSkills?(a: Skill, b: Skill): number;
  popoverCss?: CSS;
  giveSkillSelector?: boolean;
};

export const SkillComboBox = ({
  excludeSkills,
  addSkill,
  defaultOpen = false,
  placeholder = 'Search or Add Interest',
  trigger,
  prependedItems,
  extraItems,
  customRender,
  sortSkills,
  popoverCss,
  giveSkillSelector = false,
}: SkillComboBoxProps) => {
  const fetchSkillsSorted = async () => {
    if (sortSkills) {
      return new Promise<Skill[]>((resolve, reject) => {
        fetchSkills()
          .then(skills => {
            skills.sort(sortSkills);
            resolve(skills);
          })
          .catch(reject);
      });
    }
    return fetchSkills();
  };

  const { data: skills, isLoading } = useQuery(
    [QUERY_KEY_ALL_SKILLS],
    fetchSkillsSorted
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(defaultOpen);

  if (!skills || isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <Popover.Root
      open={popoverOpen}
      defaultOpen={defaultOpen}
      onOpenChange={setPopoverOpen}
    >
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
        {trigger ? (
          trigger
        ) : (
          <TextField
            placeholder={placeholder}
            css={{ width: '302px' }}
            value=""
          />
        )}
      </Flex>
      <PopoverContent
        avoidCollisions={false}
        align={'start'}
        css={{
          background: 'transparent',
          mt: 'calc(-$1xl + 0.5px)',
          p: 0,
          ...popoverCss,
        }}
      >
        <ComboBox
          giveSkillSelector={giveSkillSelector}
          filter={(value, search) => {
            if (value == search.toLowerCase()) {
              return 1;
            } else if (value.includes(search.toLowerCase())) return 0.9;
            return 0;
          }}
        >
          {!isLoading && <>{prependedItems?.map(item => item)}</>}
          <Command.Input
            className="clickProtect"
            ref={inputRef}
            placeholder={placeholder}
            maxLength={30}
          />

          <Command.List>
            {isLoading ? (
              <Command.Loading>LoadingMate</Command.Loading>
            ) : (
              <>
                {extraItems?.map(item => item)}
                <AddItem
                  addSkill={skill =>
                    addSkill(skill).then(() => setPopoverOpen(false))
                  }
                  alreadyAddedSkills={Array.from(excludeSkills)}
                  allSkills={skills}
                />

                <Command.Group
                  heading={
                    <Text semibold color="neutral" size={'xs'}>
                      Choose an Optional Skill Vector
                    </Text>
                  }
                >
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
                        {customRender ? (
                          customRender(skill.name, skill.count)
                        ) : (
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
                        )}
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
