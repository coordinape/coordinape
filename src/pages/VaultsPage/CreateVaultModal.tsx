import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';

import { Box } from '@material-ui/core';

import { useVaultFactory } from '../../hooks/useVaultFactory';
import { FormModal, FormAssetSelector } from 'components';
import CreateVaultForm from 'forms/CreateVaultForm';

export const CreateVaultModal = ({
  onClose,
}: // open,
{
  // open?: boolean;
  onClose: () => void;
}) => {
  const history = useHistory();
  const { chainId } = useWeb3React();
  const { createApeVault } = useVaultFactory();

  return (
    <CreateVaultForm.FormController
      source={chainId}
      submit={async ({ asset: { name, custom } }) => {
        createApeVault({ type: name, simpleTokenAddress: custom }).then(
          vault => {
            if (!vault) return;

            // eslint-disable-next-line no-console
            console.log('created vault:', vault);
            history.push('/admin/vaults');
            onClose();
          }
        );
      }}
    >
      {({ fields, handleSubmit, ready, errors }) => (
        <FormModal
          onClose={onClose}
          // open={open}
          title={'Create a New Vault'}
          subtitle={'We need to have some short description here'}
          onSubmit={handleSubmit}
          submitDisabled={!ready}
          size="small"
          submitText="Mint Vault"
        >
          <Box pt={4}>
            <FormAssetSelector
              label="Select an asset"
              subLabel="This will be the asset you distribute from the vault"
              infoTooltip="TODO: Ask someone to write this"
              {...fields.asset}
            />
          </Box>
          {Object.values(errors).map(val => (
            <span key={val}>{val}</span>
          ))}
        </FormModal>
      )}
    </CreateVaultForm.FormController>
  );
};

export default CreateVaultModal;
