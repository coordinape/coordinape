import { useRef, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Command, useCommandState } from 'cmdk';
import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { CSS, skillTextStyle } from 'stitches.config';

import { User } from '../../icons/__generated';
import { Flex, PopoverContent, Text, TextField } from '../../ui';
import { ComboBox } from '../ComboBox';
import { LoadingIndicator } from '../LoadingIndicator';

export const QUERY_KEY_SKILLS = 'combobox_skills';

const MAX_POTENTIAL_SKILLS = 1000;
// TODO: maybe this should do server-side filtering but prob not needed for awhile
// that's why there is the commented out where clause.
const fetchSkills = async () => {
  const { colinks_give_count } = await anonClient.query(
    {
      colinks_give_count: [
        {
          where: { skill: { _is_null: false } },
          order_by: [
            { gives_last_30_days: order_by.desc },
            { skill: order_by.asc },
          ],
          limit: MAX_POTENTIAL_SKILLS,
        },
        {
          skill: true,
          gives_last_30_days: true,
        },
      ],
    },
    {
      operationName: 'fetchPotentialSkills',
    }
  );
  return colinks_give_count;
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
  skillQueryKey?: string[];
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
  skillQueryKey = [QUERY_KEY_SKILLS],
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
    skillQueryKey,
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
        avoidCollisions={true}
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
          {!isLoading && (
            <>
              {giveSkillSelector && prependedItems?.length ? (
                <Flex
                  column
                  key={'header'}
                  css={{
                    width: '100%',
                    p: '$md $md 0',
                    gap: '$sm',
                  }}
                >
                  <Text variant="label" size="small">
                    GIVE to show your appreciation
                  </Text>
                  <Command.Group>
                    {prependedItems?.map(item => item)}
                  </Command.Group>
                </Flex>
              ) : (
                <>{prependedItems?.map(item => item)}</>
              )}
            </>
          )}
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

                <Command.Group>
                  {skills
                    .filter(
                      sk =>
                        !excludeSkills.some(
                          ps => ps.toLowerCase() === sk.skill.toLowerCase()
                        )
                    )
                    .map(skill => (
                      <Command.Item
                        key={skill.skill}
                        value={skill.skill}
                        onSelect={skill =>
                          addSkill(skill).then(() => setPopoverOpen(false))
                        }
                        defaultChecked={false}
                        disabled={excludeSkills.some(
                          ps => ps.toLowerCase() === skill.skill.toLowerCase()
                        )}
                      >
                        {customRender ? (
                          customRender(skill.skill, skill.gives_last_30_days)
                        ) : (
                          <Flex
                            css={{
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
                            <Text css={skillTextStyle}>{skill.skill}</Text>
                            <Text tag color={'secondary'} size={'xs'}>
                              <User /> {skill.gives_last_30_days}
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
    allSkills.some(s => s.skill.toLowerCase() === search.toLowerCase())
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
      className="firstToAdd"
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
