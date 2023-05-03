import { NavLink } from 'react-router-dom';

import HintBanner from 'components/HintBanner';
import { EXTERNAL_URL_DOCS, paths } from 'routes/paths';
import { AppLink, Box, Button, Flex, Link, Text } from 'ui';

export const OrgBanner = ({ orgId }: { orgId: number }) => {
  return (
    <HintBanner title={'New: Org Membership!'} dismissible="org-banner">
      <Text p as="p" css={{ color: 'inherit' }}>
        <AppLink inlineLink to={paths.orgMembersAdd(orgId)}>
          Invite your community
        </AppLink>{' '}
        into Coordinape Organizations! Increase engagement and transparency by
        granting{' '}
        <AppLink inlineLink to={paths.orgMembersAdd(orgId)}>
          Org membership
        </AppLink>{' '}
        to your whole DAO/Community, without them needing to be in circles. Org
        members can:
      </Text>
      <Box
        as="ul"
        css={{ my: 0, li: { display: 'list-item', lineHeight: '$base' } }}
      >
        <Text as="li">
          See Activity in the Org and signal support with emoji reactions
        </Text>
        <Text as="li">
          See Activity, membership, and maps of circles within the org
        </Text>
      </Box>
      <Text inline>
        <Link inlineLink href={EXTERNAL_URL_DOCS} target="_blank">
          Check out the docs
        </Link>{' '}
        for more details, and keep an eye out for more new ways for Coordinape
        Org members to engage!
      </Text>
      <Flex css={{ gap: '$md' }}>
        <Button as={NavLink} to={paths.orgMembersAdd(orgId)} color="cta">
          Invite Org Members
        </Button>
      </Flex>
    </HintBanner>
  );
};
