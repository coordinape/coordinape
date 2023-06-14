import { useEffect, useRef } from 'react';

import { styled } from 'stitches.config';

import { Text, Box } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';
import { generateRandomNumber, scrambleNumber } from './numberScramble';

type CoSoulData = QueryCoSoulResult;

export const CoSoulDetails = ({
  cosoul_data,
  minted,
}: {
  cosoul_data: CoSoulData;
  minted?: boolean;
}) => {
  const Table = styled('table', {});
  const coSoulMinted = minted || Boolean(cosoul_data.mintInfo);
  const detailScramble1 = useRef<HTMLSpanElement>(null);
  const detailScramble2 = useRef<HTMLSpanElement>(null);
  const detailScramble3 = useRef<HTMLSpanElement>(null);
  const nodes = [detailScramble1, detailScramble2, detailScramble3];
  useEffect(() => {
    if (coSoulMinted) {
      Object.values(nodes).forEach(node => node.current?.remove());
    } else {
      Object.values(nodes).forEach(node => scrambleNumber(node.current));
    }
  }, [coSoulMinted]);
  if (cosoul_data.organizationCount == 0) {
    return <></>;
  }
  return (
    <Box
      css={{
        width: '100%',
        maxWidth: `${artWidth}`,
        pb: '$lg',
      }}
    >
      <Text h2 css={{ color: '$neutral', pb: '$md' }}>
        pGIVE Composition Detail
      </Text>

      {cosoul_data.organizations?.map(org => {
        return (
          <Box key={org?.id} css={{ mb: '$1xl' }}>
            <Text
              h1
              color="cta"
              css={{
                pl: '$sm',
                pb: '$md',
                borderBottom: '1px solid $borderFocus',
              }}
            >
              {org?.name}
            </Text>
            <Table
              css={{
                width: '100%',
                borderSpacing: 0,
                fontSize: '$small',
                tableLayout: 'fixed',
                'td, th': {
                  p: '$sm',
                  borderBottom: '1px solid $borderTable',
                  textAlign: 'left',
                  verticalAlign: 'baseline',
                },
                th: {
                  color: '$secondaryText',
                  textTransform: 'uppercase',
                },
                td: {
                  fontWeight: '$semibold',
                  color: '$secondaryText',
                  span: {
                    fontWeight: '$semibold',
                  },
                },
                '.highlight': {
                  color: '$cta',
                },
              }}
            >
              <thead>
                <tr>
                  <th>
                    Circle <br />
                    Name
                  </th>
                  <th>
                    Public <br />
                    GIVE
                  </th>
                  <th>
                    % of Total <br />
                    Public GIVE
                  </th>
                  <th>
                    Active <br />
                    epochs
                  </th>
                </tr>
              </thead>
              <tbody>
                {org?.circles.map(circle => {
                  return (
                    <tr key={circle.id}>
                      <td>{circle.name}</td>
                      <td>
                        {!coSoulMinted && (
                          <Text
                            ref={detailScramble1}
                            data-digits="3"
                            data-text={generateRandomNumber(3)}
                          >
                            {generateRandomNumber(3)}
                          </Text>
                        )}
                        {coSoulMinted && (
                          <Text>{Math.floor(circle.pgive)}</Text>
                        )}
                      </td>
                      <td className="highlight">
                        {!coSoulMinted && (
                          <Text
                            inline
                            ref={detailScramble2}
                            data-digits="2"
                            data-text={generateRandomNumber(2)}
                          >
                            {generateRandomNumber(2)}
                          </Text>
                        )}
                        {coSoulMinted && (
                          <Text inline>
                            {Math.floor(
                              (circle.pgive / cosoul_data.totalPgive) * 100
                            )}
                          </Text>
                        )}
                        %
                      </td>
                      <td>
                        {!coSoulMinted && (
                          <Text
                            ref={detailScramble3}
                            data-digits="2"
                            data-text={generateRandomNumber(2)}
                          >
                            {generateRandomNumber(2)}
                          </Text>
                        )}
                        {coSoulMinted && <Text>{circle.epochs}</Text>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Box>
        );
      })}
    </Box>
  );
};
