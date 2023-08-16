import React, { useState } from 'react';

import { styled } from '@stitches/react';

import { Clock, Discord, FileText, Mail, X } from '../icons/__generated';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_MAILTO_SUPPORT,
  EXTERNAL_URL_SCHEDULE_WALKTHROUGH,
} from '../routes/paths';
import { Button, Flex } from '../ui';
import { Box } from '../ui/Box/Box';
import { Text } from '../ui/Text/Text';

const HelpButtonContainer = styled('div', {
  position: 'fixed',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: '$sm',
  bottom: '$1xl',
  right: '$1xl',
  backgroundColor: '$dim',
  color: '$text',
  textAlign: 'center',
  boxShadow: '$shadow4',
  transition: '$quick',
  overflow: 'hidden',
  zIndex: 3,
  '&[data-open="true"]': {
    width: '270px', // magic number to make it look nice and not be crazy on mobile -g
    height: '300px', // magic number, yep. If i do auto the animations are terrible -g
    borderRadius: '$3',
    '.help-icon': {
      transition: null,
      opacity: 0,
      visibility: 'hidden',
    },
    '.open-contents': {
      opacity: 1.0,
      transition: 'opacity 0.2s ease-in',
      visibility: 'visible',
    },
  },
  '&[data-open="false"]': {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '$surface',
    },
  },
  '.help-icon': {
    opacity: 1.0,
    transition: 'opacity 0.2s ease-in',
    visibility: 'visible',
  },
  '.open-contents': {
    padding: '$sm $sm',
    transition: null,
    opacity: 0,
    visibility: 'hidden',
  },
  button: {
    justifyContent: 'left',
    marginTop: '$sm',
    color: '$text',
  },
  a: {
    textDecoration: 'none',
  },
});

const HelpOption = ({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <a href={href} target={'_blank'} rel={'noreferrer'}>
      <Button
        size="small"
        color={'transparent'}
        fullWidth={true}
        css={{ paddingLeft: '0px' }}
      >
        <Flex alignItems="center">
          <Flex alignItems="center" css={{ mr: '$sm', color: '$text' }}>
            {icon}
          </Flex>
          {children}
        </Flex>
      </Button>
    </a>
  );
};

const HelpButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <HelpButtonContainer data-open={`${open}`} onClick={() => setOpen(true)}>
      <Box
        className={'help-icon'}
        css={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
        }}
      >
        <Flex
          alignItems="center"
          css={{
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Text semibold h1>
            ?
          </Text>
        </Flex>
      </Box>
      <Box className={'open-contents'}>
        <Flex>
          <Text css={{ flexGrow: 1 }} bold large>
            Need Help?
          </Text>
          <Box
            onClick={e => {
              e.stopPropagation();
              setOpen(false);
            }}
            css={{
              mt: '-4px',
              color: '$neutral',
              cursor: 'pointer',
              '&:hover': {
                color: '$text',
              },
            }}
          >
            <X size={'md'} color={'inherit'} />
          </Box>
        </Flex>
        <Box css={{ mt: '$sm' }}>
          <Text size="small" css={{ mt: '$sm', mb: '$md' }}>
            Ask us anything
          </Text>
        </Box>
        <HelpOption
          href={EXTERNAL_URL_DISCORD}
          icon={<Discord size={'md'} color={'text'} />}
        >
          Ask on Discord
        </HelpOption>
        <HelpOption
          href={EXTERNAL_URL_MAILTO_SUPPORT}
          icon={<Mail size={'md'} color={'text'} />}
        >
          Email Us
        </HelpOption>
        <HelpOption
          href={EXTERNAL_URL_SCHEDULE_WALKTHROUGH}
          icon={<Clock size={'md'} color={'text'} />}
        >
          Schedule a Walkthrough
        </HelpOption>
        <Box css={{ borderTop: '0.5px solid $border', mt: '$sm' }}>
          <HelpOption
            href={EXTERNAL_URL_DOCS}
            icon={<FileText size={'md'} color={'text'} />}
          >
            Documentation
          </HelpOption>
        </Box>
      </Box>
    </HelpButtonContainer>
  );
};

export default HelpButton;
