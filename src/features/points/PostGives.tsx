import useProfileId from '../../hooks/useProfileId';
import { Flex, IconButton, Text } from '../../ui';
import { X } from 'icons/__generated';

export const PostGives = ({
  gives,
  clearSkill,
}: {
  clearSkill: () => void;
  gives: {
    id: number;
    skill?: string;
    giver_profile_public?: {
      name?: string;
      id?: number;
    };
  }[];
}) => {
  const profileId = useProfileId(true);

  return (
    <>
      <Flex css={{ gap: '$sm' }}>
        {gives.map(g => (
          <Flex key={g.id} css={{ gap: '$md' }}>
            <Text tag size="medium" color="complete">
              {g.skill}
              {g.giver_profile_public?.id === profileId && (
                <IconButton
                  onClick={() => clearSkill()}
                  css={{ pr: '$sm', width: 'auto' }}
                >
                  <X size={'xs'} />
                </IconButton>
              )}
            </Text>
            {/* <Text size="xs" semibold key={g.id}>
              from{' '}
              {g.giver_profile_public?.id === profileId
                ? 'You'
                : g.giver_profile_public?.name}
            </Text> */}
          </Flex>
        ))}
      </Flex>
    </>
  );
};
