/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // position: 'fixed',
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

export const ToastViewport = StyledViewport;
export const ToastProvider = ToastPrimitive.Provider;

export const Toast = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    // <StyledRoot open={open} onOpenChange={setOpen}>
    <Flex className="Toastui">
      {props.title && (
        <ToastPrimitive.Title>{props.title}</ToastPrimitive.Title>
      )}
      <ToastPrimitive.Description>{props.content}</ToastPrimitive.Description>
      {props.children && (
        <ToastPrimitive.Action altText="notification" asChild>
          {props.children}
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close aria-label="Close">
        <span aria-hidden>Close ×</span>
      </ToastPrimitive.Close>
    </Flex>
    // </StyledRoot>
  );
};
