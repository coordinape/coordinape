import React, { useState, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useForm, useController } from 'react-hook-form';
import * as z from 'zod';

import { FormRadioGroup } from 'components';
import { useSelectedCircle } from 'recoilState/app';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Flex,
  Form,
  FormLabel,
  Panel,
  Text,
  TextField,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { getCircleAvatar } from 'utils/domain';

const DOCS_HREF = 'https://docs.coordinape.com/welcome/admin_info';
const DOCS_TEXT = 'See the docs...';

const labelStyles = {
  textAlign: 'center',
  mb: '$sm',
};
/*
const textAreaStyles = {
  width: '$full',
  fontWeight: '$light',
  fontSize: '$4',
  lineHeight: 'none',
};*/

const ToolTip = ({
  optionsInfo = [
    {
      label: '',
      text: '',
    },
  ],
  href = '',
  anchorText = '',
}) => {
  return (
    <>
      {optionsInfo.map(info => (
        <div key={info.label}>
          <strong>{info.label}</strong> - {info.text}
          <br />
        </div>
      ))}
      {href && (
        <Link
          css={{
            display: 'block',
            margin: '$sm 0 0',
            textAlign: 'center',
            color: '$link',
          }}
          rel="noreferrer"
          target="_blank"
          href={href}
        >
          {anchorText}
        </Link>
      )}
    </>
  );
};

const radioGroupOptions = {
  yesNo: [
    {
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    },
  ],
  onOff: [
    {
      value: 'true',
      label: 'On',
    },
    {
      value: 'false',
      label: 'Off',
    },
  ],
  epochType: [
    {
      value: 'true',
      label: 'Repeating',
    },
    {
      value: 'false',
      label: 'One Time',
    },
  ],
  repeat: [
    {
      value: 'monthly',
      label: 'Monthly',
    },
    {
      value: 'biweekly',
      label: 'Every Two Weeks',
    },
    {
      value: 'weekly',
      label: 'Weekly',
    },
  ],
};

const stringBoolTransform = (val: string) => {
  return val === 'true' ? true : false;
};

const schema = z
  .object({
    circleName: z.string().refine(val => val.trim().length >= 3, {
      message: 'Circle Name must be at least 3 characters long.',
    }),
    circleLogo: z.string().optional(),
    defaultOptIn: z.string().transform(stringBoolTransform),
    onlyGiverVouch: z.string().transform(stringBoolTransform),
    teamSelection: z.string().transform(stringBoolTransform),
    autoOptOut: z.string().transform(stringBoolTransform),
    epochRepeat: z.string().transform(stringBoolTransform),
    epochRepeatTime: z
      .string()
      .transform(repeat =>
        repeat === 'weekly'
          ? 1
          : repeat === 'monthly'
          ? 2
          : repeat === 'biweekly'
          ? 3
          : 0
      ),
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
  })
  .strict();

type AdminFormSchema = z.infer<typeof schema>;
export const CircleAdminPage = () => {
  const {
    circle,
    circleEpochsStatus: { epochs: epochsReverse },
  } = useSelectedCircle();

  const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

  const currentEpoch = useMemo(
    () => epochs.filter(epoch => epoch.started && !epoch.ended),
    [epochsReverse]
  );
  const UpcomingEpochs = useMemo(
    () => epochsReverse.filter(epoch => !epoch.started && !epoch.ended),
    [epochsReverse]
  );

  const initialEpoch = {
    startDate: currentEpoch[0]
      ? currentEpoch[0].startDate.setZone().toFormat('yyyy-MM-dd')
      : UpcomingEpochs[0]
      ? UpcomingEpochs[0].startDate.setZone().toFormat('yyyy-MM-dd')
      : DateTime.utc().plus({ days: 1 }).setZone().toFormat('yyyy-MM-dd'),
    endDate: currentEpoch[0]
      ? currentEpoch[0].endDate.setZone().toFormat('yyyy-MM-dd')
      : UpcomingEpochs[0]
      ? UpcomingEpochs[0].endDate.setZone().toFormat('yyyy-MM-dd')
      : DateTime.utc().plus({ month: 1 }).setZone().toFormat('yyyy-MM-dd'),
    startTime: currentEpoch[0]
      ? currentEpoch[0].startDate.setZone().toFormat('HH:MM')
      : UpcomingEpochs[0]
      ? UpcomingEpochs[0].startDate.setZone().toFormat('HH:MM')
      : DateTime.utc().setZone().toFormat('HH:MM'),
    repeat: currentEpoch[0]
      ? currentEpoch[0].repeat
      : UpcomingEpochs[0]
      ? UpcomingEpochs[0].repeat
      : 0,
  };

  const [logoData, setLogoData] = useState<{
    avatar: string;
    avatarRaw: File | null;
  }>({
    avatar: getCircleAvatar({ avatar: circle.logo, circleName: circle.name }),
    avatarRaw: null,
  });

  const { control } = useForm<AdminFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      defaultOptIn: circle.default_opt_in,
      onlyGiverVouch: circle.only_giver_vouch,
      teamSelection: circle.team_selection,
      autoOptOut: circle.auto_opt_out,
      epochRepeat: initialEpoch.repeat === 0 ? false : true,
      epochRepeatTime:
        initialEpoch.repeat === 1
          ? 1
          : initialEpoch.repeat === 2
          ? 2
          : initialEpoch.repeat === 3
          ? 3
          : 0,
    },
  });

  const { field: circleName } = useController({
    name: 'circleName',
    control,
    defaultValue: circle.name,
  });

  const { field: circleLogo } = useController({
    name: 'circleLogo',
    control,
    defaultValue: '',
  });

  const { field: startDate } = useController({
    name: 'startDate',
    control,
    defaultValue: initialEpoch.startDate,
  });

  const { field: endDate } = useController({
    name: 'endDate',
    control,
    defaultValue: initialEpoch.endDate,
  });

  const { field: startTime } = useController({
    name: 'startTime',
    control,
    defaultValue: initialEpoch.startTime,
  });

  const onChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setLogoData({
        ...logoData,
        avatar: URL.createObjectURL(e.target.files[0]),
        avatarRaw: e.target.files[0],
      });
    }
  };

  return (
    <>
      <SingleColumnLayout>
        <Text h1 css={{ mb: '$md' }}>
          Circle Admin
        </Text>
        <Form>
          <Panel
            css={{
              display: 'grid',
              gridTemplateColumns: '23fr 77fr',
              gap: '$md',
              width: '100%',
              '@md': { display: 'flex' },
            }}
          >
            <Panel css={{ paddingLeft: '0' }}>
              <Text inline bold h2 font="inter">
                General
              </Text>
            </Panel>
            <Panel nested>
              <Text h3 semibold>
                Circle Settings
              </Text>
              <Text css={{ mt: '$xs' }}>
                Coordinape circles allow you to collectively reward circle
                members through equitable and transparent payments.{' '}
              </Text>
              <Flex
                row
                css={{
                  justifyContent: 'flex-start',
                  mt: '$md',
                  flexWrap: 'wrap',
                  gap: '$xl',
                }}
              >
                <Flex
                  column
                  css={{
                    alignItems: 'center',
                  }}
                >
                  <FormLabel
                    label
                    htmlFor="circle_name"
                    css={{ ...labelStyles }}
                  >
                    Circle name
                  </FormLabel>
                  <TextField id="circle_name" {...circleName} />
                </Flex>
                <Box>
                  <Flex column css={{ alignItems: 'center' }}>
                    <Text variant="label" css={{ ...labelStyles }}>
                      Circle Logo
                    </Text>
                    <Flex
                      row
                      css={{
                        alignItems: 'center',
                        gap: '$xs',
                        mb: '$lg',
                      }}
                    >
                      <Avatar size="small" path={logoData.avatar} />
                      <label htmlFor="upload-logo-button">
                        <Button as="div" size="medium" color="primary" outlined>
                          Upload File
                        </Button>
                      </label>
                    </Flex>
                    <input
                      id="upload-logo-button"
                      onBlur={circleLogo.onBlur}
                      value={circleLogo.value}
                      ref={circleLogo.ref}
                      name={circleLogo.name}
                      onChange={onChangeLogo}
                      style={{ display: 'none' }}
                      type="file"
                    />
                  </Flex>
                </Box>
              </Flex>
              <Flex
                row
                css={{
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '$lg',
                }}
              >
                <FormRadioGroup
                  label="Default Opt In"
                  name="defaultOptIn"
                  control={control}
                  options={radioGroupOptions.yesNo}
                  defaultValue={circle.default_opt_in ? 'true' : 'false'}
                  infoTooltip={
                    <ToolTip
                      optionsInfo={[
                        {
                          label: 'Yes',
                          text: `All new members are eligible to receive ${
                            circle.tokenName || 'GIVE'
                          }`,
                        },
                        {
                          label: 'No',
                          text: `New members need to log into Coordinape and opt in to receiving ${
                            circle.tokenName || 'GIVE'
                          }`,
                        },
                      ]}
                      href={DOCS_HREF}
                      anchorText={DOCS_TEXT}
                    />
                  }
                />
                <FormRadioGroup
                  label="Only Givers can vouch"
                  name="onlyGiverVouch"
                  control={control}
                  options={radioGroupOptions.yesNo}
                  defaultValue={circle.only_giver_vouch ? 'true' : 'false'}
                  infoTooltip={
                    <ToolTip
                      optionsInfo={[
                        {
                          label: 'Yes',
                          text: `Only members who are eligible to send ${
                            circle.tokenName || 'GIVE'
                          } can vouch for new members`,
                        },
                        {
                          label: 'No',
                          text: 'Anyone in the circle can vouch for new members',
                        },
                      ]}
                      href={DOCS_HREF}
                      anchorText={DOCS_TEXT}
                    />
                  }
                />
                <FormRadioGroup
                  label="Team Selection"
                  name="teamSelection"
                  control={control}
                  options={radioGroupOptions.onOff}
                  defaultValue={circle.team_selection ? 'true' : 'false'}
                  infoTooltip={
                    <ToolTip
                      optionsInfo={[
                        {
                          label: 'Yes',
                          text: 'Members select a team during allocation and make allocations only to that team',
                        },
                        {
                          label: 'No',
                          text: 'Members make allocations to anyone in the circle',
                        },
                      ]}
                    />
                  }
                />
                <FormRadioGroup
                  label="Auto Opt Out"
                  name="autoOptOut"
                  control={control}
                  options={radioGroupOptions.onOff}
                  defaultValue={circle.auto_opt_out ? 'true' : 'false'}
                  infoTooltip={
                    <ToolTip
                      optionsInfo={[
                        { label: 'ON', text: 'to be added' },
                        { label: 'OFF', text: 'to be added' },
                      ]}
                    />
                  }
                />
              </Flex>
              <Divider css={{ mt: '$1xl', mb: '$lg' }} />
              <Text h3 semibold>
                Epoch Settings
              </Text>
              <Text css={{ mt: '$xs' }}>
                An Epoch is a period of time where circle members contribute
                value & allocate {circle.tokenName || 'GIVE'} tokens to one
                another.{' '}
              </Text>
              <span>
                <a
                  href="https://docs.coordinape.com/welcome/how_to_use_coordinape#my-epoch"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </a>
              </span>
              <Flex css={{ mt: '$lg' }}>
                <Flex column css={{ gap: '$lg' }}>
                  <FormRadioGroup
                    label="Epoch Type"
                    name="epochRepeat"
                    control={control}
                    options={radioGroupOptions.epochType}
                    defaultValue={initialEpoch.repeat === 0 ? 'false' : 'true'}
                    infoTooltip={
                      <ToolTip
                        optionsInfo={[
                          { label: 'Repeating', text: 'to be added' },
                          { label: 'One Time', text: 'to be added' },
                        ]}
                      />
                    }
                  />
                  <FormRadioGroup
                    label="Epochs"
                    name="epochRepeatTime"
                    control={control}
                    options={radioGroupOptions.repeat}
                    disabled={initialEpoch.repeat === 0 ? true : false}
                    defaultValue={
                      initialEpoch.repeat === 1
                        ? 'weekly'
                        : initialEpoch.repeat === 3
                        ? 'biweekly'
                        : 'monthly'
                    }
                    infoTooltip={
                      <ToolTip
                        optionsInfo={[
                          { label: 'Yes', text: 'to be added' },
                          { label: 'No', text: 'to be added' },
                        ]}
                      />
                    }
                  />
                  <Flex
                    css={{
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '$md',
                    }}
                  >
                    <Flex
                      column
                      css={{
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel label css={{ ...labelStyles }}>
                        Start Date
                      </FormLabel>
                      <TextField
                        {...startDate}
                        type="date"
                        css={{ width: '125px', height: '$2xl' }}
                      ></TextField>
                    </Flex>
                    <Text css={{ paddingTop: '20px' }}>To</Text>
                    <Flex
                      column
                      css={{
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel label css={{ ...labelStyles }}>
                        End Date
                      </FormLabel>
                      <TextField
                        {...endDate}
                        type="date"
                        css={{ width: '125px', height: '$2xl' }}
                      ></TextField>
                    </Flex>
                    <Flex
                      column
                      css={{
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel label css={{ ...labelStyles }}>
                        Start Time
                      </FormLabel>
                      <TextField
                        {...startTime}
                        type="time"
                        css={{ width: '125px', height: '$2xl' }}
                      ></TextField>
                    </Flex>
                    <Text css={{ paddingTop: '20px' }}>
                      in your <br /> local timezone
                    </Text>
                  </Flex>
                </Flex>
                <Flex column></Flex>
              </Flex>
            </Panel>
          </Panel>
          <Panel
            css={{
              display: 'grid',
              gridTemplateColumns: '23fr 77fr',
              gap: '$lg',
              width: '100%',
              '@md': { display: 'flex' },
              mt: '$lg',
            }}
          >
            <Panel css={{ paddingLeft: '0' }}>
              <Text inline bold h2 font="inter">
                Fixed Payment
              </Text>
            </Panel>
            <Panel nested></Panel>
          </Panel>
          <Panel
            css={{
              display: 'grid',
              gridTemplateColumns: '23fr 77fr',
              gap: '$lg',
              width: '100%',
              '@md': { display: 'flex' },
              mt: '$lg',
            }}
          >
            <Panel css={{ paddingLeft: '0' }}>
              <Text inline bold h2 font="inter">
                Customization
              </Text>
            </Panel>
            <Panel nested></Panel>
          </Panel>
          <Panel
            css={{
              display: 'grid',
              gridTemplateColumns: '23fr 77fr',
              gap: '$lg',
              width: '100%',
              '@md': { display: 'flex' },
              mt: '$lg',
            }}
          >
            <Panel css={{ paddingLeft: '0' }}>
              <Text inline bold h2 font="inter">
                Integration
              </Text>
            </Panel>
            <Panel nested></Panel>
          </Panel>
          <Panel
            css={{
              display: 'grid',
              gridTemplateColumns: '23fr 77fr',
              gap: '$lg',
              width: '100%',
              '@md': { display: 'flex' },
              mt: '$lg',
            }}
          >
            <Panel css={{ paddingLeft: '0' }}>
              <Text inline bold h2 font="inter">
                Danger Zone
              </Text>
            </Panel>
            <Panel nested></Panel>
          </Panel>
        </Form>
      </SingleColumnLayout>
    </>
  );
};
