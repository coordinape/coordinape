import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime, Interval } from 'luxon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';
import * as z from 'zod';

import { FormInputField } from 'components';
import { useToast } from 'hooks';
import { Edit, Give, PlusCircle } from 'icons/__generated';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button, Flex, IconButton, HR } from 'ui';

type Props = {
  epoch: {
    start_date?: any;
    end_date: any;
    description?: string;
    number?: number;
  };
  unallocated: number;
  circleId: number;
  tokenName?: string;
  editCurrentEpoch: () => void;
  isEditing: boolean;
  isAdmin: boolean;
  css?: CSS;
};
export const CurrentEpochPanel = ({
  epoch,
  unallocated,
  circleId,
  tokenName = 'GIVE',
  editCurrentEpoch,
  isEditing,
  isAdmin,
  css = {},
}: Props) => {
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const epochTimeRemaining = Interval.fromDateTimes(DateTime.now(), endDate);
  const epochDaysRemaining = Math.floor(epochTimeRemaining.length('days'));
  const daysPlural = epochDaysRemaining > 1 ? 'Days' : 'Day';

  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

  // TODO: why is this null sometime? just from data seeding?
  const epochDescriptionText =
    epoch.description ?? 'Epoch ' + (epoch.number ?? '');

  return (
    <Panel
      css={{
        mb: '$xl',
        alignItems: 'start',
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '$md',
        border: '1px solid $borderFocusBright',
        '@sm': { gridTemplateColumns: '1fr' },
        ...css,
      }}
    >
      <Flex
        column
        alignItems="start"
        css={{ gap: '$sm', borderRight: '1px solid $borderDim' }}
      >
        <Text h1 css={{ color: '$currentEpochDate', fontSize: '$h1Temp' }}>
          {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
          {endDate.toFormat(endDateFormat)}
        </Text>

        <EpochDescription
          description={epochDescriptionText}
          isAdmin={isAdmin}
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
          // TODO: maybe we want to continue to highlight some color here
          // color={unallocated > 0 ? '$alert' : '$secondaryText'}
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
        borderLeft: '1px solid $borderDim',
        '&:first-of-type': {
          borderLeft: 'none',
        },
        pl: '$xl',
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
};
const EpochDescription = ({ description, isAdmin }: EpochDescriptionProps) => {
  const { showError } = useToast();
  const [editDescription, setEditDescription] = useState(false);

  const zEpochDescriptionSchema = z.object({
    description: z
      .optional(
        z.nullable(
          z
            .string()
            .refine(val => val.trim().length >= 10, {
              message: 'Description should be at least 10 characters long',
            })
            .refine(val => val.length < 100, {
              message: 'Description length should not exceed 100 characters',
            })
        )
      )
      .transform(val => (val === '' ? null : val)),
  });

  type EpochDescriptionSchema = z.infer<typeof zEpochDescriptionSchema>;

  const onSubmit: SubmitHandler<EpochDescriptionSchema> = async data => {
    try {
      // eslint-disable-next-line no-console
      console.log(data);
      // TODO: implement saving
      // await updateCircle({
      //   circle_id: selectedCircle.id,
      //   cont_help_text: data.cont_help_text,
      // });
      // setUpdatedContHelpText(data.cont_help_text);
    } catch (e) {
      showError(e);
      console.warn(e);
    }
    setEditDescription(false);
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
                areaProps={{ rows: 2 }}
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
