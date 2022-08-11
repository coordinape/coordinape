import React from 'react';

import { Text, Button, Popover, Flex } from 'ui';
import { ArrowIcon } from 'ui/icons/ArrowIcon';

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
            width: 'fit-content',
            justifyContent: 'flex-start',
            ml: '$lg',
          }}
        >
          Filters
          <ArrowIcon
            size="md"
            color={'secondaryText'}
            css={{ marginLeft: 8 }}
          />
        </Button>
      )}
    </Popover>
  );
};
