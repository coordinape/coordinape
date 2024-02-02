import { useEffect, useRef, useState } from 'react';

import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import { ComboBox } from '../../components/ComboBox';
import { Search } from '../../icons/__generated';
import { POSTS } from '../../pages/colinks/SearchPage';
import { coLinksPaths } from '../../routes/paths';
import { Button, Flex, Modal, Text } from '../../ui';

import { SearchResults } from './SearchResults';

export function isMacBrowser(): boolean {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

export const SearchBox = ({
  placeholder,
  size = 'medium',
  registerKeyDown = true,
}: {
  placeholder?: string;
  size?: 'medium' | 'large';
  registerKeyDown?: boolean;
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setPopoverOpen(false);
  }, [location]);

  useEffect(() => {
    if (registerKeyDown) {
      window.focus();
      window.addEventListener('keydown', keyDownHandler);
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
      };
    }
  }, []);

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
        size={size}
        ref={previouslyFocusedRef}
        onClick={() => openPopover()}
        css={{ width: '100%' }}
      >
        <Flex
          className="cmdkInner"
          css={{ justifyContent: 'space-between', width: '100%' }}
        >
          <Text className="cmdkPlaceholder">
            {placeholder ?? 'Search Anything'}
          </Text>
          <Text className="cmdkKey">{isMacBrowser() ? '⌘' : 'Ctrl-'}K</Text>
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
        <Flex
          css={{
            background: '$surface',
            p: '$sm $sm',
            borderTop: '1px solid $borderDim',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            size="xs"
            color="transparent"
            onClick={() =>
              navigate(
                inputRef.current?.value
                  ? coLinksPaths.searchResult(
                      inputRef.current?.value ?? '',
                      POSTS
                    )
                  : coLinksPaths.search
              )
            }
          >
            <Search />
            View all results
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
