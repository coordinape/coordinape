import assert from 'assert';
import { ComponentProps, useContext } from 'react';

import { useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { CoLinksContext } from './CoLinksContext';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

type BuyButtonProps = {
  setProgress(s: string): void;
  onSuccess(): void;
  target: string;
  disabled?: boolean;
  size?: ComponentProps<typeof Button>['size'];
  text?: string;
};

export const BuyButton = ({
  setProgress,
  onSuccess,
  target,
  disabled,
  size = 'medium',
  text = 'Buy Link',
}: BuyButtonProps) => {
  const { showError } = useToast();
  // const
  const queryClient = useQueryClient();
  const { coLinks, chainId, awaitingWallet, setAwaitingWallet } =
    useContext(CoLinksContext);

  const syncLinks = async () => {
    await client.mutate(
      {
        syncLinks: { success: true },
      },
      {
        operationName: 'coLinks_sync_after_buysell',
      }
    );
  };
  const buyKey = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      assert(coLinks);
      assert(chainId);
      setAwaitingWallet(true);
      const value = await coLinks.getBuyPriceAfterFee(target, 1);
      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () =>
          coLinks.buyLinks(target, 1, {
            value,
          }),
        {
          showDefault: setProgress,
          description: `Buy CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId.toString(),
          contract: coLinks,
        }
      );
      if (receipt) {
        setProgress('Done!');
        await syncLinks();
        await queryClient.invalidateQueries([QUERY_KEY_COLINKS]);
        onSuccess();
        setProgress('');
      } else if (error) {
        showError(error);
        setProgress('');
      } else {
        showError('no transaction receipt');
        setProgress('');
      }
    } catch (e: any) {
      showError('Error buying CoLink: ' + e.message);
      setProgress('');
    } finally {
      setAwaitingWallet(false);
    }
  };

  return (
    <Button
      size={size}
      onClick={buyKey}
      color="cta"
      disabled={awaitingWallet || disabled}
    >
      {text}
    </Button>
  );
};
