import { Flex, Text } from 'ui';

export const ProfileSkills = ({
  skills,
  isAdmin,
  max = 3,
}: {
  skills: string[];
  isAdmin: boolean;
  max: number;
}) => {
  return (
    <Flex css={{ gap: '$xs' }}>
      {skills.length > 0 &&
        skills.slice(0, max).map(skill => (
          <Text tag color="secondary" key={skill}>
            {skill}
          </Text>
        ))}
      {isAdmin && (
        <Text tag color="neutral" key="Admin">
          Admin
        </Text>
      )}
    </Flex>
  );
};
