import { useState } from 'react';

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
  const dismissibleAs = `banner:${dismissible}` || '';
  const isDismissible = dismissible && dismissible.length > 0;
  const localStorageBannerVisibility =
    window.localStorage.getItem(dismissibleAs) === 'false' ? false : true;
  const [bannerVisibility, setBannerVisibility] = useState(
    localStorageBannerVisibility
  );
  const toggleBanner = () => {
    setBannerVisibility(!bannerVisibility);
    if (isDismissible) {
      window.localStorage.setItem(dismissibleAs, `${!bannerVisibility}`);
    }
  };
  if (!localStorageBannerVisibility) return null;

  return (
    <Panel {...{ [type]: true }} css={{ mb: '$lg', position: 'relative' }}>
      {isDismissible && (
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
          maxWidth: '50em',
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
