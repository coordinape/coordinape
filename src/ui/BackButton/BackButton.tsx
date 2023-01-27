import React from 'react';

import { ArrowLeft } from '../../icons/__generated';
import { Button, Text } from 'ui';

const BackButton = () => {
  return (
    <Button
      size="small"
      color="secondary"
      css={{
        padding: '$xs $sm',
        '&:hover': {
          path: {
            stroke: 'currentColor',
          },
        },
      }}
    >
      <ArrowLeft color={'inherit'} />
      <Text color={'inherit'} semibold>
        Back
      </Text>
    </Button>
  );
};

export default BackButton;
