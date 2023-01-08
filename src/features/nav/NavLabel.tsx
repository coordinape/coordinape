import { Box, Text } from '../../ui';

export const NavLabel = ({ label }: { label: string }) => {
  return (
    <Box>
      <Text variant="label">{label}</Text>
    </Box>
  );
};
