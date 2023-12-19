import assert from 'assert';
import { ComponentProps, useContext } from 'react';

import { useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { CoLinksContext } from './CoLinksContext';
import { useCoLinks } from './useCoLinks';
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
  const {
    coLinks,
    coLinksReadOnly,
    chainId,
    awaitingWallet,
    setAwaitingWallet,
  } = useContext(CoLinksContext);

  const currentUserAddress = useConnectedAddress(true);

  const { refresh } = useCoLinks({
    contract: coLinksReadOnly,
    address: currentUserAddress,
    target: target,
  });

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
  const buyLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        if (
          typeof error === 'string' &&
          error?.includes('Inexact payment amount')
        ) {
          showError(
            'Looks like someone bought this CoLink right before you. Please try again.',
            {
              autoClose: 5000,
            }
          );
          refresh();
          setProgress('');
        } else {
          showError(error);
          setProgress('');
        }
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
      onClick={buyLink}
      color="cta"
      disabled={awaitingWallet || disabled}
    >
      {text}
    </Button>
  );
};
