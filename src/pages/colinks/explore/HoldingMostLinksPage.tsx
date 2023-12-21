import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const HoldingMostLinksPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has bought the most links?</Text>
          <ExploreBreadCrumbs subsection={'Holding Most'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['HOLDING_MOST_LINKS']}
          where={{}}
          orderBy={[{ links_held: order_by.desc, name: order_by.desc }]}
          includeRank={true}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
