import { useWindowSize } from '@react-hook/window-size';

import { Flex, Panel, Text } from 'ui';
export const cardColumnMinWidth = 1280;
export const ProfileCards = ({
  targetAddress,
  forceDisplay = false,
}: {
  targetAddress: string;
  forceDisplay?: boolean;
}) => {
  const [width] = useWindowSize();
  const suppressCards = width < cardColumnMinWidth;
  if (suppressCards && !forceDisplay) return null;
  return (
    <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
      <Flex column>
        <Panel noBorder>
          <Text>card {targetAddress}</Text>
        </Panel>
      </Flex>
      <Flex column>
        <Panel noBorder>card</Panel>
      </Flex>
    </Flex>
  );
};
