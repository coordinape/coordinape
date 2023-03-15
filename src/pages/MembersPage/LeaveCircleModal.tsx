import { zodResolver } from '@hookform/resolvers/zod';
import { deleteUser } from 'lib/gql/mutations';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { FormInputField } from 'components';
import { useToast } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { paths } from 'routes/paths';
import { Button, Flex, Form, Modal, Text } from 'ui';

export const LeaveCircleModal = ({
  epochIsActive,
  circleId,
  circleName,
  open,
  onClose,
}: {
  epochIsActive: boolean;
  circleId: number;
  circleName: string;
  open: boolean;
  onClose: () => void;
}) => {
  const schema = z
    .object({
      circle_name: z.string().refine(c => c === circleName, {
        message: "Circle name doesn't match",
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
    formState: { isValid },
  } = useForm<LeaveCircleFormSchema>({
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const address = useConnectedAddress(true);
  const { showError } = useToast();

  const onSubmit = async () => {
    await deleteUser(circleId, address)
      .then(() => {
        queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
        onClose();
        navigate(paths.circles);
      })
      .catch(err => {
        if (err instanceof Error) showError(err.message);
      });
  };
  return (
    <Modal
      open={open}
      title={`Leave the ${circleName} Circle?`}
      onOpenChange={() => {
        reset();
        onClose();
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text p>
            {epochIsActive
              ? 'This circle has an in-progress epoch. If you leave now, you will forfeit all GIVE received this epoch.'
              : 'If you leave this circle you will no longer have access to any circle information or future epochs.'}
          </Text>
          <Text p>
            Are you sure you wish to proceed? This cannot be undone.
          </Text>
          <Text p>
            Please type the circle name{' '}
            <Text bold inline>
              {circleName}
            </Text>{' '}
            to confirm.
          </Text>
          <FormInputField
            id="circle_name"
            name="circle_name"
            defaultValue=""
            control={control}
            label="Circle name"
            css={{ width: '100%', mt: '$md' }}
            showFieldErrors
          ></FormInputField>
          <Flex css={{ width: '100%', gap: '$lg', mt: '$md' }}>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              color="secondary"
              size="large"
              css={{ width: '50%' }}
            >
              Cancel
            </Button>
            <Button
              color="destructive"
              size="large"
              css={{ width: '50%' }}
              disabled={!isValid}
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
