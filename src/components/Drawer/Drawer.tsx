import React from 'react';

import { styled } from 'stitches.config';

import MuiDrawer from '@material-ui/core/Drawer';

import { ArrowRight } from 'icons/__generated';
import { Flex, Text, Button } from 'ui';

const StyledMuiDrawer = styled(MuiDrawer, {
  '> .MuiDrawer-paper': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'stretch',
    transition: 'width .4s ease',
    border: 1,
    width: 'calc($xl * 12)',
    maxWidth: '95vw',
    marginLeft: '$lg',
  },
});

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const Drawer = ({ open, setOpen, children }: IProps) => {
  return (
    <StyledMuiDrawer
      open
      onClose={() => setOpen(false)}
      variant="persistent"
      anchor="left"
    >
      <Text h2 css={{ my: '$xl', fontSize: '$h1', fontWeights: '$semibold' }}>
        Circle Map
      </Text>
      {open ? (
        <Flex
          css={{
            flexGrow: 1,
            overflowX: 'hidden',
            flexDirection: 'column',
            alignItems: 'center',
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
    </StyledMuiDrawer>
  );
};
