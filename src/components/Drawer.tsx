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
          position: 'absolute',
          top: 0,
          bottom: 0,
          flexDirection: 'column',
        }}
      >
        Circle Map
      </Text>
      {open ? (
        <Flex
          column
          alignItems="center"
          css={{
            flexGrow: 1,
            overflowX: 'hidden',
            ml: '$lg',
            position: 'absolute',
            top: 130,
            bottom: 0,
            backgroundColor: 'transparent',
            transition: 'width .4s ease',
            border: 1,
            width: 'calc($xl * 12)',
            maxWidth: '95vw',
            zIndex: 1,
            display: 'grid',
            gridTemplateRows: '1fr 5fr',
          }}
        >
          {children}
        </Flex>
      ) : (
        <Button
          color="secondary"
          size="large"
          onClick={() => setOpen(!open)}
          css={{
            zIndex: 1,
            position: 'absolute',
            top: 130,
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
