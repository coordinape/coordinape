import { Flex, Text } from 'ui';

export const NotFound = () => {
  return (
    <Flex column css={{ position: 'fixed', top: '25%', left: '25%' }}>
      <Text color={'alert'}>404 Not Found</Text>
      <Text p>The requested url was not found on this server</Text>
    </Flex>
  );
};
