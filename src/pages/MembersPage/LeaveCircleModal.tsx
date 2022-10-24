import { zodResolver } from '@hookform/resolvers/zod';
import { deleteUser } from 'lib/gql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { FormInputField } from 'components';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { paths } from 'routes/paths';
import { Button, Flex, Form, Modal, Text } from 'ui';

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
  const schema = z
    .object({
      circle_name: z
        .string({
          required_error: 'Please enter the circle name',
        })
        .refine(c => c === circleName, {
          message: 'Please match the circle name',
        }),
    })
    .strict();
  type LeaveCircleFormSchema = z.infer<typeof schema>;

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<LeaveCircleFormSchema>({
    shouldUseNativeValidation: true,
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    if (leaveCircleDialog && !!circleId) {
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
        reset();
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

          <FormInputField
            id="circle_name"
            name="circle_name"
            defaultValue=""
            control={control}
            label="Enter the team`s name to leave it"
            css={{ width: '100%' }}
          ></FormInputField>
          <Flex css={{ width: '100%', gap: '$lg' }}>
            <Button
              onClick={() => {
                reset();
                setLeaveCircleDialog(undefined);
              }}
              color="neutral"
              outlined
              size="large"
              css={{ width: '50%' }}
            >
              Cancel
            </Button>
            <Button
              color="destructive"
              size="large"
              css={{ width: '50%' }}
              disabled={!isEmpty(errors) || !isDirty}
              type="submit"
            >
              Leave Circle
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
};
