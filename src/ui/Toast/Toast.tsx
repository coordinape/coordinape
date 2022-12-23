import { useState } from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { styled } from 'stitches.config';

import { Button, Flex } from 'ui';

const StyledRoot = styled(ToastPrimitive.Root, {
  background: 'white',
  position: 'absolute',
  top: '15px',
  right: '15px',
  zIndex: '5',
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  // --viewport-padding: '25px',
  position: 'fixed',
  border: '1px solid red',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '25px',
  // // padding: var(--viewport-padding),
  gap: '10px',
  width: '390px',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
  outline: 'none',
});

type Props = {
  title: string;
  content?: string;
  children?: any;
};

export const Toast = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <ToastPrimitive.Provider>
      <Button
        onClick={() => {
          if (open) {
            setOpen(false);
            setTimeout(() => {
              setOpen(true);
            }, 400);
          } else {
            setOpen(true);
          }
        }}
      >
        Click Make a Toast
      </Button>
      <StyledRoot open={open} onOpenChange={setOpen}>
        <Flex>
          {props.title && (
            <ToastPrimitive.Title>{props.title}</ToastPrimitive.Title>
          )}
          <ToastPrimitive.Description>
            {props.content}
          </ToastPrimitive.Description>
          {props.children && (
            <ToastPrimitive.Action altText="notification" asChild>
              {props.children}
            </ToastPrimitive.Action>
          )}
          <ToastPrimitive.Close aria-label="Close">
            <span aria-hidden>×</span>
          </ToastPrimitive.Close>
        </Flex>
      </StyledRoot>
      <StyledViewport />
    </ToastPrimitive.Provider>
  );
};
