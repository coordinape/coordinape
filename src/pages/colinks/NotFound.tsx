import { Flex, Text } from 'ui';

export const NotFound = () => {
  return (
    <Flex column css={{ position: 'fixed', top: '25%', left: '25%' }}>
      <Text color={'alert'}>404 Not Found</Text>
      <Text p>Thanks for looking under the rock. There is nothing here.</Text>
    </Flex>
  );
};
