import React from 'react';

import { ArrowLeft } from '../../icons/__generated';
import { Button, Text } from 'ui';

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
          path: {
            stroke: '$white',
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
