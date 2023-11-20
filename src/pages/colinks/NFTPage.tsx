import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CoLinksBasicProfileHeader } from '../../features/colinks/CoLinksBasicProfileHeader';
import { FeaturedLink } from '../../features/colinks/FeaturedLink';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { client } from '../../lib/gql/client';
import { Box, Flex, Image, Link, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const NFTPage = () => {
  const address = useConnectedAddress(true);

  const { data: similar } = useQuery(['NFTS', address, 'similar'], async () => {
    const { getSimilarProfiles } = await client.query(
      {
        getSimilarProfiles: {
          score: true,
          other_address: true,
          other_cosoul: {
            address: true,
            profile_public: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      { operationName: 'similarProfiles' }
    );
    console.log('GSM', getSimilarProfiles);
    return getSimilarProfiles;
  });

  const { data: nfts } = useQuery(['NFTS', address, 'holdings'], async () => {
    console.log('SUP');
    const { nft_holdings } = await client.query(
      {
        nft_holdings: [
          {
            // where: {
            //   address: {
            //     _eq: address,
            //   },
            // },
          },
          {
            name: true,
            image_url: true,
            token_id: true,
            collection: {
              name: true,
              address: true,
              banner_image_url: true,
            },
          },
        ],
      },
      { operationName: 'getMyNFTs' }
    );
    console.log({ nft_holdings });
    return nft_holdings;
  });

  return (
    <SingleColumnLayout>
      <CoLinksBasicProfileHeader
        address={address.toLowerCase()}
        title={'NFT Explorer'}
      />
      <Text h2>Similar Profiles</Text>
      {similar === undefined ? (
        <Flex>
          hmmm
          <LoadingIndicator />
        </Flex>
      ) : (
        <Flex column css={{ gap: '$md', maxWidth: '300px' }}>
          {similar.length === 0 ? (
            <Text>No data - no NFTs maybe?</Text>
          ) : (
            similar.map(s =>
              !s.other_cosoul?.profile_public ? (
                <Text key={s.other_address}>
                  no profile for {s.other_address}
                </Text>
              ) : (
                <FeaturedLink
                  key={s.other_address}
                  target={{
                    name: s.other_cosoul.profile_public.name,
                    address: s.other_address,
                    avatar: s.other_cosoul.profile_public.avatar,
                    count: s.score,
                    countName: 'shared NFT' + (s.score == 1 ? '' : 's'),
                  }}
                />
              )
            )
          )}
        </Flex>
      )}

      {nfts === undefined ? (
        <Flex>
          <LoadingIndicator />
        </Flex>
      ) : (
        <Flex column css={{ gap: '$md' }}>
          <Text h2>My {nfts.length} NFTs</Text>
          {nfts.length === 0 ? (
            <Text>No NFTs</Text>
          ) : (
            <Box
              css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '$md',
                m: '$xl ',
              }}
            >
              {nfts.map(n =>
                !n.image_url ? null : (
                  <Box
                    key={`${n.collection.address}_${n.token_id}`}
                    css={{
                      overflow: 'hidden',
                      borderRadius: '$4',
                      position: 'relative',
                    }}
                  >
                    <Link
                      href={`https://opensea.io/assets/ethereum/${n.collection.address}/${n.token_id}`}
                      target={'_blank'}
                      rel={'noreferrer'}
                    >
                      <Box
                        css={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                        }}
                      >
                        <Box
                          css={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            position: 'absolute',
                            mixBlendMode: 'overlay',
                          }}
                        />
                        <Image
                          css={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                          }}
                          src={n.image_url}
                          alt="NFT Image"
                        />
                      </Box>
                    </Link>
                  </Box>
                )
              )}
            </Box>
          )}
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
