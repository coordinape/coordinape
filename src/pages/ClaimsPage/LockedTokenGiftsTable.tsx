import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { useMyProfile } from '../../recoilState';
import { Button, Link, Panel, Table, Text } from 'ui';
import { makeExplorerUrl } from 'utils/provider';

import { getLockedTokenGifts } from './queries';

export default function LockedTokenGiftsTable() {
  const profile = useMyProfile();
  const [lockedTokenGifts, setLockedTokenGifts] = useState([] as any[]);

  useEffect(() => {
    getLockedTokenGifts(profile.id).then(setLockedTokenGifts);
  }, [profile]);

  return (
    <div>
      <Text h2 css={{ mb: '$sm' }}>
        Locked Tokens
      </Text>
      <Panel>
        <Table>
          <thead>
            <tr>
              <th>Gift amount</th>
              <th>Transaction</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lockedTokenGifts.map(lockedTokenGift => {
              return (
                <tr key={lockedTokenGift.id}>
                  <td>
                    {`${ethers.utils.formatUnits(
                      lockedTokenGift.earnings.toString(),
                      lockedTokenGift.locked_token_distribution.token_decimals
                    )} ${
                      lockedTokenGift.locked_token_distribution.token_symbol
                    }`}
                  </td>
                  <td>
                    <Link
                      target="blank"
                      href={makeExplorerUrl(
                        lockedTokenGift.locked_token_distribution.chain_id,
                        lockedTokenGift.locked_token_distribution.tx_hash
                      )}
                    >
                      {lockedTokenGift.locked_token_distribution.tx_hash}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href="https://v1.hedgey.finance/#/portfolio"
                      target="_blank"
                    >
                      <Button color="primary" size="small" outlined>
                        View Hedgeys
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Panel>
    </div>
  );
}
