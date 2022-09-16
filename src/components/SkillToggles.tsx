import React from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { makeStyles, Button } from '@material-ui/core';

import { SKILLS } from 'config/constants';

const useStyles = makeStyles(theme => ({
  skillOption: {
    color: theme.colors.white,
    background: transparentize(0.67, theme.colors.text),
    borderRadius: 4,
    padding: '5px 16px',
    marginBottom: 8,
    marginRight: 8,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      background: theme.colors.secondaryText,
      boxShadow: 'none',
    },
    '&.selected': {
      background: theme.colors.secondary,
    },
  },
}));

export const SkillToggles = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (newValue: string[]) => void;
}) => {
  const classes = useStyles();

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
          variant="contained"
          className={clsx(
            classes.skillOption,
            value.includes(skill) ? 'selected' : ''
          )}
          onClick={() => toggleSkill(skill)}
        >
          {skill}
        </Button>
      ))}
    </>
  );
};
