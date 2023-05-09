import { useState } from 'react';

import { styled } from 'stitches.config';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Button,
  Text,
  Box,
} from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulDetails = ({ cosoul_data }: { cosoul_data: CoSoulData }) => {
  const [open, setOpen] = useState(false);
  const Table = styled('table', {});
  return (
    <Box
      css={{
        width: '100%',
        maxWidth: `${artWidth}`,
        mb: '$4xl',
        pb: '$lg',
      }}
    >
      <Collapsible open={open} onOpenChange={setOpen} css={{ mb: '$md' }}>
        <CollapsibleContent>
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
                          <td>{Math.floor(circle.pgive)}</td>
                          <td className="highlight">
                            {Math.floor(
                              (circle.pgive / cosoul_data.totalPgive) * 100
                            )}
                            %
                          </td>
                          <td>{circle.epochs}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Box>
            );
          })}
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button fullWidth css={{ mb: '$md' }}>
            {!open ? 'Show pGIVE composition details' : 'Hide details'}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </Box>
  );
};
