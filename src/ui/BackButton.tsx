import React from 'react';

import { ArrowLeft } from '../icons/__generated';

import { Button } from './Button/Button';
import { Text } from './Text/Text';

const BackButton = () => {
  return (
    <Button
      size="small"
      color="neutral"
      outlined
      css={{
        padding: '$xs $sm',
        // color: '$neutral',
        // borderColor: '$neutral',
        '&:hover': {
          '& path': {
            fill: '$white',
          },
        },
      }}
    >
      <ArrowLeft color={'neutral'} />
      <Text color={'inherit'} semibold>
        Back
      </Text>
    </Button>
  );
};

export default BackButton;
