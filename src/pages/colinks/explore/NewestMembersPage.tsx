import { Helmet } from 'react-helmet';

import { InfiniteMembersList } from '../../../features/colinks/InifiniteMembersList';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const NewestMemberPage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Newest Members / Explore / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Newest CoLinks Members</Text>
          <ExploreBreadCrumbs subsection={'Newest Members'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <InfiniteMembersList
          queryKey={['NEWEST_MEMBERS']}
          where={{}}
          orderBy={[{ joined_colinks_at: order_by.desc_nulls_last }]}
          includeRank={true}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
