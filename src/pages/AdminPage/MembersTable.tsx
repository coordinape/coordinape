/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { isUserAdmin } from 'lib/users';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { styled } from 'stitches.config';
import { z } from 'zod';

import { ActionDialog, FormInputField, makeTable } from 'components';
import {
  USER_COORDINAPE_ADDRESS,
  USER_ROLE_ADMIN,
  USER_ROLE_COORDINAPE,
} from 'config/constants';
import isFeatureEnabled from 'config/features';
import { zBooleanToNumber, zEthAddress } from 'forms/formHelpers';
import { useApeSnackbar, useApiAdminCircle, useNavigation } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { CheckIcon, CloseIcon } from 'icons';
import { CircleSettingsResult } from 'pages/CircleAdminPage/getCircleSettings';
import {
  FixedPaymentResult,
  QUERY_KEY_FIXED_PAYMENT,
} from 'pages/CircleAdminPage/getFixedPayment';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE, paths } from 'routes/paths';
import {
  Avatar,
  Box,
  Button,
  CheckBox,
  Flex,
  Form,
  Text,
  Tooltip,
  FormLabel,
  Divider,
  AppLink,
} from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';

import { Paginator } from './Paginator';

import { IUser } from 'types';

const TD = styled('td', {});
const TR = styled('tr', {});

const headerStyles = {
  color: '$secondaryText',
  textTransform: 'uppercase',
  fontSize: '$small',
  fontWeight: '$bold',
  lineHeight: '$shorter',
};

const defaultSort = <T,>(a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0);
const englishCollator = new Intl.Collator('en-u-kf-upper');

const GIFT_CIRCLE_DOCS_URL =
  'https://docs.coordinape.com/info/documentation/gift_circle';

const schema = z
  .object({
    name: z.string().refine(val => val.trim().length >= 3, {
      message: 'Name must be at least 3 characters long.',
    }),
    address: zEthAddress,
    non_giver: z.boolean(),
    fixed_non_receiver: z.boolean(),
    non_receiver: z.boolean(),
    role: z.boolean(),
    starting_tokens: z.number(),
    fixed_payment_amount: z.number(),
  })
  .strict();

type EditUserFormSchema = z.infer<typeof schema>;

const makeCoordinape = (circleId: number): IUser => {
  return {
    circle_id: circleId,
    created_at: new Date().toString(),
    epoch_first_visit: false,
    give_token_received: 0,
    id: -1,
    isCircleAdmin: false,
    isCoordinapeUser: true,
    deleted_at: new Date().toString(),
    teammates: [],
    updated_at: '',
    name: 'Coordinape',
    address: USER_COORDINAPE_ADDRESS,
    role: 2,
    non_receiver: false,
    fixed_non_receiver: false,
    starting_tokens: 0,
    non_giver: true,
    give_token_remaining: 0,
    bio: 'Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations.',
  };
};

const coordinapeTooltipContent = () => {
  return (
    <Box
      css={{
        m: '$sm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Text size="large" css={{ my: '$md' }}>
        Why is Coordinape in your circle?
      </Text>
      <p>
        We&apos;re experimenting with the gift circle mechanism as our revenue
        model. By default, Coordinape appears in your circle and any user can
        allocate to Coordinape. To show or hide the Coordinape user, use the
        links on the right side of this row.
      </p>
      <a
        href={EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE}
        target="_blank"
        rel="noreferrer"
      >
        Let us know what you think
      </a>
    </Box>
  );
};

const UserName = ({ user }: { user: IUser }) => {
  const { getToProfile } = useNavigation();

  return (
    <Box
      css={{
        height: 48,
        alignItems: 'center',

        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        width: '100%',
      }}
    >
      <Avatar
        path={user?.profile?.avatar}
        name={user?.name}
        size="small"
        onClick={getToProfile(user.address)}
      />
      <Text
        css={{
          display: 'block',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
      >
        {user.name}
      </Text>
      <span>
        {user.role === USER_ROLE_COORDINAPE ? (
          <Box css={{ marginTop: '6px' }}>
            <Tooltip content={coordinapeTooltipContent()}>
              <InfoCircledIcon />
            </Tooltip>
          </Box>
        ) : (
          ''
        )}
      </span>
    </Box>
  );
};

const MemberRow = ({
  user,
  isAdmin,
  fixedPaymentToken,
  availableInVault,
  fixedPayment,
  tokenName,
}: {
  user: IUser;
  isAdmin: boolean;
  fixedPaymentToken?: string;
  availableInVault: string;
  fixedPayment?: FixedPaymentResult;
  tokenName: string | undefined;
}) => {
  //const { restoreCoordinape, deleteUser } = useApiAdminCircle(circle.id);

  // const { getToProfile } = useNavigation();
  const [open, setOpen] = useState(false);
  const [showOptOutChangeWarning, setShowOptOutChangeWarning] = useState(false);
  const [hasAcceptedOptOutWarning, setHasAcceptedOptOutWarning] =
    useState(false);

  const { showInfo } = useApeSnackbar();
  const { updateUser } = useApiAdminCircle(user.circle_id);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditUserFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const { field: userRole } = useController({
    name: 'role',
    control,
    defaultValue: user.role === 1 ? true : false,
  });

  const { field: nonGiver } = useController({
    name: 'non_giver',
    control,
    defaultValue: user.non_giver,
  });

  const { field: nonReceiver } = useController({
    name: 'non_receiver',
    control,
    defaultValue: user.non_receiver,
  });

  const { field: fixedNonReceiver } = useController({
    name: 'fixed_non_receiver',
    control,
    defaultValue: user.fixed_non_receiver,
  });

  const watchFixedPaymentAmount = watch('fixed_payment_amount');

  const fixedPaymentTotal = (
    fixedPaymentAmount: number
  ): { fixedTotal: number; fixedReceivers: number } => {
    let fixedTotal = fixedPayment?.fixedPaymentTotal ?? 0;
    let fixedReceivers = fixedPayment?.fixedPaymentNumber ?? 0;
    if (!user.fixed_payment_amount && fixedPaymentAmount > 0) {
      fixedTotal = fixedPayment?.fixedPaymentTotal + fixedPaymentAmount;
      fixedReceivers = (fixedPayment?.fixedPaymentNumber ?? 0) + 1;
    } else if (user.fixed_payment_amount && fixedPaymentAmount > 0) {
      fixedTotal =
        fixedPayment?.fixedPaymentTotal +
        (fixedPaymentAmount - (user.fixed_payment_amount ?? 0));
      fixedReceivers = fixedPayment?.fixedPaymentNumber ?? 1;
    }
    return {
      fixedTotal,
      fixedReceivers,
    };
  };

  const isOptedOut = !!user.fixed_non_receiver || !!user.non_receiver;
  const hasGiveAllocated = !!user.give_token_received;

  const onSubmit: SubmitHandler<EditUserFormSchema> = async data => {
    try {
      const hasOptOutChanged = isOptedOut !== !!data?.fixed_non_receiver;
      const showWarning =
        hasOptOutChanged && hasGiveAllocated && !hasAcceptedOptOutWarning;

      if (showWarning) {
        setShowOptOutChangeWarning(true);
      } else {
        setShowOptOutChangeWarning(false);
        updateUser(user.address, { ...data, role: data.role ? 1 : 0 })
          .then(() => {
            queryClient.invalidateQueries(QUERY_KEY_FIXED_PAYMENT);
          })
          .catch(console.warn);
      }

      showInfo('Saved changes');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <TR
        key={user.id}
        css={
          user.deleted_at !== null
            ? {
                '> td': { opacity: 0.3 },
                '> td.normal': { opacity: 1 },
              }
            : {}
        }
      >
        <TD css={{ width: '20%' }} align="left">
          <UserName user={user} />
        </TD>
        {isAdmin && <TD>{shortenAddress(user.address)}</TD>}

        <TD>
          {!user.non_giver ? (
            <CheckIcon size="inherit" color="complete" />
          ) : (
            <CloseIcon size="inherit" color="alert" />
          )}
        </TD>

        <TD>
          {user.fixed_non_receiver ? (
            'Forced ❌'
          ) : user.non_receiver ? (
            <CloseIcon size="inherit" color="alert" />
          ) : (
            <CheckIcon size="inherit" color="complete" />
          )}
        </TD>
        {isFeatureEnabled('fixed_payments') && (
          <TD>
            {user.fixed_payment_amount === 0 ? '-' : user.fixed_payment_amount}
          </TD>
        )}
        <TD>
          {user.role === USER_ROLE_ADMIN ? (
            <CheckIcon size="inherit" color="complete" />
          ) : (
            <CloseIcon size="inherit" color="alert" />
          )}
        </TD>
        <TD>
          {user.role === USER_ROLE_ADMIN ? (
            <CheckIcon size="inherit" color="complete" />
          ) : (
            <CloseIcon size="inherit" color="alert" />
          )}
        </TD>
        <TD>
          {isAdmin && (
            <Button
              color="primary"
              size="small"
              outlined
              css={{ mr: 0, ml: 'auto ' }}
              onClick={() => {
                setOpen(prevState => !prevState);
              }}
            >
              Manage Member
            </Button>
          )}
        </TD>
      </TR>
      {open && (
        <TR>
          <TD colSpan={8}>
            <Form>
              <Text h3 semibold css={{ my: '$md' }}>
                {user.name} Member Settings
              </Text>
              <Flex
                css={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Flex css={{ gap: '$lg' }}>
                  <FormInputField
                    id="name"
                    name="name"
                    control={control}
                    defaultValue={user.name}
                    label="Member Name"
                    infoTooltip="Member Displayed Name"
                    showFieldErrors
                    css={{ width: '122px' }}
                  />
                  <FormInputField
                    id="address"
                    name="address"
                    control={control}
                    defaultValue={user.address}
                    label="Wallet Address"
                    infoTooltip="Member ETH address used to login and receive tokens"
                    showFieldErrors
                    css={{ width: '420px' }}
                  />
                  <Flex column css={{ alignItems: 'center', gap: '$md' }}>
                    <FormLabel type="label">
                      Circle Admin{' '}
                      <Tooltip
                        css={{ ml: '$xs' }}
                        content={
                          <div>
                            {' '}
                            As a Circle Admin, you will be able to edit Circle
                            Settings, Edit Epoch settings, edit your users, and
                            create new circles.{' '}
                          </div>
                        }
                      >
                        <InfoCircledIcon />
                      </Tooltip>
                    </FormLabel>
                    <CheckBox {...userRole} />
                  </Flex>
                </Flex>
                <Button
                  color="destructive"
                  size="medium"
                  outlined
                  css={{ height: '$lg' }}
                >
                  Delete Member
                </Button>
              </Flex>
              <TwoColumnLayout css={{ mt: '56px' }}>
                <Divider />
                <Divider />
                <Flex column css={{ mt: '-16px' }}>
                  <Text h3 css={{ mb: '$md', fontWeight: '$semibold' }}>
                    Gift Circle
                  </Text>
                  <Flex css={{ gap: '$md', mb: '$md' }}>
                    <Flex column css={{ gap: '$xs' }}>
                      <FormLabel type="label">Give Tokens?</FormLabel>
                      <Flex css={{ gap: '10px' }}>
                        <Button
                          greenIconButton={nonGiver.value}
                          greenIconButtonToggled={!nonGiver.value}
                          name={nonGiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_giver', false, { shouldDirty: true });
                          }}
                          css={{ whiteSpace: 'nowrap', fontSize: '$small' }}
                        >
                          <CheckIcon
                            css={{
                              width: '14px',
                              height: '10px',
                              color: !nonGiver.value ? '$complete' : '$success',
                            }}
                          />{' '}
                          Give
                        </Button>
                        <Button
                          redIconButton={!nonGiver.value}
                          redIconButtonToggled={nonGiver.value}
                          name={nonGiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_giver', true, { shouldDirty: true });
                          }}
                          css={{ whiteSpace: 'nowrap', fontSize: '$small' }}
                        >
                          <CloseIcon
                            css={{
                              width: '12.5px',
                              height: '12.5px',
                              color: !nonGiver.value ? '$alertLight' : '$alert',
                            }}
                          />{' '}
                          No Give
                        </Button>
                      </Flex>
                    </Flex>
                    <Flex column css={{ gap: '$xs' }}>
                      <FormLabel type="label">Receive Tokens?</FormLabel>
                      <Flex css={{ gap: '10px' }}>
                        <Button
                          greenIconButton={
                            nonReceiver.value || fixedNonReceiver.value
                          }
                          greenIconButtonToggled={
                            !nonReceiver.value && !fixedNonReceiver.value
                          }
                          name={nonReceiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_receiver', false, {
                              shouldDirty: true,
                            });
                            setValue('fixed_non_receiver', false, {
                              shouldDirty: true,
                            });
                          }}
                          css={{ whiteSpace: 'nowrap', fontSize: '$small' }}
                        >
                          <CheckIcon
                            css={{
                              width: '14px',
                              height: '10px',
                              color:
                                !nonReceiver.value && !fixedNonReceiver.value
                                  ? '$complete'
                                  : '$success',
                            }}
                          />{' '}
                          Receive Give
                        </Button>
                        <Button
                          redIconButton={!nonReceiver.value}
                          redIconButtonToggled={
                            nonReceiver.value && !fixedNonReceiver.value
                          }
                          name={nonReceiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_receiver', true, {
                              shouldDirty: true,
                            });
                            setValue('fixed_non_receiver', false, {
                              shouldDirty: true,
                            });
                          }}
                          css={{ whiteSpace: 'nowrap', fontSize: '$small' }}
                        >
                          <CloseIcon
                            css={{
                              width: '12.5px',
                              height: '12.5px',
                              color: !nonReceiver.value
                                ? '$alertLight'
                                : '$alert',
                            }}
                          />{' '}
                          Refuse Give
                        </Button>
                        <Button
                          redIconButton={!fixedNonReceiver.value}
                          redIconButtonToggled={fixedNonReceiver.value}
                          name={fixedNonReceiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('fixed_non_receiver', true, {
                              shouldDirty: true,
                            });
                            setValue('non_receiver', false, {
                              shouldDirty: true,
                            });
                          }}
                          css={{ whiteSpace: 'nowrap', fontSize: '$small' }}
                        >
                          <CloseIcon
                            css={{
                              width: '12.5px',
                              height: '12.5px',
                              color: !fixedNonReceiver.value
                                ? '$alertLight'
                                : '$alert',
                            }}
                          />{' '}
                          Block
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                  <FormInputField
                    id="give_allotment"
                    name="starting_tokens"
                    number
                    control={control}
                    defaultValue={user.starting_tokens}
                    label="Give Allotment"
                    infoTooltip="The maximum amount of giving a user can allocate in an epoch"
                    showFieldErrors
                    css={{ width: '140px' }}
                  />
                </Flex>
                <Flex column>
                  <Text h3 css={{ mb: '$md', fontWeight: '$semibold' }}>
                    Fixed Payment
                  </Text>
                  <Flex css={{ gap: '$md' }} disabled={!fixedPaymentToken}>
                    <FormInputField
                      id="fixed_payment_amount"
                      name="fixed_payment_amount"
                      number
                      control={control}
                      defaultValue={user.fixed_payment_amount}
                      label="Member Fixed Payment"
                      infoTooltip="Fixed Amount tokens allocated to this user regardless of gives received"
                      showFieldErrors
                      css={{ width: '190px' }}
                    />
                    <Flex column>
                      <Text variant="label" css={{ mb: '$xs' }}>
                        Members
                      </Text>
                      <Text size="medium">
                        {
                          fixedPaymentTotal(watchFixedPaymentAmount)
                            .fixedReceivers
                        }
                      </Text>
                    </Flex>
                    <Flex column css={{ whiteSpace: 'nowrap' }}>
                      <Text variant="label" css={{ mb: '$xs' }}>
                        Fixed Payments Total
                      </Text>
                      <Text size="medium">{`${
                        fixedPaymentTotal(watchFixedPaymentAmount).fixedTotal
                      } ${fixedPaymentToken}`}</Text>
                    </Flex>
                    <Flex column css={{ whiteSpace: 'nowrap' }}>
                      <Text variant="label">Available in Vault</Text>{' '}
                      <Text size="medium">{`${
                        availableInVault ?? ''
                      } ${fixedPaymentToken}`}</Text>
                    </Flex>
                  </Flex>
                  <Box css={{ fontSize: '$small', alignSelf: 'flex-end' }}>
                    Edit Fixed Payment Token in{' '}
                    <AppLink
                      to={paths.circleAdmin(user.circle_id)}
                      css={{ textDecoration: 'none' }}
                    >
                      <Text inline css={{ color: '$primary' }}>
                        Circle Settings
                      </Text>
                    </AppLink>
                  </Box>
                </Flex>
                <Button
                  outlined
                  color="neutral"
                  onClick={e => {
                    e.preventDefault();
                    reset();
                  }}
                >
                  Discard Changes
                </Button>
                <Button
                  outlined
                  color="complete"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save Changes
                </Button>
              </TwoColumnLayout>
              <ActionDialog
                open={!hasAcceptedOptOutWarning && showOptOutChangeWarning}
                title={`This user has ${tokenName || 'GIVE'} allocated.`}
                onPrimary={() => {
                  setHasAcceptedOptOutWarning(true);
                  setShowOptOutChangeWarning(false);
                }}
              >
                Changing their opt-in status will remove all{' '}
                {tokenName || 'GIVE'} allocated to them. This cannot be undone.
              </ActionDialog>
            </Form>
          </TD>
        </TR>
      )}
    </>
  );
};

export const MembersTable = ({
  visibleUsers,
  myUser: me,
  circle,
  filter,
  perPage,
  availableInVault,
  fixedPayment,
}: {
  visibleUsers: IUser[];
  myUser: IUser;
  circle: CircleSettingsResult;
  filter: (u: IUser) => boolean;
  perPage: number;
  availableInVault: string;
  fixedPayment?: FixedPaymentResult;
}) => {
  //const { isMobile } = useMobileDetect();
  const isAdmin = isUserAdmin(me);
  const [page, setPage] = useState<number>(1);

  const [view, setView] = useState<IUser[]>([]);

  const coordinapeUser = useMemo(() => makeCoordinape(circle.id), [circle]);

  const users: IUser[] = useMemo(() => {
    if (
      !visibleUsers.some(u => u.address === coordinapeUser.address) &&
      visibleUsers.length > 0
    ) {
      return [...visibleUsers, coordinapeUser];
    }
    return visibleUsers;
  }, [circle, visibleUsers, coordinapeUser]);

  useEffect(() => {
    const filtered = filter ? users.filter(filter) : users;
    setView(filtered);
  }, [users, perPage, filter, circle]);

  const pagedView = useMemo(
    () =>
      view.slice((page - 1) * perPage, Math.min(page * perPage, view.length)),
    [view, perPage, page]
  );

  const MemberTable = makeTable<IUser>('MemberTable');

  const headers = [
    { title: 'Name', css: headerStyles },
    { title: 'ETH WALLET', css: headerStyles, isHidden: !isAdmin },
    { title: 'Give', css: { ...headerStyles } },
    { title: 'Receive', css: { ...headerStyles } },
    { title: 'Fixed Payment', css: { ...headerStyles } },
    { title: 'Discord Linked', css: { ...headerStyles } },
    { title: 'Admin', css: { ...headerStyles } },
    { title: 'Actions', css: { ...headerStyles, textAlign: 'right' } },
  ];

  return (
    <>
      <MemberTable
        headers={headers}
        data={pagedView}
        startingSortIndex={0}
        startingSortDesc
        sortByColumn={(index: number) => {
          if (index === 0)
            return (a: IUser, b: IUser) =>
              englishCollator.compare(a.name, b.name);
          if (index === 1)
            return (a: IUser, b: IUser) =>
              englishCollator.compare(a.address, b.address);
          if (index === 2)
            return (a: IUser, b: IUser) =>
              defaultSort(a.non_giver, b.non_giver);
          if (index === 3)
            return (a: IUser, b: IUser) =>
              defaultSort(a.fixed_payment_amount, b.fixed_payment_amount);
          if (index === 5)
            return (a: IUser, b: IUser) =>
              defaultSort(a.isCircleAdmin, b.isCircleAdmin);

          return (a: IUser, b: IUser) =>
            englishCollator.compare(a.name, b.name);
        }}
      >
        {member => (
          <MemberRow
            isAdmin={isAdmin}
            user={member}
            fixedPaymentToken={circle.fixed_payment_token_type}
            fixedPayment={fixedPayment}
            availableInVault={availableInVault}
            tokenName={circle.tokenName}
          />
        )}
      </MemberTable>
      <Paginator
        totalItems={users.length}
        currentPage={page}
        onPageChange={setPage}
        itemsPerPage={perPage}
      />
    </>
  );
};
