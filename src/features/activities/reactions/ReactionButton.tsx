import React from 'react';

import { Button } from '../../../ui';

export const ReactionButton = ({
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      size="xs"
      color="reaction"
      css={{
        /*TODO: i dont know why i need these assymetric paddings , also don't work for the svg icon*/
        alignItems: 'center',
        padding: 0,
        px: 4,
        pt: 1,
        ...props.css,
      }}
    ></Button>
  );
};
