import { CSS } from '@stitches/react';
import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';

import { Flex, Text } from 'ui';

export const NotFound = ({
  header = '404 Not Found',
  children,
  backgroundImage = '/imgs/background/colink-404.jpg',
  imageCss,
  gradientCss,
}: {
  header?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
  imageCss?: CSS;
  gradientCss?: CSS;
}) => {
  return (
    <>
      <Flex css={{ position: 'relative' }}>
        <WizardInstructions suppressHeader>
          <Flex column css={{ gap: '$md' }}>
            <Text semibold css={{ fontSize: '$h2' }}>
              {header}
            </Text>
            {children || (
              <Text p as="p">
                Thanks for looking in this chest.
                <br />
                There is nothing here.
              </Text>
            )}
          </Flex>
        </WizardInstructions>

        <Flex
          css={{
            ...fullScreenStyles,
            position: 'absolute',
            zIndex: '0',
            width: '100%',
            background:
              'radial-gradient(circle, #E3A102 10%, #5D778F 68%, #2D3C49 83%, #C1D5E1 100%)',
            ...gradientCss,
          }}
        />
        <Flex
          css={{
            ...fullScreenStyles,
            width: '100%',
            position: 'absolute',
            zIndex: '1',
            animationDirection: 'alternate',
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: '50% 50% ',
            ...imageCss,
          }}
        />
      </Flex>
    </>
  );
};
