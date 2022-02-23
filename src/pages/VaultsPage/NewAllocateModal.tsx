import { useNavigate } from 'react-router-dom';

import { FormModal } from 'components';
import { AllocateFundsCard } from 'components/AllocateFundsCard/AllocateFundsCard';
import AdminVaultForm from 'forms/AdminVaultForm';
import { PlusCircleIcon } from 'icons';

interface AllocateModalProps {
  onClose: () => void;
}

export default function AllocateModal({ onClose }: AllocateModalProps) {
  // const classes = useStyles();
  const navigate = useNavigate();
  // const [ongoing, setOngoing] = useState<boolean>(false);

  // const setOngoingAllocation = () => {
  //   setOngoing(!ongoing);
  // };

  //   TODO: Pull in real data to populate FormTextField label and update value
  /**
   * TODO:
   * get fundsAvailable from real data
   * fields.repeat_monthly the flag to know the recurring label?
   * how I get the epoch Period?
   */
  return (
    <AdminVaultForm.FormController
      source={undefined}
      hideFieldErrors
      submit={params => {
        console.warn('todo:', params);
        const path = '/admin/vaults';
        navigate(path);
      }}
    >
      {({ fields, handleSubmit, changedOutput }) => (
        <FormModal
          onClose={onClose}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<PlusCircleIcon />}
          submitText={`Commit Budget`}
        >
          <AllocateFundsCard
            css={{
              py: '$2xl',
            }}
            onChange={fields.token.onChange}
            epoch="Yearn Community: E22"
            period="Aug 15 to Aug 31"
            fundsAvailable={20000}
            recurringLabel="monthly"
          ></AllocateFundsCard>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
}
