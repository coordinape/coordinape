import { Dispatch, useEffect, useRef, useState } from 'react';

import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import { ComboBox } from '../../components/ComboBox';
import { Search } from '../../icons/__generated';
import { Button, Flex, Modal, Text } from '../../ui';

export function isMacBrowser(): boolean {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

export const SearchBox = ({
  placeholder,
  size = 'medium',
  registerKeyDown = true,
  viewResultsPathFunc,
  resultsFunc,
}: {
  placeholder?: string;
  size?: 'medium' | 'large';
  registerKeyDown?: boolean;
  viewResultsPathFunc?: (currentInput?: string) => string;
  resultsFunc({
    setPopoverOpen,
    inputRef,
  }: {
    setPopoverOpen: Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }): React.ReactNode;
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
        color="cmdk"
        size={size}
        ref={previouslyFocusedRef}
        onClick={() => openPopover()}
        css={{ width: '100%' }}
      >
        <Flex
          className="cmdkInner"
          css={{ justifyContent: 'space-between', width: '100%', gap: '$sm' }}
        >
          <Text className="cmdkPlaceholder">
            {placeholder ?? 'Search Anything'}
          </Text>
          {registerKeyDown ? (
            <Text className="cmdkKey">{isMacBrowser() ? '⌘' : 'Ctrl-'}K</Text>
          ) : (
            <Text className="cmdkKey">
              <Search />
            </Text>
          )}
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
          {resultsFunc({ setPopoverOpen, inputRef })}
        </ComboBox>
        {viewResultsPathFunc && (
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
                navigate(viewResultsPathFunc(inputRef.current?.value))
              }
            >
              <Search />
              View all results
            </Button>
          </Flex>
        )}
      </Modal>
    </>
  );
};
