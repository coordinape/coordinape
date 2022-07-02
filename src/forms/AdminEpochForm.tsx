import { useState, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { DateTime, Interval } from 'luxon';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import {
  FormInputField,
  NewFormRadioGroup,
  FormDatePicker,
  FormTimePicker,
} from 'components';
import { useApiAdminCircle } from 'hooks';
import { Box, Flex, Form, FormLabel, Text, Button, Panel } from 'ui';
import { extraEpoch } from 'utils/modelExtenders';

import { IEpoch, IApiEpoch } from 'types';

const longUTCFormat = "DD 'at' H:mm 'UTC'";

interface IEpochFormSource {
  epoch?: IEpoch;
  epochs?: IEpoch[];
}
const EpochRepeatEnum = z.enum(['none', 'monthly', 'weekly']);

const schema = z
  .object({
    start_date: z.string(),
    repeat: EpochRepeatEnum.transform(r =>
      r === 'weekly' ? 1 : r === 'monthly' ? 2 : 0
    ),
    days: z
      .number()
      .min(1, 'Must be at least one day.')
      .max(100, 'cant be more than 100 days'),
  })
  .strict();

const nextIntervalFactory = (repeat: number) => {
  const increment = repeat === 1 ? { weeks: 1 } : { months: 1 };
  return (i: Interval) =>
    Interval.fromDateTimes(i.start.plus(increment), i.end.plus(increment));
};

const getCollisionMessage = (
  newInterval: Interval,
  newRepeat: number,
  e: IEpoch
) => {
  if (
    newInterval.overlaps(e.interval) ||
    (e.repeatEnum === 'none' && newRepeat === 0)
  ) {
    console.log('number: ', e.number);

    return newInterval.overlaps(e.interval)
      ? `Overlap with epoch ${
          e.number ?? 'x'
        } with start ${e.startDate.toFormat(longUTCFormat)}`
      : undefined;
  }
  // Only one will be allowed to be repeating
  // Set r as the repeating and c as the constant interval.
  const [r, c, next] =
    e.repeatEnum !== 'none'
      ? [
          e.interval,
          newInterval,
          nextIntervalFactory(e.repeatEnum === 'weekly' ? 1 : 2),
        ]
      : [newInterval, e.interval, nextIntervalFactory(newRepeat)];

  if (c.isBefore(r.start) || +c.end === +r.start) {
    return undefined;
  }

  let rp = r;
  while (rp.start < c.end) {
    if (rp.overlaps(c)) {
      return e.repeatEnum !== 'none'
        ? `Overlap with repeating epoch ${e.number ?? 'x'}: ${rp.toFormat(
            longUTCFormat
          )}`
        : `After repeat, new epoch overlaps ${
            e.number ?? 'x'
          }: ${e.startDate.toFormat(longUTCFormat)}`;
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
    repeat: number;
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
      start_date: DateTime.fromISO(start_date, { zone: 'utc' }),
      ...fields,
    }))
    .refine(({ start_date }) => start_date > DateTime.utc(), {
      path: ['start_date'],
      message: 'Start date must be in the future',
    })
    .refine(
      ({ start_date, days }) => start_date.plus({ days }) > DateTime.utc(),
      {
        path: ['days'],
        message: 'Epoch must end in the future',
      }
    )
    .refine(({ repeat, days }) => !(repeat === 1 && days > 7), {
      path: ['days'],
      message: "Can't have more than 7 days when repeating weekly",
    })
    .refine(
      ({ repeat, days }) => {
        return !(repeat === 2 && days > 28);
      },
      {
        path: ['repeat'],
        message: "Can't have more than 28 days when repeating monthly",
      }
    )
    .refine(({ repeat }) => !(repeat !== 0 && !!otherRepeating), {
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

const AdminEpochForm = ({
  selectedEpoch,
  epochs,
  currentEpoch,
  circleId,
  setNewEpoch,
  setEditEpoch,
}: {
  selectedEpoch: IApiEpoch | undefined;
  epochs: IApiEpoch[] | undefined;
  currentEpoch: IApiEpoch | undefined;
  circleId: number;
  setNewEpoch: (e: boolean) => void;
  setEditEpoch: (e: IApiEpoch | undefined) => void;
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
  } = useForm<epochFormSchema>({
    resolver: zodResolver(getZodParser(source)),
    mode: 'all',

    defaultValues: {
      days: source?.epoch?.days ?? source?.epoch?.calculatedDays ?? 4,
      start_date:
        source?.epoch?.start_date ?? DateTime.utc().plus({ days: 1 }).toISO(),
    },
  });
  const watchFields = watch();

  const onSubmit: SubmitHandler<epochFormSchema> = async data => {
    setSubmitting(true);
    (source?.epoch ? updateEpoch(source.epoch.id, data) : createEpoch(data))
      .then(() => {
        setSubmitting(false);
      })
      .catch(console.warn);
  }; // TODO Token Name
  return (
    <Form>
      <Panel css={{ mb: '$md', p: '$md' }}>
        <Flex css={{ justifyContent: 'space-between' }}>
          <Text semibold css={{ color: '$secondaryText', fontSize: 'large' }}>
            {selectedEpoch ? 'Edit Epoch' : 'New Epoch'}
          </Text>

          <Flex css={{ gap: '$md' }}>
            <Button
              color="primary"
              outlined
              type="submit"
              disabled={submitting}
              onClick={handleSubmit(onSubmit)}
            >
              {submitting ? 'Saving...' : 'Save Epoch'}
            </Button>
            <Button
              color="primary"
              outlined
              onClick={() => {
                selectedEpoch ? setEditEpoch(undefined) : setNewEpoch(false);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
        <Panel nested css={{ mt: '$md' }}>
          <Flex column>
            <Text h3 semibold css={{ ml: '$sm' }}>
              Epoch timing
            </Text>
            <Text css={{ mt: '$md', ml: '$sm', display: 'block' }}>
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
          <Flex css={{ justifyContent: 'space-between', mt: '$1xl' }}>
            <Flex column>
              <Flex css={{ flexWrap: 'wrap', gap: '$md' }}>
                <Flex
                  column
                  css={{ alignItems: 'flex-start', maxWidth: '150px' }}
                >
                  <FormLabel
                    type="label"
                    css={{ fontWeight: '$bold', pl: '$sm' }}
                  >
                    Start Date
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
                      />
                    )}
                  />
                </Flex>
                <Box css={{ maxWidth: '150px' }}>
                  <FormInputField
                    id="days"
                    name="days"
                    control={control}
                    label="Duration"
                    number
                  />
                </Box>
                <Flex
                  column
                  css={{ alignItems: 'flex-start', maxWidth: '150px' }}
                >
                  <FormLabel
                    type="label"
                    css={{ fontWeight: '$bold', pl: '$sm' }}
                  >
                    Start Time
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
              </Flex>
              <Flex column css={{ ml: '$sm' }}>
                <NewFormRadioGroup
                  name="repeat"
                  control={control}
                  defaultValue={
                    source?.epoch?.repeat === 1
                      ? 'monthly'
                      : source?.epoch?.repeat === 2
                      ? 'weekly'
                      : 'none'
                  }
                  options={repeat}
                  label="Type"
                />
              </Flex>
            </Flex>
            <Flex column>{summarizeEpoch(watchFields)}</Flex>
          </Flex>
          {!isEmpty(errors) && (
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                ml: '$sm',
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

export const summarizeEpoch = (value: epochFormSchema) => {
  const epochStart = DateTime.fromISO(value.start_date, { zone: 'utc' });
  const epochEnd = epochStart.plus({
    days: value.days,
  });
  return (
    <>
      <Text>Epoch 1</Text>
      <Text>
        {epochStart.toFormat('ccc LLL d')} -{epochEnd.toFormat('ccc LLL d')}
      </Text>
      {(value.repeat === 2 || value.repeat === 1) && (
        <>
          <Text>Epoch 2</Text>
          <Text>
            {epochStart
              .plus(value.repeat === 2 ? { months: 1 } : { weeks: 1 })
              .toFormat('ccc LLL d')}{' '}
            -
            {epochEnd
              .plus(value.repeat === 2 ? { months: 1 } : { weeks: 1 })
              .toFormat('ccc LLL d')}
          </Text>
          <Text>Epoch 3</Text>
          <Text>
            {epochStart
              .plus(value.repeat === 2 ? { months: 2 } : { weeks: 2 })
              .toFormat('ccc LLL d')}{' '}
            -
            {epochEnd
              .plus(value.repeat === 2 ? { months: 2 } : { weeks: 2 })
              .toFormat('ccc LLL d')}
          </Text>
        </>
      )}
      <Text>
        {value.repeat === 2
          ? 'Repeat every months'
          : value.repeat === 1
          ? 'Repeats every week.'
          : "The epoch doesn't repeat."}
      </Text>
    </>
  );
};

export default AdminEpochForm;
