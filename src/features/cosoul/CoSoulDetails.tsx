import { useEffect } from 'react';

import { styled } from 'stitches.config';

import { Text, Box } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';
import { generateRandomNumber, startNumberScramble } from './numberScramble';

type CoSoulData = QueryCoSoulResult;

export const CoSoulDetails = ({ cosoul_data }: { cosoul_data: CoSoulData }) => {
  const Table = styled('table', {});
  const mintInfo = cosoul_data.mintInfo;
  // eslint-disable-next-line no-console
  console.log({ cosoul_data });
  useEffect(() => {
    startNumberScramble('.details-scramble');
  });
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
                        <Text
                          className={`${!mintInfo && 'details-scramble'}`}
                          data-digits="3"
                        >
                          {mintInfo
                            ? Math.floor(circle.pgive)
                            : generateRandomNumber(3)}
                        </Text>
                      </td>
                      <td className="highlight">
                        <Text
                          inline
                          className={`${!mintInfo && 'details-scramble'}`}
                          data-digits="2"
                        >
                          {mintInfo
                            ? Math.floor(
                                (circle.pgive / cosoul_data.totalPgive) * 100
                              )
                            : generateRandomNumber(2)}
                        </Text>
                        %
                      </td>
                      <td>
                        <Text
                          className={`${!mintInfo && 'details-scramble'}`}
                          data-digits="2"
                        >
                          {mintInfo ? circle.epochs : generateRandomNumber(2)}
                        </Text>
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
