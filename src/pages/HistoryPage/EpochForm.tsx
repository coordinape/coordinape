import { useState, useMemo, useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import {
  DateObjectUnits,
  DateTime,
  Duration,
  Interval,
  DurationLike,
} from 'luxon';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { SafeParseReturnType, z } from 'zod';

import {
  FormRadioGroup,
  FormDatePicker,
  FormTimePicker,
  FormInputField,
} from 'components';
import { useToast, useApiAdminCircle } from 'hooks';
import { Info } from 'icons/__generated';
import {
  Box,
  Flex,
  Form,
  Link,
  Text,
  Button,
  Panel,
  Select,
  Tooltip,
} from 'ui';
import { TwoColumnLayout } from 'ui/layouts';

import { IQueryEpoch, QueryFutureEpoch } from './getHistoryData';

const longFormat = "DD 'at' HH:mm ZZZZ";
const longFormatNoTz = "DD 'at' HH:mm";

const zFrequencyUnits = z.union([
  z.literal('days'),
  z.literal('weeks'),
  z.literal('months'),
]);

const zCustomInputSchema = z
  .object({
    type: z.literal('custom'),
    frequency: z.coerce.number().min(1),
    frequency_unit: zFrequencyUnits,
  })
  .strict();

const zMonthlyInputSchema = z
  .object({
    type: z.literal('monthly'),
    weekday: z.number().min(1).max(7),
    week: z.number().min(1).max(6),
  })
  .strict();

const zSingleInputSchema = z
  .object({
    type: z.literal('one-off'),
  })
  .strict();

export const zEpochInputParams = z.discriminatedUnion('type', [
  zSingleInputSchema,
  zCustomInputSchema,
  zMonthlyInputSchema,
]);

type RepeatData = z.infer<typeof zEpochInputParams>;

interface EpochConfig {
  start_date: string;
  end_date: string;
  repeat_data: RepeatData;
}

interface IEpochFormSource {
  epoch?: IQueryEpoch;
  epochs?: IQueryEpoch[];
}
const EpochRepeatEnum = z.enum(['none', 'monthly', 'custom']);

const submitSchema = z
  .object({
    start_date: z.string(),
    end_date: z.string(),
    start_time: z.string(),
    custom_start_date: z.string(),
    custom_duration_qty: z.number().min(1),
    custom_interval_qty: z.number().min(1),
    custom_duration_denomination: zFrequencyUnits,
    custom_interval_denomination: zFrequencyUnits,
    repeat: EpochRepeatEnum,
    repeatStartDate: z.string(),
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
    repeat_view: z.string(),
    customError: z.undefined(), //unregistered to disable submitting
  })
  .strict();

const schema = z
  .object({
    start_date: z.string(),
    start_time: z.string(),
    custom_start_date: z.string(),
    custom_duration_qty: z.number().min(1),
    custom_interval_qty: z.number().min(1),
    custom_duration_denomination: zFrequencyUnits,
    custom_interval_denomination: zFrequencyUnits,
    end_date: z.string(),
    repeat: EpochRepeatEnum,
    repeatStartDate: z.string(),
    repeat_view: z.string(),
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
    customError: z.undefined(), //unregistered to disable submitting
  })
  .strict();

//FIXME use a switch block
const nextIntervalFactory = (repeat: number, repeatData: RepeatData) => {
  let increment: DurationLike;
  if (Number.isInteger(repeat)) {
    increment = repeat === 1 ? { weeks: 1 } : { months: 1 };
  } else if (repeatData.type === 'custom') {
    const { frequency_unit, frequency } = repeatData;
    increment = { [frequency_unit]: frequency };
  }
  return (i: Interval) =>
    Interval.fromDateTimes(i.start.plus(increment), i.end.plus(increment));
};

const extraEpoch = (raw: QueryFutureEpoch): IQueryEpoch => {
  const startDate = DateTime.fromISO(raw.start_date, {
    zone: 'utc',
  });
  const endDate = DateTime.fromISO(raw.end_date, { zone: 'utc' });

  const calculatedDays = endDate.diff(startDate, 'days').days;

  const repeatEnum =
    raw.repeat === 3
      ? 'bimonthly'
      : raw.repeat === 2
      ? 'monthly'
      : raw.repeat === 1
      ? 'weekly'
      : 'none';

  return {
    ...raw,
    repeatEnum,
    startDate,
    interval: startDate.until(endDate),
    calculatedDays,
  };
};

const getCollisionMessage = (
  newInterval: Interval,
  newRepeat: RepeatData,
  e: IQueryEpoch
) => {
  if (
    newInterval.overlaps(e.interval) ||
    (e.repeatEnum === 'none' && !newRepeat)
  ) {
    return newInterval.overlaps(e.interval)
      ? `Overlap with an epoch starting ${e.startDate.toFormat(longFormat)}`
      : undefined;
  }
  // Only one will be allowed to be repeating
  // Set r as the repeating and c as the constant interval.
  const [r, c, next] =
    e.repeatEnum !== 'none' || e.repeat_data?.type !== 'one-off'
      ? [e.interval, newInterval, nextIntervalFactory(e.repeat, e.repeat_data)]
      : [newInterval, e.interval, nextIntervalFactory(0, newRepeat)];

  if (c.isBefore(r.start) || +c.end === +r.start) {
    return undefined;
  }

  let rp = r;
  while (rp.start < c.end) {
    if (rp.overlaps(c)) {
      return e.repeatEnum !== 'none' || e.repeat_data?.type !== 'one-off'
        ? `Overlap with repeating epoch ${e.number ?? 'x'}: ${rp.toFormat(
            longFormat
          )}`
        : `After repeat, new epoch overlaps ${
            e.number ?? 'x'
          }: ${e.startDate.toFormat(longFormat)}`;
    }
    rp = next(rp);
  }

  return undefined;
};

const getZodParser = (
  source?: IEpochFormSource,
  currentEpoch?: { id: number; end_date: string }
) => {
  const otherRepeating = source?.epochs?.find(
    e => !!e.repeat || !!e.repeat_data
  );

  const getOverlapIssue = ({
    start_date,
    end_date,
    ...formData
  }: Omit<epochFormSchema, 'start_date' | 'end_date'> & {
    start_date: DateTime;
    end_date: DateTime;
  }) => {
    const interval = Interval.fromDateTimes(start_date, end_date);

    const collisionMessage = source?.epochs
      ? source?.epochs
          .map(e => getCollisionMessage(interval, buildRepeatData(formData), e))
          .find(m => m !== undefined)
      : undefined;

    return collisionMessage === undefined
      ? undefined
      : {
          path: ['start_dateTime'],
          message: collisionMessage,
        };
  };

  return schema
    .transform(({ start_date, end_date, ...fields }) => {
      return {
        start_date: DateTime.fromISO(start_date)
          .set(
            Duration.fromISOTime(
              fields.start_time
            ).toObject() as DateObjectUnits
          )
          .setZone(),
        end_date: DateTime.fromISO(end_date)
          .set(
            Duration.fromISOTime(
              fields.start_time
            ).toObject() as DateObjectUnits
          )
          .setZone(),
        ...fields,
      };
    })
    .transform(fields => {
      const { repeat_view } = fields;
      if (repeat_view === 'repeats' && fields.repeat !== 'none') {
        const { nextStartDate, nextEndDate } = getNextRepeatingDates(fields);
        return {
          ...fields,
          start_date: DateTime.fromISO(nextStartDate),
          end_date: DateTime.fromISO(nextEndDate),
        };
      }
      return fields;
    })
    .refine(
      ({ start_date }) => {
        return (
          start_date > DateTime.now().setZone() ||
          (currentEpoch && source?.epoch?.id === currentEpoch.id)
        );
      },
      {
        path: ['start_date'],
        message: 'Start date must be in the future',
      }
    )
    .refine(
      ({ end_date }) => {
        return end_date > DateTime.now().setZone();
      },
      {
        path: ['end_date'],
        message: 'Epoch must end in the future',
      }
    )
    .refine(({ start_date, end_date }) => start_date < end_date, {
      path: ['end_date'],
      message: 'End date must come after start date',
    })
    .refine(
      v => !getOverlapIssue(v),
      v => getOverlapIssue(v) ?? {}
    )
    .refine(
      ({ repeat_view }) => !(repeat_view === 'repeats' && !!otherRepeating),
      {
        path: ['repeat'],
        // the getOverlapIssue relies on this invariant.
        message: `Only one repeating epoch allowed.`,
      }
    )
    .transform(({ start_date, end_date, ...fields }) => ({
      start_date: start_date.toISO(),
      end_date: end_date.toISO(),
      days: end_date.diff(start_date, 'days').days,
      ...fields,
    }));
};

type epochFormSchema = z.infer<typeof schema>;
type epochSubmissionSchema = z.infer<typeof submitSchema>;

const repeat = [
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

const EpochForm = ({
  selectedEpoch,
  epochs,
  currentEpoch,
  circleId,
  setNewEpoch,
  setEditEpoch,
  onClose,
}: {
  selectedEpoch: QueryFutureEpoch | undefined;
  epochs: QueryFutureEpoch[] | undefined;
  currentEpoch: QueryFutureEpoch | undefined;
  circleId: number;
  setNewEpoch: (e: boolean) => void;
  setEditEpoch: (e: QueryFutureEpoch | undefined) => void;
  onClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { createEpoch } = useApiAdminCircle(circleId);

  const source = useMemo(
    () => ({
      epoch: selectedEpoch ? extraEpoch(selectedEpoch) : undefined,
      epochs: currentEpoch
        ? currentEpoch.id !== selectedEpoch?.id
          ? epochs
              ?.filter(e => e.id !== selectedEpoch?.id)
              .concat(currentEpoch)
              .map(e => extraEpoch(e))
          : epochs?.map(e => extraEpoch(e))
        : epochs
            ?.filter(e => e.id !== selectedEpoch?.id)
            .map(e => extraEpoch(e)),
    }),
    [selectedEpoch, epochs, currentEpoch]
  );

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<epochFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      repeat_view:
        typeof source?.epoch?.repeat === 'number'
          ? source.epoch.repeat > 0
            ? 'repeats'
            : 'one-off'
          : 'repeats',
      repeatStartDate: getMonthStartDates(
        source?.epoch?.start_date
          ? DateTime.fromISO(source.epoch.start_date).day.toString()
          : ((DateTime.now().day + 1) % 32 || 1).toString(),
        currentEpoch
      )[0].value,
      repeat:
        typeof source?.epoch?.repeat === 'number'
          ? source.epoch?.repeat > 0
            ? 'custom'
            : 'none'
          : 'custom',
      start_time:
        (source?.epoch?.start_date &&
          DateTime.fromISO(source.epoch.start_date).toLocaleString(
            DateTime.TIME_24_SIMPLE
          )) ??
        DateTime.now()
          .setZone()
          .plus({ days: 1 })
          .toLocaleString(DateTime.TIME_24_SIMPLE),
      start_date:
        (source?.epoch?.start_date &&
          DateTime.fromISO(source.epoch.start_date).toISODate()) ??
        DateTime.now().setZone().plus({ days: 1 }).toISODate(),
      description: source.epoch?.description,
      custom_start_date: DateTime.now().plus({ days: 1 }).toISODate(),
      end_date: source?.epoch?.end_date
        ? DateTime.fromISO(source.epoch.end_date)
            .plus(source.epoch.days || 0)
            .toISODate()
        : DateTime.now().setZone().plus({ months: 1 }).toISODate(),
    },
  });

  const [epochConfig, setEpochConfig] = useState<EpochConfig>({
    start_date: source?.epoch
      ? getValues('start_date')
      : getValues('repeatStartDate'),
    end_date: source?.epoch
      ? getValues('end_date')
      : DateTime.fromISO(getValues('repeatStartDate'))
          .plus({ months: 1 })
          .toISO(),
    repeat_data: { type: 'custom', frequency_unit: 'months', frequency: 1 },
  });

  const extraErrors = useRef(false);

  const validateState = (data: Partial<epochFormSchema>) => {
    const value: SafeParseReturnType<epochFormSchema, epochSubmissionSchema> =
      getZodParser(source, currentEpoch).safeParse(data);

    if (!value.success) {
      extraErrors.current = true;
      setError('customError', {
        message: value.error.errors[0].message,
      });
    } else {
      extraErrors.current = false;
      clearErrors('customError');
      return value.data;
    }
  };

  // validate the default form state on first load
  useEffect(() => {
    validateState(getValues());
  }, []);

  const { showError } = useToast();
  useEffect(() => {
    const subscription = watch((data, { name, type }) => {
      const {
        repeat_view,
        repeat,
        start_date,
        end_date,
        custom_start_date,
        custom_duration_denomination,
        custom_duration_qty,
        custom_interval_denomination,
        custom_interval_qty,
      } = data;

      // Prevent recursive field updates
      // `setValue` does not have an event type
      if (type === 'change') {
        if (
          name === 'start_date' &&
          repeat_view === 'one-off' &&
          start_date &&
          end_date
        ) {
          if (DateTime.fromISO(start_date) >= DateTime.fromISO(end_date)) {
            setValue(
              'end_date',
              DateTime.fromISO(start_date).plus({ days: 1 }).toISODate(),
              { shouldValidate: false }
            );
            return;
          }
        } else if (
          repeat_view === 'repeats' &&
          repeat === 'custom' &&
          custom_start_date
        ) {
          if (
            custom_interval_denomination &&
            custom_duration_denomination &&
            custom_interval_qty &&
            custom_duration_qty
          ) {
            const customDuration = Duration.fromObject({
              [custom_duration_denomination]: custom_duration_qty,
            });
            const customInterval = Duration.fromObject({
              [custom_interval_denomination]: custom_interval_qty,
            });
            if (
              (name === 'custom_duration_denomination' ||
                name === 'custom_duration_qty') &&
              customDuration > customInterval
            ) {
              setValue(
                'custom_interval_denomination',
                custom_duration_denomination,
                { shouldTouch: true }
              );
              setValue('custom_interval_qty', custom_duration_qty, {
                shouldTouch: true,
              });
              return;
            }
            if (
              (name === 'custom_interval_denomination' ||
                name === 'custom_interval_qty') &&
              customDuration > customInterval
            ) {
              setValue(
                'custom_duration_denomination',
                custom_interval_denomination
              );
              setValue('custom_duration_qty', custom_interval_qty);
              return;
            }
          }
        }
      }
      const validFormData = validateState(data);
      if (!validFormData) return;
      const repeat_data = buildRepeatData(validFormData);
      if (repeat_view === 'repeats' && repeat !== 'none') {
        const { nextStartDate, nextEndDate } =
          getNextRepeatingDates(validFormData);
        setEpochConfig({
          start_date: nextStartDate,
          end_date: nextEndDate,
          repeat_data,
        });
      } else {
        const { start_date, end_date, start_time } = validFormData;
        setEpochConfig({
          start_date: DateTime.fromISO(start_date)
            .set(Duration.fromISOTime(start_time).toObject() as DateObjectUnits)
            .toISO(),
          end_date: DateTime.fromISO(end_date)
            .set(Duration.fromISOTime(start_time).toObject() as DateObjectUnits)
            .toISO(),
          repeat_data,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<epochFormSchema> = async () => {
    if (extraErrors.current) {
      return;
    }

    setSubmitting(true);
    const payload = {
      ...epochConfig.repeat_data,
      start_date: epochConfig.start_date,
      end_date: epochConfig.end_date,
    };

    (source?.epoch
      ? selectedEpoch?.number !== -1
        ? Promise.resolve(showError('updateEpoch not yet implemented')) //updateEpoch(source.epoch.id, payload)
        : Promise.resolve(
            showError('updateActiveRepeatingEpoch not yet implemented')
          ) /* updateActiveRepeatingEpoch(source.epoch.id, {
            current: {
              start_date: currentEpoch?.start_date || '',
              days: payload.days,
              repeat: 0,
            },
            next: payload,
          })
          */
      : createEpoch(payload)
    )
      .then(() => {
        setSubmitting(false);
      })
      .then(onClose)
      .catch(console.warn);
  };

  const shouldFormBeDisabled = useMemo(
    () =>
      selectedEpoch &&
      selectedEpoch.id === currentEpoch?.id &&
      selectedEpoch.number !== -1,
    [selectedEpoch, currentEpoch]
  );

  return (
    <Form>
      <Panel css={{ mb: '$md', p: '$md' }}>
        <Flex
          css={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '$md',
          }}
        >
          <Text semibold css={{ color: '$secondaryText', fontSize: 'large' }}>
            {selectedEpoch ? 'Edit Epoch' : 'New Epoch'}
          </Text>

          <Flex css={{ gap: '$md', flexWrap: 'wrap' }}>
            <Button
              color="secondary"
              onClick={() => {
                selectedEpoch ? setEditEpoch(undefined) : setNewEpoch(false);
              }}
            >
              Cancel
            </Button>

            <Button
              color="primary"
              type="submit"
              disabled={submitting || !isEmpty(errors)}
              onClick={handleSubmit(onSubmit)}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Flex>
        </Flex>
        <Panel nested css={{ mt: '$md' }}>
          <TwoColumnLayout>
            <Flex column>
              <Text h3 semibold>
                Epoch Settings
              </Text>
              <Text p size="small" css={{ mt: '$sm ' }}>
                An Epoch is a period of time where circle members contribute
                value & allocate {'GIVE'} tokens to one another.{' '}
                <span>
                  <Link
                    href="https://docs.coordinape.com/get-started/epochs/create-an-epoch"
                    rel="noreferrer"
                    target="_blank"
                    inlineLink
                  >
                    Learn More
                  </Link>
                </span>
              </Text>
            </Flex>
          </TwoColumnLayout>
          <TwoColumnLayout>
            <Flex column css={{ gap: '$sm' }}>
              <FormInputField
                id="description"
                name="description"
                defaultValue={source.epoch?.description}
                control={control}
                label="DESCRIPTION"
                infoTooltip="A brief description of this epoch"
              />
              <Flex column css={{ gap: '$sm' }}>
                <Text h3>Epoch Frequency</Text>
                <Flex column css={{ mt: '$sm ', mb: '$md' }}>
                  <FormRadioGroup
                    name="repeat_view"
                    control={control}
                    options={[
                      { label: 'Repeats', value: 'repeats' },
                      { label: 'Does Not Repeat', value: 'one-off' },
                    ]}
                    label="Type"
                    infoTooltip="Decide whether the epoch will repeat monthly or weekly or will not repeat after ending"
                  />
                </Flex>
                <Flex
                  css={{
                    flexWrap: 'wrap',
                    gap: '$md',
                    display:
                      getValues('repeat_view') === 'one-off' ? 'flex' : 'none',
                  }}
                >
                  <Flex
                    column
                    alignItems="start"
                    css={{
                      maxWidth: '150px',
                      gap: '$xs',
                    }}
                  >
                    <Text variant="label" as="label">
                      Start Date{' '}
                      <Tooltip content="The first day of the epoch in your local time zone">
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                    <FormDatePicker
                      name="start_date"
                      id="start_date"
                      control={control}
                      disabled={shouldFormBeDisabled}
                    />
                  </Flex>
                  <Flex
                    column
                    css={{
                      alignItems: 'flex-start',
                      maxWidth: '150px',
                      gap: '$xs',
                    }}
                  >
                    <Text variant="label" as="label">
                      End Date{' '}
                      <Tooltip content="The last day of the epoch in your local time zone">
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                    <FormDatePicker
                      disabled={shouldFormBeDisabled}
                      control={control}
                      id="end_date"
                      name="end_date"
                    />
                  </Flex>
                  <Flex column css={{ gap: '$xs' }}>
                    <Text variant="label" as="label">
                      Time{' '}
                      <Tooltip content="The time the epoch will start and end in your local time zone">
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                    <Flex row css={{ gap: '$sm' }}>
                      <Box
                        css={{
                          maxWidth: '150px',
                          '> div': { mb: '0 !important' },
                        }}
                      >
                        <FormTimePicker
                          id="start_time"
                          name="start_time"
                          control={control}
                          disabled={shouldFormBeDisabled}
                        />
                      </Box>
                      <Text size="medium">
                        In your
                        <br /> local timezone
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  column
                  css={{
                    display:
                      getValues('repeat_view') === 'repeats' ? 'flex' : 'none',
                    flexWrap: 'wrap',
                    gap: '$md',
                  }}
                >
                  <Flex
                    css={{
                      gap: '$xs',
                    }}
                  >
                    <Controller
                      control={control}
                      name="repeat"
                      defaultValue="custom"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          css={{ minWidth: '280px' }}
                          options={repeat}
                          value={value}
                          disabled={shouldFormBeDisabled}
                          onValueChange={onChange}
                          id="repeat_type"
                          label="Cycles"
                        />
                      )}
                    />
                  </Flex>
                  <Flex
                    column
                    css={{
                      alignItems: 'flex-start',
                      maxWidth: '280px',
                      gap: '$xs',
                      display:
                        getValues('repeat') === 'custom' ? 'flex' : 'none',
                    }}
                  >
                    <Text variant="label" as="label">
                      Start On{' '}
                      <Tooltip content="The first day of the epoch in your local time zone">
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                    <FormDatePicker
                      disabled={shouldFormBeDisabled}
                      control={control}
                      id="custom_start_date"
                      name="custom_start_date"
                      css={{ minWidth: '280px' }}
                    />
                    <Flex row css={{ gap: '$sm' }}>
                      <Box
                        css={{
                          maxWidth: '80px',
                          '> div': { mb: '0 !important' },
                        }}
                      >
                        <FormInputField
                          number
                          label="Length"
                          infoTooltip="The duration of each epoch"
                          disabled={shouldFormBeDisabled}
                          defaultValue={1}
                          inputProps={{ min: 1 }}
                          control={control}
                          id="custom_duration_qty"
                          name="custom_duration_qty"
                        />
                      </Box>
                      <Controller
                        control={control}
                        name="custom_duration_denomination"
                        defaultValue="months"
                        render={({ field: { onChange, value } }) => (
                          <Select
                            css={{ minWidth: '200px', mt: '20px' }}
                            options={[
                              { label: 'Month', value: 'months' },
                              { label: 'Week', value: 'weeks' },
                              { label: 'Day', value: 'days' },
                            ]}
                            value={value}
                            disabled={shouldFormBeDisabled}
                            onValueChange={onChange}
                            id="custom_duration_denomination"
                          />
                        )}
                      />
                    </Flex>
                    <Flex row css={{ gap: '$sm' }}>
                      <Text variant="label">Repeats Every</Text>
                      <FormInputField
                        number
                        disabled={shouldFormBeDisabled}
                        defaultValue={1}
                        inputProps={{ min: 1 }}
                        control={control}
                        id="custom_interval_qty"
                        name="custom_interval_qty"
                      />
                      <Controller
                        control={control}
                        name="custom_interval_denomination"
                        defaultValue="months"
                        render={({ field: { onChange, value } }) => (
                          <Select
                            css={{ minWidth: '100px' }}
                            options={[
                              { label: 'Month', value: 'months' },
                              { label: 'Week', value: 'weeks' },
                              { label: 'Day', value: 'days' },
                            ]}
                            value={value}
                            disabled={shouldFormBeDisabled}
                            onValueChange={onChange}
                            id="custom_interval_denomination"
                          />
                        )}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex column>
              <Flex column>{epochsPreview(epochConfig)}</Flex>
              <Flex css={{ mt: '$xl', gap: '$xl' }}>
                <Text bold>{getRepeat(epochConfig)}</Text>
              </Flex>
            </Flex>
          </TwoColumnLayout>
          {!isEmpty(errors) && (
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mt: '$md',
                color: '$alert',
              }}
            >
              {Object.values(errors).map((error, i) => {
                {
                  console.warn(error);
                }
                return <div key={i}>{error.message}</div>;
              })}
            </Box>
          )}
        </Panel>
      </Panel>
    </Form>
  );
};

const MultipleRepeats = (value: EpochConfig) => {
  const epochStart = DateTime.fromISO(value.start_date).setZone();
  const epochEnd = DateTime.fromISO(value.end_date).setZone();

  switch (value.repeat_data?.type) {
    case 'custom': {
      const { frequency_unit, frequency } = value.repeat_data;
      const freq = { [frequency_unit]: frequency };
      const freq2 = { [frequency_unit]: frequency + frequency };
      return (
        <>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 2
          </Text>
          <Text>
            {epochStart.plus(freq).toFormat('ccc LLL d')} -{' '}
            {epochEnd.plus(freq).toFormat('ccc LLL d')}
          </Text>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 3
          </Text>
          <Text>
            {epochStart.plus(freq2).toFormat('ccc LLL d')} -{' '}
            {epochEnd.plus(freq2).toFormat('ccc LLL d')}
          </Text>
        </>
      );
    }
    default:
      return <></>;
  }
};
const epochsPreview = (value: EpochConfig) => {
  const epochStart = DateTime.fromISO(value.start_date).setZone();
  const epochEnd = DateTime.fromISO(value.end_date).setZone();

  return (
    <Flex column css={{ gap: '$xs' }}>
      <Text variant="label">Preview</Text>
      <EpochSummary value={value} />
      <Text bold css={{ mt: '$lg' }}>
        Epoch 1
      </Text>
      <Text>
        {epochStart.toFormat('ccc LLL d')} - {epochEnd.toFormat('ccc LLL d')}
      </Text>

      <MultipleRepeats {...value} />
    </Flex>
  );
};

const getRepeat = (value: EpochConfig) => {
  const startDate = DateTime.fromISO(value.start_date).setZone();

  switch (value.repeat_data?.type) {
    case 'custom':
      return `repeats every ${value.repeat_data.frequency} ${value.repeat_data.frequency_unit}`;
    case 'monthly':
      return `Every ${getSuffix(startDate.day)} of the month`;
    default:
      return `The epoch doesn't repeat.`;
  }
};

const EpochSummary = ({ value }: { value: EpochConfig }) => {
  const startDate = DateTime.fromISO(value.start_date)
    .setZone()
    .toFormat(longFormatNoTz);
  const endDate = DateTime.fromISO(value.end_date)
    .setZone()
    .toFormat(longFormat);

  return (
    <>
      <Text bold>This Epoch Period</Text>
      <Flex css={{ gap: '$sm' }}>
        {startDate + ' '} <Text bold>to</Text>
      </Flex>{' '}
      {endDate}
    </>
  );
};

const getSuffix = (day: number) => {
  const onesDigit = day % 10;
  switch (true) {
    case ~~((day % 100) / 10) === 1:
      return day + 'th';
    case onesDigit === 1:
      return day + 'st';
    case onesDigit === 2:
      return day + 'nd';
    case onesDigit === 3:
      return day + 'rd';
    default:
      return day + 'th';
  }
};

const getMonthStartDates = (
  day: string,
  activeEpoch?: { start_date: string; end_date: string }
) =>
  Array(5)
    .fill(undefined)
    .map((_, idx) => {
      let monthDiff = idx;
      const next = activeEpoch
        ? DateTime.fromISO(activeEpoch.end_date)
        : DateTime.now();
      const monthDay = Number.parseInt(day);
      if (next.day >= monthDay) monthDiff += 1;
      const nextDT = next.set({
        day: monthDay,
        month: next.month + monthDiff,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      return {
        label: nextDT.toLocaleString(),
        value: nextDT.toISO(),
      };
    });

const getNextRepeatingDates = (
  data: Pick<
    epochFormSchema,
    | 'repeat'
    | 'custom_start_date'
    | 'custom_duration_qty'
    | 'custom_duration_denomination'
    | 'custom_interval_qty'
    | 'custom_interval_denomination'
  >
): { nextStartDate: string; nextEndDate: string } => {
  let nextStartDate = DateTime.now();
  let nextEndDate = DateTime.now();
  if (data.repeat === 'monthly') {
    // FIXME
    nextStartDate = nextStartDate.plus({ months: 1 });
    nextEndDate = nextStartDate.plus({ months: 2 });
  } else if (data.repeat === 'custom') {
    nextStartDate = DateTime.fromISO(data.custom_start_date);
    nextEndDate = nextStartDate.plus({
      [data.custom_duration_denomination]: data.custom_duration_qty,
    });
  }
  nextStartDate = nextStartDate.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  nextEndDate = nextEndDate.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return {
    nextStartDate: nextStartDate.toISO(),
    nextEndDate: nextEndDate.toISO(),
  };
};

const buildRepeatData = (
  data: Omit<epochFormSchema, 'start_date' | 'end_date'>
): RepeatData => {
  if (data.repeat_view === 'one-off') return { type: 'one-off' };
  if (data.repeat === 'custom')
    return {
      type: 'custom',
      frequency: data.custom_interval_qty,
      frequency_unit: data.custom_interval_denomination,
    };
  //else  if repeat === 'monthly'
  return {
    type: 'monthly',
    weekday: 1,
    week: 1,
  };
};

export default EpochForm;
