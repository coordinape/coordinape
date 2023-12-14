import { Flex, Text } from 'ui';

export const NotFound = () => {
  return (
    <Flex
      column
      css={{
        gap: '$md',
        pt: '$2xl',
        alignItems: 'flex-start',
        position: 'fixed',
        left: '25%',
      }}
    >
      <Text h2 display color={'warning'}>
        404 Not Found!
      </Text>
      <Text semibold p>
        Thanks for looking under the rock. There is nothing here.
      </Text>
    </Flex>
  );
};
