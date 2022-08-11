import React, { useState } from 'react';

import { styled } from '@stitches/react';
import { PopupButton } from '@typeform/embed-react';

import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_MAILTO_SUPPORT,
  EXTERNAL_URL_SCHEDULE_WALKTHROUGH,
} from '../routes/paths';
import { Button, Flex } from '../ui';
import { Box } from '../ui/Box/Box';
import { ClockIcon } from '../ui/icons/ClockIcon';
import { CloseIcon } from '../ui/icons/CloseIcon';
import { DiscordIcon } from '../ui/icons/DiscordIcon';
import { DocumentIcon } from '../ui/icons/DocumentIcon';
import { EnvelopeIcon } from '../ui/icons/EnvelopeIcon';
import { GiveArrowsIcon } from '../ui/icons/GiveArrowsIcon';
import { Text } from '../ui/Text/Text';

const HelpButtonContainer = styled('div', {
  position: 'fixed',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: '$sm',
  bottom: '$1xl',
  right: '$1xl',
  backgroundColor: '$background',
  color: '$text',
  textAlign: 'center',
  boxShadow: '$shadow4',
  transition: '$quick',
  overflow: 'hidden',
  zIndex: 3,
  '&[data-open="true"]': {
    width: '270px', // magic number to make it look nice and not be crazy on mobile -g
    height: '298px', // magic number, yep. If i do auto the animations are terrible -g
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
        color={'transparent'}
        fullWidth={true}
        css={{ paddingLeft: '0px' }}
      >
        <Flex
          css={{
            alignItems: 'center',
          }}
        >
          <Flex css={{ mr: '$sm', alignItems: 'center', color: '$text' }}>
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
          css={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Text semibold css={{ fontSize: '$h2' }}>
            ?
          </Text>
        </Flex>
      </Box>
      <Box className={'open-contents'}>
        <Flex>
          <Text css={{ flexGrow: 1 }} bold h3>
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
            <CloseIcon size={'md'} color={'inherit'} />
          </Box>
        </Flex>
        <div>
          <Text size="small" css={{ mt: '$sm', mb: '$lg' }}>
            Ask us anything
          </Text>
        </div>
        <HelpOption
          href={EXTERNAL_URL_DISCORD}
          icon={<DiscordIcon size={'md'} color={'text'} />}
        >
          Ask on Discord
        </HelpOption>
        <HelpOption
          href={EXTERNAL_URL_MAILTO_SUPPORT}
          icon={<EnvelopeIcon size={'md'} color={'text'} />}
        >
          Email Us
        </HelpOption>
        <HelpOption
          href={EXTERNAL_URL_SCHEDULE_WALKTHROUGH}
          icon={<ClockIcon size={'md'} color={'text'} />}
        >
          Schedule a Walkthrough
        </HelpOption>
        <Button
          color={'transparent'}
          fullWidth={true}
          css={{ paddingLeft: '0px' }}
        >
          <PopupButton
            as="div"
            id="nvOUfHKN"
            className="my-button"
            style={{ marginTop: 0 }}
          >
            <Flex
              css={{
                alignItems: 'center',
              }}
            >
              <Flex css={{ mr: '$sm', alignItems: 'center', color: '$text' }}>
                <GiveArrowsIcon size={'md'} color={'text'} />
              </Flex>
              Share Feedback
            </Flex>
          </PopupButton>
        </Button>
        <Box css={{ borderTop: '0.5px solid $borderMedium', mt: '$sm' }}>
          <HelpOption
            href={EXTERNAL_URL_DOCS}
            icon={<DocumentIcon size={'md'} color={'text'} />}
          >
            Documentation
          </HelpOption>
        </Box>
      </Box>
    </HelpButtonContainer>
  );
};

export default HelpButton;
