import { useEffect, useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { isUserAdmin, Role } from 'lib/users';
import { zEthAddress } from 'lib/zod/formHelpers';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { styled } from 'stitches.config';
import { z } from 'zod';

import { FormInputField, makeTable } from 'components';
import {
  COORDINAPE_USER_ADDRESS,
  COORDINAPE_USER_AVATAR,
} from 'config/constants';
import { useApiAdminCircle, useNavigation, useToast } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { Check, Info, Slash, X } from 'icons/__generated';
import { EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE } from 'routes/paths';
import {
  Avatar,
  Box,
  Button,
  CheckBox,
  Divider,
  Flex,
  Form,
  Link,
  Modal,
  Text,
  TextField,
  ToggleButton,
  Tooltip,
} from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';

import { IDeleteUser } from '.';
import type { QueryCircle, QueryUser } from './getMembersPageData';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from './getMembersPageData';
import { LeaveCircleModal } from './LeaveCircleModal';

const GIFT_CIRCLE_DOCS_URL =
  'https://docs.coordinape.com/info/documentation/gift_circle';

const TD = styled('td', {});
const TR = styled('tr', {});

const headerStyles = {
  color: '$secondaryText',
  textTransform: 'uppercase',
  fontSize: '$small',
  fontWeight: '$semibold',
  lineHeight: '$shorter',
};

const schema = z
  .object({
    address: zEthAddress,
    non_giver: z.boolean(),
    fixed_non_receiver: z.boolean(),
    non_receiver: z.boolean(),
    role: z.boolean(),
    starting_tokens: z.number(),
  })
  .strict();

type EditUserFormSchema = z.infer<typeof schema>;

const makeCoordinapeUser = (circleId: number): QueryUser => {
  return {
    id: -1,
    //profile id is used only as a key for coordinape user row in members table
    profile_id: -1,
    bio: "At this time we've chosen to forgo charging fees for Coordinape and instead we're experimenting with funding our DAO through donations. As part of this experiment, Coordinape will optionally become part of everyone's circles as a participant. If you don't agree with this model or for any other reason don't want Coordinape in your circle, you can disable it in Circle Settings.",
    circle_id: circleId,
    created_at: new Date().toString(),
    deleted_at: new Date().toString(),
    epoch_first_visit: false,
    fixed_non_receiver: false,
    give_token_received: 0,
    give_token_remaining: 0,
    non_giver: true,
    non_receiver: false,
    role: Role.COORDINAPE,
    starting_tokens: 0,
    teammates: [],
    updated_at: '',
    profile: {
      id: -1,
      name: 'Coordinape',
      address: COORDINAPE_USER_ADDRESS,
      avatar: COORDINAPE_USER_AVATAR,
      skills: '',
    },
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
      <Link
        inlineLink
        href={EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE}
        target="_blank"
        rel="noreferrer"
      >
        Let us know what you think
      </Link>
    </Box>
  );
};

const UserName = ({ user }: { user: QueryUser }) => {
  const { getToProfile } = useNavigation();

  return (
    <Box
      css={{
        height: '$2xl',
        alignItems: 'center',

        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        width: '100%',
        pl: '$md',
        ml: '-$md',
      }}
    >
      <Avatar
        path={user?.profile?.avatar}
        name={user?.profile?.name}
        hasCoSoul={!!user?.profile?.cosoul}
        size="small"
        onClick={getToProfile(user.profile.address)}
        css={{ mr: '$sm' }}
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
        {user.profile?.name}{' '}
        {user.role === Role.COORDINAPE ? (
          <Tooltip content={coordinapeTooltipContent()}>
            <Info size="sm" />
          </Tooltip>
        ) : (
          ''
        )}
      </Text>
    </Box>
  );
};

export const MemberRow = ({
  user,
  myUser: me,
  token_name,
  setDeleteUserDialog,
  showLeaveModal,
  circleId,
}: {
  user: QueryUser;
  myUser: QueryUser | undefined;
  token_name: string | undefined;
  setDeleteUserDialog: (u: { name: string; profileId: number }) => void;
  showLeaveModal: () => void;
  circleId: number;
}) => {
  // const { getToProfile } = useNavigation();
  const { isMobile } = useMobileDetect();
  const isAdmin = isUserAdmin(me);
  const { showError } = useToast();
  const [open, setOpen] = useState(false);
  const [showOptOutChangeWarning, setShowOptOutChangeWarning] = useState(false);
  const [hasAcceptedOptOutWarning, setHasAcceptedOptOutWarning] =
    useState(false);

  const { showSuccess } = useToast();
  const { updateUser, restoreCoordinape, deleteUser } =
    useApiAdminCircle(circleId);
  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue, reset } =
    useForm<EditUserFormSchema>({
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
        await updateUser(user.profile_id, { ...data, role: data.role ? 1 : 0 })
          .then(() => {
            showSuccess('Saved changes');
            queryClient.invalidateQueries(QUERY_KEY_GET_MEMBERS_PAGE_DATA);
          })
          .catch(console.warn);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const toggleCoordinapeUser = async (user: {
    deleted_at?: string;
    profile_id: number;
  }) => {
    const disabled = !!user.deleted_at;
    const verb = disabled ? 'Enable' : 'Disable';
    if (!window.confirm(`${verb} Coordinape in this circle?`)) return;

    try {
      await (disabled
        ? restoreCoordinape(circleId)
        : deleteUser(user.profile_id));
      queryClient.invalidateQueries(QUERY_KEY_GET_MEMBERS_PAGE_DATA);
    } catch (err: any) {
      showError(err);
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
        {!isMobile && <TD>{shortenAddress(user.profile.address)}</TD>}
        {!isMobile && (
          <>
            <TD
              css={{
                textAlign: 'center !important',
                minWidth: '$3xl',
              }}
            >
              {!user.non_giver ? (
                <Check size="lg" color="complete" />
              ) : (
                <X size="lg" color="neutral" />
              )}
            </TD>
            <TD
              css={{
                textAlign: 'center !important',
                minWidth: '$3xl',
              }}
            >
              {user.fixed_non_receiver ? (
                <Slash color="alert" />
              ) : user.non_receiver ? (
                <X size="lg" color="neutral" />
              ) : (
                <Check size="lg" color="complete" />
              )}
            </TD>
          </>
        )}
        <TD
          css={{
            textAlign: 'center !important',
            minWidth: '$3xl',
          }}
        >
          {isUserAdmin(user) ? (
            <Check size="lg" color="complete" />
          ) : (
            <X size="lg" color="neutral" />
          )}
        </TD>
        {isAdmin && (
          <>
            <TD
              css={{
                textAlign: 'center !important',
              }}
            >
              {!user.non_giver ||
              user.starting_tokens - user.give_token_remaining != 0
                ? `${user.starting_tokens - user.give_token_remaining}/${
                    user.starting_tokens
                  }`
                : '-'}
            </TD>
            <TD
              css={{
                textAlign: 'center !important',
              }}
            >
              {user.give_token_received === 0 &&
              (!!user.fixed_non_receiver || !!user.non_receiver)
                ? '-'
                : user.give_token_received}
            </TD>
          </>
        )}
        {me && (
          <TD>
            {isAdmin ? (
              user.role !== Role.COORDINAPE ? (
                <Button
                  color="secondary"
                  size="xs"
                  css={{ mr: 0, ml: 'auto ', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setOpen(prevState => !prevState);
                  }}
                >
                  {isMobile ? ' Manage' : 'Manage Member'}
                </Button>
              ) : (
                <Tooltip content={coordinapeTooltipContent()}>
                  <Button
                    color="secondary"
                    size="xs"
                    css={{ mr: 0, ml: 'auto ', whiteSpace: 'nowrap' }}
                    onClick={() => toggleCoordinapeUser(user)}
                  >
                    {!user.deleted_at ? 'Disable' : 'Enable'}
                  </Button>
                </Tooltip>
              )
            ) : (
              user.id === me?.id && (
                <Button
                  color="secondary"
                  size="xs"
                  css={{
                    mr: 0,
                    ml: 'auto ',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={showLeaveModal}
                >
                  Leave Circle
                </Button>
              )
            )}
          </TD>
        )}
      </TR>
      {open && (
        <TR key={user.profile_id}>
          <TD colSpan={isMobile ? 6 : 9}>
            <Form>
              <Text large semibold css={{ my: '$md' }}>
                {user.profile.name} Member Settings
              </Text>
              <Flex
                alignItems="center"
                css={{
                  justifyContent: 'space-between',
                  gap: '$lg',
                  flexWrap: 'wrap',
                  flexGrow: 1,
                }}
              >
                <Flex css={{ gap: '$lg', flexWrap: 'wrap', flexGrow: 1 }}>
                  <Box>
                    <Text variant="label" as="label" css={{ mb: '$xs' }}>
                      Member Name{' '}
                      <Tooltip content={<div>Member Displayed Name</div>}>
                        <Info size="sm" />
                      </Tooltip>
                    </Text>
                    <TextField
                      value={user.profile?.name}
                      disabled={true}
                      css={{
                        width: '100%',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(1) brightness(0.6)',
                        },
                      }}
                    />
                  </Box>
                  <FormInputField
                    id="address"
                    name="address"
                    control={control}
                    defaultValue={user.profile.address}
                    label="Wallet Address"
                    infoTooltip="Member ETH address used to login and receive tokens"
                    showFieldErrors
                    css={{ minWidth: '420px', '@sm': { minWidth: 0 } }}
                    disabled={true}
                  />
                  <Flex css={{ justifyContent: 'space-between', flexGrow: 1 }}>
                    <Flex column alignItems="start" css={{ gap: '$sm' }}>
                      <Text variant="label" as="label" css={{ mb: '$xs' }}>
                        Circle Admin{' '}
                        <Tooltip
                          css={{ ml: '$xs' }}
                          content={
                            <div>
                              {' '}
                              As a Circle Admin, you will be able to edit Circle
                              Settings, Edit Epoch settings, edit your users,
                              and create new circles.{' '}
                            </div>
                          }
                        >
                          <Info size="sm" />
                        </Tooltip>
                      </Text>
                      <CheckBox {...userRole} />
                    </Flex>
                    {me && (
                      <Flex alignItems="end">
                        <Button
                          color="destructive"
                          size="small"
                          css={{ height: '$lg', whiteSpace: 'nowrap' }}
                          onClick={() => {
                            user.id === me?.id
                              ? showLeaveModal()
                              : setDeleteUserDialog({
                                  name: user.profile?.name,
                                  profileId: user.profile_id,
                                });
                          }}
                        >
                          {user.id === me?.id
                            ? 'Leave Circle'
                            : 'Delete Member'}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
              <TwoColumnLayout css={{ mt: '56px' }}>
                <Divider />
                <Divider />
                <Flex column css={{ mt: '-16px' }}>
                  <Text large css={{ mb: '$md', fontWeight: '$semibold' }}>
                    Gift Circle
                  </Text>
                  <Flex css={{ gap: '$md', mb: '$md', flexWrap: 'wrap' }}>
                    <Flex column css={{ gap: '$xs' }}>
                      <Text variant="label" as="label">
                        Give Tokens?
                        <Tooltip
                          content={
                            <div>
                              Gives the member the ability to reward circle
                              members with GIVE{' '}
                              <Link
                                inlineLink
                                href={GIFT_CIRCLE_DOCS_URL}
                                target="_blank"
                              >
                                Learn More
                              </Link>
                            </div>
                          }
                        >
                          <Info size="sm" />
                        </Tooltip>
                      </Text>
                      <Flex css={{ gap: '$sm', flexWrap: 'wrap' }}>
                        <ToggleButton
                          color="complete"
                          active={!nonGiver.value}
                          name={nonGiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_giver', false, { shouldDirty: true });
                          }}
                        >
                          <Check size="lg" /> Give
                        </ToggleButton>
                        <ToggleButton
                          color="destructive"
                          active={nonGiver.value}
                          name={nonGiver.name}
                          onClick={e => {
                            e.preventDefault();
                            setValue('non_giver', true, { shouldDirty: true });
                          }}
                        >
                          <X size="lg" /> No Give
                        </ToggleButton>
                      </Flex>
                    </Flex>
                    <Flex column css={{ gap: '$xs' }}>
                      <Text variant="label" as="label">
                        Receive Tokens?
                        <Tooltip
                          content={
                            <div>
                              Allows the Contributor to get paid based on the
                              amount of GIVE allocated by circle members.{' '}
                              <Link
                                inlineLink
                                href={GIFT_CIRCLE_DOCS_URL}
                                target="_blank"
                              >
                                Learn More
                              </Link>
                            </div>
                          }
                        >
                          <Info size="sm" />
                        </Tooltip>
                      </Text>
                      <Flex css={{ flexWrap: 'wrap', gap: '$sm' }}>
                        <ToggleButton
                          color="complete"
                          active={!nonReceiver.value && !fixedNonReceiver.value}
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
                        >
                          <Check size="lg" /> Receive Give
                        </ToggleButton>
                        <ToggleButton
                          color="destructive"
                          active={nonReceiver.value && !fixedNonReceiver.value}
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
                        >
                          <X size="lg" /> Refuse Give
                        </ToggleButton>
                        <ToggleButton
                          color="destructive"
                          active={fixedNonReceiver.value}
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
                        >
                          <Slash size="lg" /> Block
                        </ToggleButton>
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
                    infoTooltip="The maximum amount of GIVE a user can allocate in an epoch"
                    showFieldErrors
                    css={{ width: '140px' }}
                  />
                </Flex>
              </TwoColumnLayout>
              <Flex
                css={{
                  mt: '$lg',
                  mb: '$2xl',
                  gap: '$md',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  color="secondary"
                  size="medium"
                  css={{ whiteSpace: 'nowrap' }}
                  onClick={e => {
                    e.preventDefault();
                    reset();
                  }}
                >
                  Discard Changes
                </Button>
                <Button
                  color="cta"
                  size="medium"
                  css={{
                    justifySelf: 'end',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save Changes
                </Button>
              </Flex>
              <Modal
                onOpenChange={() => {
                  setHasAcceptedOptOutWarning(true);
                  setShowOptOutChangeWarning(false);
                }}
                open={!hasAcceptedOptOutWarning && showOptOutChangeWarning}
                title={`This user has ${token_name || 'GIVE'} allocated.`}
              >
                <Flex column alignItems="start" css={{ gap: '$md' }}>
                  <Text p>
                    Changing their opt-in status will remove all{' '}
                    {token_name || 'GIVE'} allocated to them. This cannot be
                    undone.
                  </Text>
                  <Button
                    color="primary"
                    onClick={() => {
                      setHasAcceptedOptOutWarning(true);
                      setShowOptOutChangeWarning(false);
                    }}
                  >
                    I Understand
                  </Button>
                </Flex>
              </Modal>
            </Form>
          </TD>
        </TR>
      )}
    </>
  );
};

export const MembersTable = ({
  users,
  myUser: me,
  circle,
  filter,
  perPage,
  setDeleteUserDialog,
}: {
  users: QueryUser[];
  myUser: QueryUser | undefined;
  circle: QueryCircle;
  filter: (u: QueryUser) => boolean;
  perPage: number;
  setDeleteUserDialog: (u: IDeleteUser) => void;
}) => {
  const { isMobile } = useMobileDetect();
  const [view, setView] = useState<QueryUser[]>([]);
  const [showLeave, setShowLeave] = useState(false);
  const isAdmin = isUserAdmin(me);

  const usersWithGrantee: QueryUser[] = useMemo(() => {
    if (
      !users.some(u => u.profile.address === COORDINAPE_USER_ADDRESS) &&
      users.length > 0
    ) {
      return [...users, makeCoordinapeUser(circle.id)];
    }
    return users;
  }, [circle, users]);

  useEffect(() => {
    const filtered = filter
      ? usersWithGrantee.filter(filter)
      : usersWithGrantee;
    setView(filtered);
  }, [usersWithGrantee, perPage, filter, circle]);

  const MemberTable = makeTable<QueryUser>('MemberTable');

  const headers = [
    { title: 'Name', css: headerStyles },
    {
      title: 'ETH WALLET',
      css: headerStyles,
      isHidden: isMobile,
    },
    {
      title: 'Give',
      css: {
        ...headerStyles,
        textAlign: 'center !important',
      },
      isHidden: isMobile,
    },
    {
      title: 'Receive',
      css: { ...headerStyles, textAlign: 'center' },
      isHidden: isMobile,
    },
    { title: 'Discord Linked', css: { ...headerStyles }, isHidden: true },
    {
      title: 'Admin',
      css: {
        ...headerStyles,
        textAlign: 'center !important',
      },
    },
    {
      title: `${circle.token_name} sent`,
      css: { ...headerStyles, textAlign: 'center' },
      isHidden: !isAdmin,
    },
    {
      title: `${circle.token_name} received`,
      css: { ...headerStyles, textAlign: 'center' },
      isHidden: !isAdmin,
    },
    {
      title: 'Actions',
      css: { ...headerStyles, textAlign: 'right' },
      isHidden: !me,
    },
  ];

  const epochIsActive = (circle?.epochs.length || [].length) > 0;

  return (
    <>
      <MemberTable
        key={circle.id}
        headers={headers}
        data={view}
        startingSortIndex={0}
        perPage={perPage}
        sortByColumn={(index: number) => {
          if (index === 0)
            return (u: QueryUser) => u.profile.name.toLowerCase();
          if (index === 1)
            return (u: QueryUser) => u.profile.address.toLowerCase();
          if (index === 2) return (u: QueryUser) => u.non_giver;
          if (index === 3) return (u: QueryUser) => u.non_receiver;
          if (index === 5) return (u: QueryUser) => isUserAdmin(u);
          if (index === 6)
            return (u: QueryUser) =>
              !u.non_giver ? u.starting_tokens - u.give_token_remaining : -1;
          if (index === 7)
            return (u: QueryUser) =>
              !!u.fixed_non_receiver || !!u.non_receiver
                ? -1
                : u.give_token_received;
          return (u: QueryUser) => u.profile.name.toLowerCase();
        }}
      >
        {member => (
          <MemberRow
            key={member.id}
            user={member}
            token_name={circle.token_name}
            myUser={me}
            setDeleteUserDialog={setDeleteUserDialog}
            showLeaveModal={() => setShowLeave(true)}
            circleId={circle.id}
          />
        )}
      </MemberTable>
      <LeaveCircleModal
        epochIsActive={epochIsActive}
        open={showLeave}
        onClose={() => setShowLeave(false)}
        circleName={circle.name}
        circleId={circle.id}
      />
    </>
  );
};
