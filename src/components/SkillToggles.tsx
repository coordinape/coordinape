import React from 'react';

import { transparentize } from 'polished';
import { colors } from 'stitches.config';

import { SKILLS } from 'config/constants';
import { Button } from 'ui';

export const SkillToggles = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (newValue: string[]) => void;
}) => {
  const toggleSkill = (name: string) => {
    onChange(
      value.includes(name)
        ? [...value].filter(s => s !== name)
        : [...value, name]
    );
  };

  return (
    <>
      {SKILLS.map(skill => (
        <Button
          key={skill}
          css={{
            color: '$white',
            background: value.includes(skill)
              ? '$secondary'
              : transparentize(0.67, colors.text),
            borderRadius: '$1',
            padding: '$xs $md',
            mb: '$sm',
            mr: '$sm',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              background: value.includes(skill)
                ? '$secondary'
                : '$secondaryText',
              boxShadow: 'none',
            },
          }}
          onClick={e => {
            e.preventDefault();
            toggleSkill(skill);
          }}
        >
          {skill}
        </Button>
      ))}
    </>
  );
};
