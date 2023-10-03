import { useEffect, useState } from 'react';

import { styled } from '../stitches.config';
import { Flex, IconButton, Panel, Text } from '../ui';
import { X } from 'icons/__generated';

const HintBanner = ({
  title,
  dismissible,
  type = 'info',
  children,
}: {
  title?: string;
  dismissible?: string;
  type?: 'info' | 'alert';
  children: React.ReactNode;
}) => {
  const dismissibleAs = `banner:${dismissible}`;

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setShowBanner(window.localStorage.getItem(dismissibleAs) !== 'hidden');
  }, []);

  const toggleBanner = () => {
    setShowBanner((prev: boolean) => !prev);
    window.localStorage.setItem(dismissibleAs, 'hidden');
  };

  if (!showBanner) return null;

  return (
    <Panel {...{ [type]: true }} css={{ mb: '$lg', position: 'relative' }}>
      {!!dismissible && (
        <IconButton
          onClick={toggleBanner}
          css={{ position: 'absolute', right: '$md', top: '$md' }}
        >
          <X size="lg" />
        </IconButton>
      )}
      <Flex
        column
        css={{
          gap: '$md',
          width: '100%',
          maxWidth: '$readable',
          alignItems: 'flex-start',
        }}
      >
        {title && (
          <Text h2 as="h2">
            {title}
          </Text>
        )}
        {children}
      </Flex>
    </Panel>
  );
};

export default styled(HintBanner);
