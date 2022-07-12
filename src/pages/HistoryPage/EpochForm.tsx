import { useState, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import isEmpty from 'lodash/isEmpty';
import { DateTime, Interval } from 'luxon';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { SafeParseReturnType, z } from 'zod';

import {
  FormInputField,
  FormRadioGroup,
  FormDatePicker,
  FormTimePicker,
} from 'components';
import { useApiAdminCircle } from 'hooks';
import { Box, Flex, Form, FormLabel, Text, Button, Panel, Tooltip } from 'ui';
import { extraEpoch } from 'utils/modelExtenders';

import { IEpoch, IApiEpoch } from 'types';

const longFormat = "DD 'at' H:mm";

interface IEpochFormSource {
  epoch?: IEpoch;
  epochs?: IEpoch[];
}
const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly']);
type TEpochRepeatEnum = typeof EpochRepeatEnum['_type'];

const schema = z
  .object({
    start_date: z.string(),
    repeat: EpochRepeatEnum,
    days: z
      .number()
      .refine(n => n >= 1, { message: 'Must be at least one day.' })
      .refine(n => n <= 100, { message: 'cant be more than 100 days' }),
  })
  .strict();
const nextIntervalFactory = (repeat: TEpochRepeatEnum) => {
  const increment = repeat === 'weekly' ? { weeks: 1 } : { months: 1 };
  return (i: Interval) =>
    Interval.fromDateTimes(i.start.plus(increment), i.end.plus(increment));
};

const getCollisionMessage = (
  newInterval: Interval,
  newRepeat: TEpochRepeatEnum,
  e: IEpoch
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

const getZodParser = (source?: IEpochFormSource) => {
  const otherRepeating = source?.epochs?.find(e => !!e.repeat);

  const getOverlapIssue = ({
    start_date,
    days,
    repeat,
  }: {
    start_date: DateTime;
    days: number;
    repeat: TEpochRepeatEnum;
  }) => {
    const interval = Interval.fromDateTimes(
      start_date,
      start_date.plus({ days })
    );

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
    .transform(({ start_date, ...fields }) => ({
      start_date: DateTime.fromISO(start_date).setZone(),
      ...fields,
    }))
    .refine(({ start_date }) => start_date > DateTime.now().setZone(), {
      path: ['start_date'],
      message: 'Start date must be in the future',
    })
    .refine(
      ({ start_date, days }) =>
        start_date.plus({ days }) > DateTime.now().setZone(),
      {
        path: ['days'],
        message: 'Epoch must end in the future',
      }
    )
    .superRefine((val, ctx) => {
      let message;
      if (val.days > 7 && val.repeat === 'weekly') {
        message =
          'You cannot have more than 7 days length for a weekly repeating epoch.';
      } else if (val.days > 28 && val.repeat === 'monthly') {
        message =
          'You cannot have more than 28 days length for a monthly repeating epoch.';
      }

      if (message) {
        ctx.addIssue({
          path: ['days'],
          code: z.ZodIssueCode.custom,
          message,
        });
      }
    })
    .refine(({ repeat }) => !(repeat !== 'none' && !!otherRepeating), {
      path: ['repeat'],
      // the getOverlapIssue relies on this invariant.
      message: `Only one repeating epoch allowed.`,
    })
    .refine(
      v => !getOverlapIssue(v),
      v => getOverlapIssue(v) ?? {}
    )
    .transform(({ start_date, ...fields }) => ({
      start_date: start_date.toISO(),
      ...fields,
    }));
};

type epochFormSchema = z.infer<typeof schema>;

const repeat = [
  {
    label: 'Does not repeat',
    value: 'none',
  },
  {
    label: 'Repeats monthly',
    value: 'monthly',
  },
  {
    label: 'Repeats weekly',
    value: 'weekly',
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
  selectedEpoch: IApiEpoch | undefined;
  epochs: IApiEpoch[] | undefined;
  currentEpoch: IApiEpoch | undefined;
  circleId: number;
  setNewEpoch: (e: boolean) => void;
  setEditEpoch: (e: IApiEpoch | undefined) => void;
  onClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { createEpoch, updateEpoch } = useApiAdminCircle(circleId);

  const source = useMemo(
    () => ({
      epoch: selectedEpoch ? extraEpoch(selectedEpoch) : undefined,
      epochs: currentEpoch
        ? epochs
            ?.filter(e => e.id !== selectedEpoch?.id)
            .concat(currentEpoch)
            .map(e => extraEpoch(e))
        : epochs
            ?.filter(e => e.id !== selectedEpoch?.id)
            .map(e => extraEpoch(e)),
    }),
    [selectedEpoch, epochs, currentEpoch]
  );
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setError,
  } = useForm<epochFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',

    defaultValues: {
      days: source?.epoch?.days ?? source?.epoch?.calculatedDays ?? 4,
      start_date:
        source?.epoch?.start_date ??
        DateTime.now().setZone().plus({ days: 1 }).toISO(),
    },
  });
  const watchFields = watch();

  const onSubmit: SubmitHandler<epochFormSchema> = async data => {
    const value: SafeParseReturnType<epochFormSchema, epochFormSchema> =
      getZodParser(source).safeParse(data);
    if (!value.success) {
      const path = value.error.errors[0].path[0];
      setError(
        path === 'repeat' ? 'repeat' : path === 'days' ? 'days' : 'start_date',
        {
          message: value.error.errors[0].message,
        }
      );
      return;
    }
    setSubmitting(true);
    (source?.epoch
      ? updateEpoch(source.epoch.id, {
          ...data,
          repeat:
            data.repeat === 'weekly' ? 1 : data.repeat === 'monthly' ? 2 : 0,
        })
      : createEpoch({
          ...data,
          repeat:
            data.repeat === 'weekly' ? 1 : data.repeat === 'monthly' ? 2 : 0,
        })
    )
      .then(() => {
        setSubmitting(false);
      })
      .then(onClose)
      .catch(console.warn);
  };

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
              disabled={submitting}
              onClick={handleSubmit(onSubmit)}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Flex>
        </Flex>
        <Panel nested css={{ mt: '$md' }}>
          <Flex column>
            <Text h3 semibold>
              Epoch timing
            </Text>
            <Text css={{ mt: '$md', display: 'block' }}>
              An Epoch is a period of time where circle members contribute value
              & allocate {'GIVE'} tokens to one another.{' '}
              <span>
                <a
                  href="https://docs.coordinape.com/get-started/epochs/create-an-epoch"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </a>
              </span>
            </Text>
          </Flex>
          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: '$1xl',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '$lg',
            }}
          >
            <Flex column>
              <Flex css={{ flexWrap: 'wrap', gap: '$md' }}>
                <Flex
                  column
                  css={{ alignItems: 'flex-start', maxWidth: '150px' }}
                >
                  <FormLabel type="label" css={{ fontWeight: '$bold' }}>
                    Start Date{' '}
                    <Tooltip
                      content={
                        <Box>
                          The first day of the epoch in your local time zone
                        </Box>
                      }
                    >
                      <InfoCircledIcon />
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
                        format="MMM dd, yyyy"
                        style={{
                          marginLeft: 0,
                        }}
                      />
                    )}
                  />
                </Flex>
                <Flex css={{ maxWidth: '150px', gap: '$xs' }}>
                  <FormInputField
                    id="days"
                    name="days"
                    defaultValue={
                      source?.epoch?.days ?? source?.epoch?.calculatedDays ?? 4
                    }
                    control={control}
                    label="Duration (days)"
                    infoTooltip={'How long the epoch lasts in days'}
                    number
                  />
                </Flex>
                <Flex css={{ gap: '$md', alignItems: 'flex-end' }}>
                  <Flex
                    column
                    css={{
                      alignItems: 'flex-start',
                      maxWidth: '150px',
                    }}
                  >
                    <FormLabel type="label" css={{ fontWeight: '$bold' }}>
                      Start Time{' '}
                      <Tooltip
                        content={
                          <Box>
                            The start time of the epoch in your local time zone
                          </Box>
                        }
                      >
                        <InfoCircledIcon />
                      </Tooltip>
                    </FormLabel>
                    <Controller
                      control={control}
                      name="start_date"
                      render={({ field: { onChange, value, onBlur } }) => (
                        <FormTimePicker
                          onBlur={onBlur}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </Flex>
                  <Text font="inter" size="medium" css={{ pb: '$sm' }}>
                    In your
                    <br /> local timezone
                  </Text>
                </Flex>
              </Flex>
              <Flex column css={{ mt: '$lg ' }}>
                <FormRadioGroup
                  name="repeat"
                  control={control}
                  defaultValue={
                    source?.epoch?.repeat === 2
                      ? 'monthly'
                      : source?.epoch?.repeat === 1
                      ? 'weekly'
                      : 'none'
                  }
                  options={repeat}
                  label="Type"
                  infoTooltip="Decide whether the epoch will repeat monthly or weekly or will not repeat after ending"
                />
              </Flex>
              <Box css={{ maxWidth: '900px', mt: '$xl' }}>
                {summarizeEpoch(watchFields)}
              </Box>
            </Flex>
            <Flex column>{epochsPreview(watchFields)}</Flex>
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
              {Object.values(errors).map((error, i) => (
                <div key={i}>{error.message}</div>
              ))}
            </Box>
          )}
        </Panel>
      </Panel>
    </Form>
  );
};

const epochsPreview = (
  value: Omit<epochFormSchema, 'repeat'> & { repeat: string | number }
) => {
  const epochStart = DateTime.fromISO(value.start_date).setZone();
  const epochEnd = epochStart.plus({
    days: value.days,
  });
  return (
    <Flex css={{ flexDirection: 'column', gap: '$xs' }}>
      <Text variant="label">Preview</Text>
      <Text bold css={{ mt: '$sm' }}>
        Epoch 1
      </Text>
      <Text>
        {epochStart.toFormat('ccc LLL d')} - {epochEnd.toFormat('ccc LLL d')}
      </Text>
      {(value.repeat === 'weekly' || value.repeat === 'monthly') && (
        <>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 2
          </Text>
          <Text>
            {epochStart
              .plus(value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 })
              .toFormat('ccc LLL d')}{' '}
            -{' '}
            {epochEnd
              .plus(value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 })
              .toFormat('ccc LLL d')}
          </Text>
          <Text bold css={{ mt: '$sm' }}>
            Epoch 3
          </Text>
          <Text>
            {epochStart
              .plus(value.repeat === 'monthly' ? { months: 2 } : { weeks: 2 })
              .toFormat('ccc LLL d')}{' '}
            -{' '}
            {epochEnd
              .plus(value.repeat === 'monthly' ? { months: 2 } : { weeks: 2 })
              .toFormat('ccc LLL d')}
          </Text>
        </>
      )}
      <Text css={{ mt: '$sm' }}>
        {value.repeat === 'monthly'
          ? 'Repeats monthly'
          : value.repeat === 'weekly'
          ? 'Repeats weekly'
          : ''}
      </Text>
    </Flex>
  );
};

const summarizeEpoch = (
  value: Omit<epochFormSchema, 'repeat'> & { repeat: string | number }
) => {
  const startDate = DateTime.fromISO(value.start_date)
    .setZone()
    .toFormat(longFormat);
  const endDate = DateTime.fromISO(value.start_date)
    .setZone()
    .plus({ days: value.days })
    .toFormat(longFormat);

  const nextRepeat = DateTime.fromISO(value.start_date)
    .setZone()
    .plus(value.repeat === 'monthly' ? { months: 1 } : { weeks: 1 })
    .toFormat('DD');

  const repeating =
    value.repeat === 'monthly'
      ? `The epoch is set to repeat every month; the following epoch will start on ${nextRepeat}.`
      : value.repeat === 'weekly'
      ? `The epoch is set to repeat every week; the following epoch will start on ${nextRepeat}.`
      : "The epoch doesn't repeat.";

  return `This epoch starts on ${startDate} and will end on ${endDate}. ${repeating}`;
};
export default EpochForm;
