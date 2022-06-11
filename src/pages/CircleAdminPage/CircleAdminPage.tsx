import React, { useState, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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

const YesNoTooltip = ({
  yes = '',
  no = '',
  href = '',
  anchorText = '',
  onOff = false,
}) => {
  return (
    <>
      <strong>{!onOff ? 'Yes' : 'On'}</strong> - {yes}
      <br />
      <strong>{!onOff ? 'No' : 'Off'}</strong> - {no}
      <br />
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
    protocolName: z.string().refine(val => val.trim().length >= 3, {
      message: 'Organization Name must be at least 3 characters long.',
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
        repeat === 'weekly' ? 1 : repeat === 'monthly' ? 2 : 3
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

  console.log(epochs);
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
      epochRepeat: false,
      epochRepeatTime: 1,
    },
  });

  const { field: circleName } = useController({
    name: 'circleName',
    control,
    defaultValue: circle.name,
  });

  const { field: protocolName } = useController({
    name: 'protocolName',
    control,
    defaultValue: '',
  });

  const { field: circleLogo } = useController({
    name: 'circleLogo',
    control,
    defaultValue: '',
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
                <Flex
                  column
                  css={{
                    alignItems: 'center',
                  }}
                >
                  <FormLabel label htmlFor="org_name" css={{ ...labelStyles }}>
                    Org name
                  </FormLabel>
                  <TextField id="org_name" {...protocolName} />
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
                    <YesNoTooltip
                      yes={`All new members are eligible to receive ${
                        circle.tokenName || 'GIVE'
                      }`}
                      no={`New members need to log into Coordinape and opt in to receiving ${
                        circle.tokenName || 'GIVE'
                      }`}
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
                    <YesNoTooltip
                      yes={`Only members who are eligible to send ${
                        circle.tokenName || 'GIVE'
                      } can vouch for new members`}
                      no="Anyone in the circle can vouch for new members"
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
                    <YesNoTooltip
                      onOff
                      yes="Members select a team during allocation and make allocations only to that team"
                      no="Members make allocations to anyone in the circle"
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
                    <YesNoTooltip onOff yes="to be added" no="to be added" />
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
                    defaultValue={'true'}
                    infoTooltip={
                      <YesNoTooltip onOff yes="to be added" no="to be added" />
                    }
                  />
                  <FormRadioGroup
                    label="Epochs"
                    name="epochRepeatTime"
                    control={control}
                    options={radioGroupOptions.repeat}
                    defaultValue={'monthly'}
                    infoTooltip={
                      <YesNoTooltip onOff yes="to be added" no="to be added" />
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
              gap: '$md',
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
        </Form>
      </SingleColumnLayout>
    </>
  );
};
