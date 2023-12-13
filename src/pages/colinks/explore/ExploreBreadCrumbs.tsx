import { ChevronRight } from '../../../icons/__generated';
import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, Text } from '../../../ui';

export const ExploreBreadCrumbs = ({
  skill,
  subsection,
}: {
  skill?: string;
  subsection?: string;
}) => {
  return (
    <Flex
      css={{
        gap: '$sm',
        mt: '$lg',
        alignItems: 'center',
        color: '$secondaryText',
      }}
    >
      <AppLink inlineLink css={{ color: 'inherit' }} to={coLinksPaths.explore}>
        Explore
      </AppLink>
      <ChevronRight />
      {subsection && (
        <Text css={{ color: '$text' }} semibold>
          {subsection}
        </Text>
      )}
      {skill && (
        <>
          <AppLink
            inlineLink
            css={{ color: 'inherit' }}
            // as={AppLink}
            to={coLinksPaths.exploreSkills}
          >
            Interests
          </AppLink>
          <ChevronRight />
          <Text css={{ color: '$text' }} semibold>
            {skill}
          </Text>
        </>
      )}
    </Flex>
  );
};
