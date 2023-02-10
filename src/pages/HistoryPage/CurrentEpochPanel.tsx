import { Dispatch, SetStateAction, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { updateEpochDescription } from 'lib/gql/mutations';
import { DateTime, Interval } from 'luxon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';
import * as z from 'zod';

import { FormInputField } from 'components';
import { useReceiveInfo } from 'components/ReceiveInfo/useReceiveInfo';
import { useToast } from 'hooks';
import { Edit, Give, PlusCircle } from 'icons/__generated';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button, Flex, IconButton, HR } from 'ui';

import { NotesSection } from './Notes';

type Props = {
  epoch: {
    start_date?: any;
    end_date: any;
    id: number;
    description?: string;
    number?: number;
  };
  userId: number;
  unallocated: number;
  circleId: number;
  tokenName?: string;
  editCurrentEpoch: () => void;
  isEditing: boolean;
  editingEpoch?: number;
  isAdmin: boolean;
  css?: CSS;
  children?: React.ReactNode;
};
export const CurrentEpochPanel = ({
  epoch,
  userId,
  unallocated,
  circleId,
  tokenName = 'GIVE',
  editCurrentEpoch,
  isEditing,
  isAdmin,
  children,
  css = {},
}: Props) => {
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const epochTimeRemaining = Interval.fromDateTimes(DateTime.now(), endDate);
  const epochDaysRemaining = Math.floor(epochTimeRemaining.length('days'));
  const daysPlural = epochDaysRemaining > 1 ? 'Days' : 'Day';

  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

  const { gifts, showGives } = useReceiveInfo(circleId, userId);

  const received = gifts;

  // TODO: why is epoch.number null sometimes? just from data seeding?
  const [epochDescriptionText, setEpochDescriptionText] = useState<string>(
    epoch.description ?? 'Epoch ' + (epoch.number ?? '')
  );

  return (
    <Panel
      css={{
        mb: '$xl',
        border: '1px solid $borderFocusBright',
        ...css,
      }}
    >
      <Flex
        row
        css={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '1fr 3fr',
          gap: '$md',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        <Flex column alignItems="start" css={{ gap: '$sm' }}>
          <Text h1 css={{ color: '$currentEpochDate', fontSize: '$h1Temp' }}>
            {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
            {endDate.toFormat(endDateFormat)}
          </Text>

          <EpochDescription
            description={epochDescriptionText}
            isAdmin={isAdmin}
            epochId={epoch.id}
            setDescriptionText={setEpochDescriptionText}
          />
          {!isEditing && isAdmin && (
            <Button
              css={{ mt: '$md' }}
              color="secondary"
              size="small"
              onClick={() => editCurrentEpoch()}
            >
              Edit Epoch
            </Button>
          )}
        </Flex>
        <Flex
          column
          css={{
            gap: '$lg',
            borderLeft: '1px solid $borderDim',
            pl: '$xl',
            '@sm': {
              borderLeft: 'none',
              pl: 0,
            },
          }}
        >
          <Flex
            css={{
              gap: '$md',
              '@sm': { flexDirection: 'column' },
            }}
          >
            <Minicard
              icon={<PlusCircle />}
              title="Contributions"
              color="$text"
              content={
                epochDaysRemaining == 0
                  ? 'Today is the Last Day to Add Contributions'
                  : `${epochDaysRemaining} ${daysPlural} Left to Add Contributions`
              }
              path={paths.contributions(circleId)}
              linkLabel="Add Contribution"
            />
            <Minicard
              icon={<Give nostroke />}
              title="GIVE"
              color="$text"
              content={
                unallocated > 0
                  ? `Allocate Your Remaining ${unallocated} ${tokenName}`
                  : `No More ${tokenName} to Allocate ${unallocated}`
              }
              path={paths.give(circleId)}
              linkLabel="GIVE to Teammates"
            />
          </Flex>
          {(showGives || isAdmin) && (
            <NotesSection sent={[]} received={received} tokenName={tokenName} />
          )}
        </Flex>
      </Flex>
      {children && (
        <Flex
          css={{
            '.epochFormContainer': {
              m: '$lg 0 0 0',
              px: '0',
              borderTop: '1px dashed $borderDim',
              borderRadius: 0,
              gridColumn: '1 / 3',
            },
          }}
        >
          {children}
        </Flex>
      )}
    </Panel>
  );
};

type MinicardProps = {
  icon?: any;
  title?: string;
  content: any;
  color?: string;
  path: string;
  linkLabel: string;
};

const Minicard = ({
  icon,
  title,
  content,
  color,
  path,
  linkLabel,
}: MinicardProps) => {
  return (
    <Box
      css={{
        width: '100%',
        gap: '$sm',
        '@sm': {
          minWidth: 0,
        },
      }}
    >
      <Box
        css={{
          color: '$secondaryText',
          flexGrow: 1,
          display: 'flex',
          gap: '$md',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Text variant="label" css={{ mb: '$sm' }}>
            <Flex css={{ mr: '$xs' }}>{icon}</Flex>
            {title}
          </Text>
          <Text
            semibold
            css={{
              fontSize: '$medium',
              // color: alert ? 'red' : '$secondaryText',
              color: color,
            }}
          >
            {content}
          </Text>
        </Box>
        <Button size="small" color="primary" as={NavLink} key={path} to={path}>
          {linkLabel}
        </Button>
      </Box>
    </Box>
  );
};

type EpochDescriptionProps = {
  description: string;
  isAdmin: boolean;
  epochId: number;
  setDescriptionText: Dispatch<SetStateAction<string>>;
};
const EpochDescription = ({
  description,
  isAdmin,
  epochId,
  setDescriptionText,
}: EpochDescriptionProps) => {
  const { showError, showSuccess } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const zEpochDescriptionSchema = z.object({
    description: z
      .string()
      .trim()
      .min(1, { message: 'Must be at least 1 characters long' })
      .max(100, { message: 'Must be 100 or fewer characters long' }),
  });

  type EpochDescriptionSchema = z.infer<typeof zEpochDescriptionSchema>;

  const onSubmit: SubmitHandler<EpochDescriptionSchema> = async data => {
    if (!data.description) {
      return;
    }

    try {
      setSubmitting(true);
      await updateEpochDescription(epochId, data.description);
      setDescriptionText(data.description);
      showSuccess('Epoch Description Saved!');
    } catch (e) {
      showError(e);
      console.warn(e);
    } finally {
      setSubmitting(false);
      setEditDescription(false);
    }
  };

  const { control: epochDescriptionControl, handleSubmit } =
    useForm<EpochDescriptionSchema>({
      resolver: zodResolver(zEpochDescriptionSchema),
      mode: 'all',
    });

  return (
    <Flex css={{ width: '100%' }}>
      {!editDescription ? (
        <Flex css={{ alignItems: 'center' }}>
          <Text
            medium
            css={{
              color: '$ctaHover',
            }}
          >
            {description}
          </Text>
          {isAdmin && (
            <IconButton
              onClick={() => setEditDescription(true)}
              css={{
                color: '$ctaHover',
              }}
            >
              <Edit />
            </IconButton>
          )}
        </Flex>
      ) : (
        isAdmin && (
          <Flex
            column
            css={{
              width: '100%',
              pr: '$md',
            }}
          >
            <Box>
              <FormInputField
                css={{ width: '100%' }}
                name="description"
                id="epoch_description_edit"
                control={epochDescriptionControl}
                defaultValue={description}
                label="Epoch Description"
                showFieldErrors
                textArea
              />
            </Box>
            <Flex css={{ gap: '$sm', mt: '$md' }}>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  setEditDescription(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                color="primary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
              >
                Save
              </Button>
            </Flex>
            <HR />
          </Flex>
        )
      )}
    </Flex>
  );
};
