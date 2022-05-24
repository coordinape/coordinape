/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReactNode } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { CSS, styled } from 'stitches.config';

// const Content = styled(Popover.Content, {
//   backgroundColor: '$white',
//   borderRadius: '$3',
//   width: '90vw',
//   maxWidth: '650px',
//   padding: '$2xl',
//   margin: 'calc($xl * 2) auto $xl',
//   position: 'relative',
// });

type PopoverProps = {
  children: ReactNode;
  // title?: string;
  // onClose: () => void;
  css?: CSS;
  // open?: boolean;
};
export const PopoverRadix = ({
  children,
  // title,
  // onClose,
  css = {},
}: // open = true,
PopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger>trigger</Popover.Trigger>
      <Popover.Content>
        what is this
        <Popover.Close />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
};
