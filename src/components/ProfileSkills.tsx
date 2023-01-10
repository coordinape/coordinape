import { Box } from 'ui';

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
    <>
      {skills.length > 0 &&
        skills.slice(0, max).map(skill => (
          <Box
            key={skill}
            css={{
              margin: '$xxs',
              padding: '$xxs $md',
              background: '$secondary',
              textAlign: 'center',
              fontSize: '$small',
              fontWeight: '$semibold',
              color: '$white',
              borderRadius: 4,
            }}
          >
            {skill}
          </Box>
        ))}
      {isAdmin && (
        <Box
          key="Admin"
          css={{
            margin: '$xxs',
            padding: '$xxs $md',
            background: '$secondaryDark',
            textAlign: 'center',
            fontSize: '$small',
            fontWeight: '$semibold',
            color: '$white',
            borderRadius: 4,
          }}
        >
          Admin
        </Box>
      )}
    </>
  );
};
