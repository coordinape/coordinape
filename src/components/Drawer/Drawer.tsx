import React from 'react';

import { ArrowRight } from 'icons/__generated';
import { Text, Button, Popover, Flex } from 'ui';

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const Drawer = ({ open, setOpen, children }: IProps) => {
  return (
    <Popover open={open}>
      <Text
        h2
        css={{
          my: '$xl',
          fontSize: '$h1',
          fontWeights: '$semibold',
          ml: '$lg',
        }}
      >
        Circle Map
      </Text>
      {open ? (
        <Flex
          css={{
            flexGrow: 1,
            overflowX: 'hidden',
            flexDirection: 'column',
            alignItems: 'center',
            ml: '$lg',
            position: 'absolute',
            top: 100,
            bottom: 0,
            backgroundColor: 'transparent',
            display: 'flex',
            transition: 'width .4s ease',
            border: 1,
            width: 'calc($xl * 12)',
            maxWidth: '95vw',
            zIndex: 1,
          }}
        >
          {children}
        </Flex>
      ) : (
        <Button
          outlined
          size="large"
          onClick={() => setOpen(!open)}
          css={{
            zIndex: 1,
            position: 'absolute',
            top: 100,
            bottom: 0,
            width: 'fit-content',
            height: 'fit-content',
            justifyContent: 'flex-start',
            ml: '$lg',
          }}
        >
          Filters
          <ArrowRight
            size="md"
            color={'secondaryText'}
            css={{ marginLeft: 8 }}
          />
        </Button>
      )}
    </Popover>
  );
};
