import React from 'react';

import { Button } from '../../ui';

export const ReactionButton = ({
  myReaction,
  ...props
}: {
  myReaction?: number;
} & React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      outlined={myReaction ? undefined : true}
      color={myReaction ? 'primary' : 'neutral'}
      size="xs"
      css={{
        /*TODO: i dont know why i need these assymetric paddings , also don't work for the svg icon*/
        pt: 6,
        pb: 4,
        ml: '$xs',
        alignItems: 'center',
      }}
    ></Button>
  );
};
