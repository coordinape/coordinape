import { deleteUser } from 'lib/gql/mutations';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { paths } from 'routes/paths';
import { Flex, Form, FormLabel, Modal, Text, TextField } from 'ui';

import { IDeleteUser } from '.';

export const LeaveCircleModal = ({
  epochIsActive,
  circleId,
  circleName,
  leaveCircleDialog,
  setLeaveCircleDialog,
}: {
  epochIsActive: boolean;
  circleId?: number;
  circleName?: string;
  leaveCircleDialog: IDeleteUser | undefined;
  setLeaveCircleDialog: (u?: IDeleteUser) => void;
}) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { register, handleSubmit, unregister } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      circle_name: '',
    },
  });

  const onSubmit = async () => {
    if (leaveCircleDialog && !!circleId) {
      unregister('circle_name');
      await deleteUser(circleId, leaveCircleDialog.address)
        .then(() => {
          queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
          setLeaveCircleDialog(undefined);
        })
        .catch(() => setLeaveCircleDialog(undefined));
    }
    navigate(paths.circles);
  };
  return (
    <Modal
      open={!!leaveCircleDialog}
      title={'Are you sure ?'}
      onClose={() => {
        unregister('circle_name');
        setLeaveCircleDialog(undefined);
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Flex column alignItems="start" css={{ gap: '$xl' }}>
          <Text inline size="medium">
            Are you sure you want to leave the{' '}
            <Text inline bold>
              {circleName} Circle
            </Text>
            {epochIsActive
              ? ' . Opting out during an in-progress epoch will result in any GIVEs you have received being returned to senders. Are you sure you wish to proceed? This cannot be undone.'
              : '. Leaving this circle, You will no longer have access to any of the information in the circle.'}
          </Text>

          <Flex column css={{ width: '100%' }}>
            <FormLabel type="label" htmlFor="circle_name">
              Enter the team`s name to leave it
            </FormLabel>
            <TextField
              id="circle_name"
              fullWidth
              color="destructive"
              {...register('circle_name', {
                required: 'please enter the circle name',
                validate: value =>
                  value === circleName || 'please match the requested format',
              })}
            ></TextField>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
};
