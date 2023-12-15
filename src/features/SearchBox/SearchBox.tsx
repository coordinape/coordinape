import { useEffect, useRef, useState } from 'react';

import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';

import { ComboBox } from '../../components/ComboBox';
import { Button, Flex, Modal, Text } from '../../ui';

import { SearchResults } from './SearchResults';

export const SearchBox = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPopoverOpen(false);
  }, [location]);

  useEffect(() => {
    window.focus();
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  function isMacBrowser(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  const keyDownHandler = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      openPopover();
    }
  };

  const previouslyFocusedRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current?.blur();
  }, [location]);

  const openPopover = () => {
    setPopoverOpen(true);
  };
  const closePopover = () => {
    flushSync(() => {
      setPopoverOpen(false);
    });
    previouslyFocusedRef.current?.focus();
  };

  return (
    <>
      <Button
        color="inputStyle"
        ref={previouslyFocusedRef}
        onClick={() => openPopover()}
        css={{ width: '100%' }}
      >
        <Flex
          css={{ justifyContent: 'space-between', width: '100%', px: '$sm' }}
        >
          <Text>Search Anything</Text>
          <Text>{isMacBrowser() ? '⌘' : 'Ctrl-'}K</Text>
        </Flex>
      </Button>

      <Modal
        onOpenChange={() => {
          closePopover();
        }}
        open={popoverOpen}
        css={{ maxWidth: '500px' }}
        cmdk
        closeButtonStyles={{ opacity: 0.2, right: '$md', top: '19px' }}
      >
        <ComboBox fullScreen filter={() => 1}>
          <SearchResults setPopoverOpen={setPopoverOpen} inputRef={inputRef} />
        </ComboBox>
        {/* <Flex
          css={{
            background: '$surface',
            p: '$md $md',
            borderTop: '1px solid $borderDim',
          }}
        >
          <Button size="small" color="primary">
            Search for real
          </Button>
        </Flex> */}
      </Modal>
    </>
  );
};
