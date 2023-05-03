import HintBanner from 'components/HintBanner';
import { EXTERNAL_URL_DOCS } from 'routes/paths';
import { Box, Link, Text } from 'ui';

export const OrgBannerOverview = () => {
  return (
    <HintBanner
      title={'New: Org Membership!'}
      dismissible="org-banner-overview"
    >
      <Text p as="p" css={{ color: 'inherit' }}>
        Invite your community into Coordinape Organizations! Increase engagement
        and transparency by granting Org membership to your whole DAO/Community,
        without them needing to be in circles. Org members can:
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
    </HintBanner>
  );
};
