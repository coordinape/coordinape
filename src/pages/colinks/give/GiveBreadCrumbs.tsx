import { SkillTag } from '../../../features/colinks/SkillTag';
import { ChevronRight } from '../../../icons/__generated';
import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, Text } from '../../../ui';

export const GiveBreadCrumbs = ({
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
        alignItems: 'center',
        // color: '$secondaryText',
        fontSize: '$h1',
      }}
    >
      <AppLink
        inlineLink
        css={{ color: 'inherit', fontSize: '$h1', fontWeight: '$semibold' }}
        to={coLinksPaths.give}
      >
        GIVE
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
            css={{ color: 'inherit', fontWeight: '$semibold' }}
            // as={AppLink}
            to={coLinksPaths.give}
          >
            Skills
          </AppLink>
          <ChevronRight />
          <SkillTag
            skill={skill}
            size={'large'}
            active
            css={{ mb: '-2px', span: { maxWidth: 300 } }}
          />
        </>
      )}
    </Flex>
  );
};
