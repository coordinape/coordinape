import React from 'react';

import { ArrowLeft } from '../icons/__generated';

import { Button } from './Button/Button';
import { Text } from './Text/Text';

const BackButton = () => {
  return (
    <Button
      size="small"
      outlined
      css={{
        padding: '$xs $sm',
        color: '$neutral',
        borderColor: '$neutral',
        // this is a temporary workaround until the underlying icon gets fixed to use fill instead of stroke
        '& path': {
          stroke: '$neutral',
        },
        '&:hover': {
          '& path': {
            stroke: '$white',
          },
        },
      }}
    >
      <ArrowLeft />
      <Text color={'inherit'} semibold>
        Back
      </Text>
    </Button>
  );
};

export default BackButton;
