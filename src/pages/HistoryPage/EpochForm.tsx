import { useState, useMemo, useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { DateObjectUnits, DateTime, Duration, Interval } from 'luxon';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { SafeParseReturnType, z } from 'zod';

import { FormRadioGroup, FormDatePicker, FormTimePicker } from 'components';
import { useApiAdminCircle } from 'hooks';
import { Info } from 'icons/__generated';
import {
  Box,
  Flex,
  Form,
  FormLabel,
  Link,
  Text,
  Button,
  Panel,
  Select,
  Tooltip,
} from 'ui';

import { IQueryEpoch, QueryFutureEpoch } from './getHistoryData';

const longFormat = "DD 'at' HH:mm ZZZZ";
const longFormatNoTz = "DD 'at' HH:mm";

interface EpochConfig {
  start_date: string;
  end_date: string;
  repeat: z.infer<typeof EpochRepeatEnum>;
}

interface IEpochFormSource {
  epoch?: IQueryEpoch;
  epochs?: IQueryEpoch[];
}
const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly', 'bimonthly']);
type TEpochRepeatEnum = typeof EpochRepeatEnum['_type'];

const submitSchema = z
  .object({
    start_date: z.string(),
    end_date: z.string(),
    start_time: z.string(),
    repeat: EpochRepeatEnum,
    weekDay: z.string(),
    repeat_view: z.boolean(),
    dayOfMonth: z.string(),
    repeatStartDate: z.string(),
    days: z
      .number()
      .refine(n => n >= 1, { message: 'Must be at least one day.' })
      .refine(n => n <= 100, { message: 'cant be more than 100 days' }),
    customError: z.undefined(), //unregistered to disable submitting
  })
  .strict();

const schema = z
  .object({
    start_date: z.string(),
    start_time: z.string(),
    end_date: z.string(),
    repeat: EpochRepeatEnum,
    weekDay: z.string(),
    dayOfMonth: z.string(),
    repeatStartDate: z.string(),
    repeat_view: z.boolean(),
    customError: z.undefined(), //unregistered to disable submitting
  })
  .strict();

const nextIntervalFactory = (repeat: TEpochRepeatEnum) => {
  const increment = repeat === 'weekly' ? { weeks: 1 } : { months: 1 };
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
  newRepeat: TEpochRepeatEnum,
  e: IQueryEpoch
) => {
  if (
    newInterval.overlaps(e.interval) ||
    (e.repeatEnum === 'none' && newRepeat === 'none')
  ) {
    return newInterval.overlaps(e.interval)
      ? `Overlap with an epoch starting ${e.startDate.toFormat(longFormat)}`
      : undefined;
  }
  // Only one will be allowed to be repeating
  // Set r as the repeating and c as the constant interval.
  const [r, c, next] =
    e.repeatEnum !== 'none'
      ? [e.interval, newInterval, nextIntervalFactory(e.repeatEnum)]
      : [newInterval, e.interval, nextIntervalFactory(newRepeat)];

  if (c.isBefore(r.start) || +c.end === +r.start) {
    return undefined;
  }

  let rp = r;
  while (rp.start < c.end) {
    if (rp.overlaps(c)) {
      return e.repeatEnum !== 'none'
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
  const otherRepeating = source?.epochs?.find(e => !!e.repeat);

  const getOverlapIssue = ({
    start_date,
    end_date,
    repeat,
  }: {
    start_date: DateTime;
    end_date: DateTime;
    repeat: TEpochRepeatEnum;
  }) => {
    const interval = Interval.fromDateTimes(start_date, end_date);

    const collisionMessage = source?.epochs
      ? source?.epochs
          .map(e => getCollisionMessage(interval, repeat, e))
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
    .transform(({ start_date, end_date, ...fields }) => ({
      start_date: DateTime.fromISO(start_date)
        .set(
          Duration.fromISOTime(fields.start_time).toObject() as DateObjectUnits
        )
        .setZone(),
      end_date: DateTime.fromISO(end_date)
        .set(
          Duration.fromISOTime(fields.start_time).toObject() as DateObjectUnits
        )
        .setZone(),
      ...fields,
    }))
    .transform(({ repeat_view, repeatStartDate, ...fields }) => {
      if (repeat_view && fields.repeat !== 'none') {
        const { nextStartDate, nextEndDate } = getNextRepeatingDates(
          fields.repeat,
          fields.weekDay,
          repeatStartDate,
          currentEpoch
        );
        return {
          repeat_view,
          repeatStartDate,
          ...fields,
          start_date: DateTime.fromISO(nextStartDate),
          end_date: DateTime.fromISO(nextEndDate),
        };
      }
      return {
        repeat_view,
        repeatStartDate,
        ...fields,
      };
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
    .refine(({ repeat_view }) => !(repeat_view && !!otherRepeating), {
      path: ['repeat'],
      // the getOverlapIssue relies on this invariant.
      message: `Only one repeating epoch allowed.`,
    })
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
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Twice a Month',
    value: 'bimonthly',
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
  const { createEpoch, updateEpoch, updateActiveRepeatingEpoch } =
    useApiAdminCircle(circleId);

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
          : true,
      repeatStartDate: getMonthStartDates(
        source?.epoch?.start_date
          ? DateTime.fromISO(source.epoch.start_date).day.toString()
          : ((DateTime.now().day + 1) % 32 || 1).toString(),
        currentEpoch
      )[0].value,
      repeat:
        typeof source?.epoch?.repeat === 'number'
          ? source.epoch?.repeat === 1
            ? 'weekly'
            : source.epoch.repeat === 3
            ? 'bimonthly'
            : 'monthly'
          : 'monthly',
      dayOfMonth: source?.epoch?.start_date
        ? DateTime.fromISO(source.epoch.start_date).day.toString()
        : ((DateTime.now().day + 1) % 32 || 1).toString(),
      weekDay: '1',
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
          DateTime.fromISO(source.epoch.start_date).toISO()) ??
        DateTime.now().setZone().plus({ days: 1 }).toISO(),
      end_date: source?.epoch?.end_date
        ? DateTime.fromISO(source.epoch.end_date)
            .plus(source.epoch.days || 0)
            .toISO()
        : DateTime.now().setZone().plus({ days: 8 }).toISO(),
    },
  });

  const [epochConfig, setEpochConfig] = useState<EpochConfig>({
    start_date: source?.epoch
      ? getValues('start_date')
      : getValues('repeatStartDate'),
    end_date: source?.epoch
      ? getValues('end_date')
      : DateTime.fromISO(getValues('repeatStartDate'))
          .plus({ weeks: 2 })
          .toISO(),
    repeat: getValues('repeat'),
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
    }
  };

  // validate the default form state on first load
  useEffect(() => {
    validateState(getValues());
  }, []);

  useEffect(() => {
    watch((data, { name, type }) => {
      const {
        repeat_view,
        repeat,
        repeatStartDate,
        weekDay,
        dayOfMonth,
        start_date,
        start_time,
        end_date,
      } = data;
      if (name === 'dayOfMonth' && type === 'change' && dayOfMonth) {
        setValue(
          'repeatStartDate',
          getMonthStartDates(dayOfMonth, currentEpoch)[0].value
        );
      }

      if (typeof repeat === 'string') {
        if (repeat_view && repeat !== 'none' && weekDay && repeatStartDate) {
          const { nextStartDate, nextEndDate } = getNextRepeatingDates(
            repeat,
            weekDay,
            repeatStartDate,
            currentEpoch
          );
          setEpochConfig({
            start_date: nextStartDate,
            end_date: nextEndDate,
            repeat,
          });
        } else {
          if (start_date && end_date && start_time)
            setEpochConfig({
              start_date: DateTime.fromISO(start_date)
                .set(
                  Duration.fromISOTime(start_time).toObject() as DateObjectUnits
                )
                .toISO(),
              end_date: DateTime.fromISO(end_date)
                .set(
                  Duration.fromISOTime(start_time).toObject() as DateObjectUnits
                )
                .toISO(),
              repeat: 'none',
            });
        }
      }

      validateState(data);
    });
  });

  const onSubmit: SubmitHandler<epochFormSchema> = async () => {
    if (extraErrors.current) {
      return;
    }

    setSubmitting(true);
    const payload = {
      start_date: epochConfig.start_date,
      // rounding needed to santize fractional days from timezone shifts
      days: Math.round(
        DateTime.fromISO(epochConfig.end_date)
          .diff(DateTime.fromISO(epochConfig.start_date))
          .as('days')
      ),
      repeat:
        epochConfig.repeat === 'weekly'
          ? 1
          : epochConfig.repeat === 'monthly'
          ? 2
          : epochConfig.repeat === 'bimonthly'
          ? 3
          : 0,
    };

    (source?.epoch
      ? selectedEpoch?.number !== -1
        ? updateEpoch(source.epoch.id, payload)
        : updateActiveRepeatingEpoch(source.epoch.id, {
            current: {
              start_date: currentEpoch?.start_date || '',
              days: payload.days,
              repeat: 0,
            },
            next: payload,
          })
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

  const monthStartDates = getMonthStartDates(
    getValues('dayOfMonth'),
    currentEpoch
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
              color="primary"
              outlined
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
          <Flex column>
            <Text h3 semibold>
              Epoch Timing
            </Text>
            <Text p size="small" css={{ mt: '$md' }}>
              An Epoch is a period of time where circle members contribute value
              & allocate {'GIVE'} tokens to one another.{' '}
              <span>
                <Link
                  href="https://docs.coordinape.com/get-started/epochs/create-an-epoch"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </Link>
              </span>
            </Text>
          </Flex>
          <Flex css={{ mt: '$xl', gap: '$xl' }}>
            <Text h3>Epoch Frequency</Text>
            <Text bold>{getRepeat(epochConfig)}</Text>
          </Flex>
          <Box
            css={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr',
              mt: '$md',
              gap: '$2xl',
              '@sm': { gridTemplateColumns: '1fr' },
            }}
          >
            <Flex column>
              <Flex column css={{ mt: '$sm ', mb: '$md' }}>
                <FormRadioGroup
                  name="repeat_view"
                  control={control}
                  options={[
                    { label: 'Repeats', value: true },
                    { label: 'Does Not Repeat', value: false },
                  ]}
                  label="Type"
                  infoTooltip="Decide whether the epoch will repeat monthly or weekly or will not repeat after ending"
                />
              </Flex>
              <Flex
                css={{
                  flexWrap: 'wrap',
                  gap: '$md',
                  display: getValues('repeat_view') ? 'none' : 'flex',
                }}
              >
                <Flex
                  column
                  css={{
                    alignItems: 'flex-start',
                    maxWidth: '150px',
                    gap: '$xs',
                  }}
                >
                  <FormLabel type="label" css={{ fontWeight: '$bold' }}>
                    Start Date{' '}
                    <Tooltip content="The first day of the epoch in your local time zone">
                      <Info size="sm" />
                    </Tooltip>
                  </FormLabel>
                  <Controller
                    control={control}
                    name="start_date"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FormDatePicker
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                        disabled={shouldFormBeDisabled}
                        format="MMM dd, yyyy"
                        style={{
                          marginLeft: 0,
                        }}
                      />
                    )}
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
                  <FormLabel type="label" css={{ fontWeight: '$bold' }}>
                    End Date{' '}
                    <Tooltip content="The last day of the epoch in your local time zone">
                      <Info size="sm" />
                    </Tooltip>
                  </FormLabel>
                  <Controller
                    control={control}
                    name="end_date"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <FormDatePicker
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                        disabled={shouldFormBeDisabled}
                        format="MMM dd, yyyy"
                        style={{
                          marginLeft: 0,
                        }}
                      />
                    )}
                  />
                </Flex>
                <Flex column css={{ gap: '$xs' }}>
                  <FormLabel type="label" css={{ fontWeight: '$bold' }}>
                    Time{' '}
                    <Tooltip content="The time the epoch will start and end in your local time zone">
                      <Info size="sm" />
                    </Tooltip>
                  </FormLabel>
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
                    <Text font="inter" size="medium">
                      In your
                      <br /> local timezone
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                column
                css={{
                  display: getValues('repeat_view') ? 'flex' : 'none',
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
                    defaultValue="monthly"
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
                  css={{
                    gap: '$xs',
                    display:
                      getValues('repeat') === 'monthly' ? 'flex' : 'none',
                  }}
                >
                  <Controller
                    control={control}
                    name="dayOfMonth"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        css={{ minWidth: '280px' }}
                        onValueChange={onChange}
                        value={value}
                        disabled={shouldFormBeDisabled}
                        options={Array(31)
                          .fill(undefined)
                          .map((_, idx) => ({
                            label: (idx + 1).toString(),
                            value: (idx + 1).toString(),
                          }))}
                        id="day_of_month"
                        label="Day Of Month"
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
                    display: getValues('repeat') == 'monthly' ? 'flex' : 'none',
                  }}
                >
                  <Controller
                    control={control}
                    name="repeatStartDate"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        css={{ minWidth: '280px' }}
                        defaultValue={monthStartDates[0].value}
                        onValueChange={onChange}
                        value={value}
                        disabled={shouldFormBeDisabled}
                        options={monthStartDates}
                        id="repeatStartDate"
                        label="Start Date"
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
                    display: getValues('repeat').includes('monthly')
                      ? 'none'
                      : 'flex',
                  }}
                >
                  <Controller
                    control={control}
                    name="weekDay"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        css={{ minWidth: '280px' }}
                        defaultValue={monthStartDates[0].value}
                        onValueChange={onChange}
                        value={value}
                        disabled={shouldFormBeDisabled}
                        options={[
                          'Monday',
                          'Tuesday',
                          'Wednesday',
                          'Thursday',
                          'Friday',
                          'Saturday',
                          'Sunday',
                        ].map((d, idx) => ({
                          label: d,
                          value: (idx + 1).toString(),
                        }))}
                        id="start_date"
                        label="day of week"
                      />
                    )}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex column>{epochsPreview(epochConfig)}</Flex>
          </Box>
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
                return <div key={i}>{error.message}</div>;
              })}
            </Box>
          )}
        </Panel>
      </Panel>
    </Form>
  );
};

const epochsPreview = (value: EpochConfig) => {
  const epochStart = DateTime.fromISO(value.start_date).setZone();
  const epochEnd = DateTime.fromISO(value.end_date).setZone();
  return (
    <Flex css={{ flexDirection: 'column', gap: '$xs' }}>
      <Text variant="label">Preview</Text>
      <EpochSummary value={value} />
      <Text bold css={{ mt: '$lg' }}>
        Epoch 1
      </Text>
      <Text>
        {epochStart.toFormat('ccc LLL d')} - {epochEnd.toFormat('ccc LLL d')}
      </Text>
      {(value.repeat === 'weekly' || value.repeat.includes('monthly')) && (
        <>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 2
          </Text>
          <Text>
            {value.repeat === 'bimonthly'
              ? epochEnd.toFormat('ccc LLL d')
              : epochStart
                  .plus(
                    value.repeat === 'monthly'
                      ? { months: 1 }
                      : value.repeat === 'weekly'
                      ? { weeks: 1 }
                      : {}
                  )
                  .toFormat('ccc LLL d')}{' '}
            -{' '}
            {value.repeat === 'bimonthly'
              ? epochStart.plus({ months: 1 }).toFormat('ccc LLL d')
              : epochEnd
                  .plus(
                    value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 }
                  )
                  .toFormat('ccc LLL d')}
          </Text>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 3
          </Text>
          <Text>
            {value.repeat === 'bimonthly'
              ? epochStart.plus({ months: 1 }).toFormat('ccc LLL d')
              : epochStart
                  .plus(
                    value.repeat === 'monthly' ? { months: 2 } : { weeks: 2 }
                  )
                  .toFormat('ccc LLL d')}{' '}
            -{' '}
            {value.repeat === 'bimonthly'
              ? epochEnd.plus({ months: 1 }).toFormat('ccc LLL d')
              : epochEnd
                  .plus(
                    value.repeat === 'monthly' ? { months: 2 } : { weeks: 2 }
                  )
                  .toFormat('ccc LLL d')}
          </Text>
        </>
      )}
      <Text bold css={{ mt: '$lg' }}>
        {value.repeat === 'bimonthly'
          ? 'Repeats Twice a Month'
          : value.repeat === 'monthly'
          ? 'Repeats Every Month'
          : value.repeat === 'weekly'
          ? 'Repeats Every Week'
          : ''}
      </Text>
    </Flex>
  );
};

const getRepeat = (value: EpochConfig) => {
  const startDate = DateTime.fromISO(value.start_date).setZone();

  const repeating =
    value.repeat === 'monthly'
      ? `Every ${getSuffix(startDate.day)} of the month`
      : value.repeat === 'weekly'
      ? `Every ${startDate.weekdayLong}`
      : value.repeat === 'bimonthly'
      ? '1st & 15th of Each Month'
      : "The epoch doesn't repeat.";

  return repeating;
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

const getWeekStartDates = (
  weekDay: string,
  activeEpoch?: { end_date: string }
) => {
  const weekday = Number.parseInt(weekDay);
  const next = activeEpoch
    ? DateTime.fromISO(activeEpoch.end_date)
    : DateTime.now();
  return next.weekday >= weekday
    ? next.plus({ weeks: 1 }).set({ weekday })
    : next.set({ weekday });
};

const getBimonthlyStartDates = (activeEpoch?: {
  end_date: string;
}): { nextStartDate: DateTime; nextEndDate: DateTime } => {
  const next = activeEpoch
    ? DateTime.fromISO(activeEpoch.end_date)
    : DateTime.now();
  if (next.day >= 15)
    return {
      nextStartDate: next.plus({ months: 1 }).set({ day: 1 }),
      nextEndDate: next.plus({ months: 1 }).set({ day: 15 }),
    };

  return {
    nextStartDate: next.set({ day: 15 }),
    nextEndDate: next.set({ day: next.daysInMonth + 1 }),
  };
};

const getNextRepeatingDates = (
  repeat: Exclude<z.infer<typeof EpochRepeatEnum>, 'none'>,
  weekDay: string,
  monthlyStartDate: string,
  activeEpoch?: { end_date: string }
): { nextStartDate: string; nextEndDate: string } => {
  let nextStartDate = DateTime.now();
  let nextEndDate = DateTime.now();
  if (repeat === 'monthly') {
    nextStartDate = DateTime.fromISO(monthlyStartDate).setZone();
    nextEndDate = nextStartDate.plus({ months: 1 });
  } else if (repeat === 'weekly') {
    nextStartDate = getWeekStartDates(weekDay, activeEpoch);
    nextEndDate = nextStartDate.plus({ weeks: 1 });
  } else if (repeat === 'bimonthly') {
    const bimonthlyResult = getBimonthlyStartDates(activeEpoch);
    nextStartDate = bimonthlyResult.nextStartDate;
    nextEndDate = bimonthlyResult.nextEndDate;
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

export default EpochForm;
