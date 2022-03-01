import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Box, Button, Checkbox, Text, TextFieldFund } from '../../ui';
import { Dialog } from 'components';

import { IEpoch } from 'types';

interface AllocateModalProps {
  epoch: IEpoch;
  onClose: () => void;
}

const schema = z.object({
  amount: z.number(),
  repeat: z.boolean(),
  repeat_times: z.number().nullable(),
});
type BudgetForm = z.infer<typeof schema>;

export default function AllocateModal({ epoch, onClose }: AllocateModalProps) {
  // TODO: implement zodResolver when all the fields are available
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<BudgetForm>();

  const onSubmit: SubmitHandler<BudgetForm> = data => {
    console.warn('todo:', data);
    onClose();
  };

  return (
    <Dialog onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '$md',
            borderRadius: '$1',
            backgroundColor: 'white',
            alignItems: 'center',
            py: '$2xl',
            width: '600px',
          }}
        >
          <Text
            css={{
              fontSize: '$5',
              color: '$text',
              fontWeight: '$light',
            }}
          >
            Budget For
          </Text>
          <Text
            css={{
              fontSize: 'calc($9 - 2px)',
              color: '$text',
              fontWeight: '$bold',
              '@sm': {
                fontSize: '$8',
                textAlign: 'center',
              },
            }}
          >
            {epoch.labelGraph}
          </Text>
          <Text
            css={{
              fontSize: '$8',
              color: '$lightBlue',
              fontWeight: '$normal',
              mt: '$md',
              '@sm': {
                fontSize: '$7',
                textAlign: 'center',
              },
            }}
          >
            {epoch.labelDayRange}
          </Text>
          <Text
            css={{
              fontSize: '$4',
              color: '$text',
              fontWeight: '$light',
              '@sm': {
                fontSize: '$3',
                textAlign: 'center',
              },
            }}
          >
            (Repeats {epoch.repeatEnum})
          </Text>
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '$sm',
              mt: '$xl',
            }}
          >
            <Controller
              name={'amount'}
              control={control}
              render={({ field: { onChange } }) => (
                <TextFieldFund
                  {...register('amount', { required: true })}
                  onChange={onChange}
                  fundsAvailable={2000}
                />
              )}
            />
            {errors.amount?.type === 'required' && (
              <Text css={{ fontSize: '$2', color: '$red' }}>
                Amount is required
              </Text>
            )}
            <Box
              css={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '$full',
              }}
            >
              <Controller
                name={'repeat'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={value}
                    {...register('repeat')}
                    onCheckedChange={onChange}
                    label={`Fund ${epoch.repeatEnum}`}
                  />
                )}
              />
            </Box>
            <Box
              css={{
                display: 'flex',
                justifyContent: 'center',
                mt: '$2xl',
              }}
            >
              <Button
                type="submit"
                data-testid="fund-this-epoch"
                size="small"
                color="red"
              >
                Commit Budget
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
}
