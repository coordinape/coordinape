import { useEffect, useRef, useState } from 'react';

import { QueryMember } from 'features/orgs/getOrgMembersData';
import { isUserAdmin } from 'lib/users';
import { styled } from 'stitches.config';

import { LoadingModal, makeTable } from 'components';
import CopyCodeTextField from 'components/CopyCodeTextField';
import { useNavigation, useToast } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { Check } from 'icons/__generated';
import { Avatar, Box, Button, CheckBox, Flex, Panel, Text } from 'ui';
import { shortenAddress } from 'utils';

import { ChangedUser, NewMember } from './NewMemberList';

const TD = styled('td', {});
const TR = styled('tr', {});

const headerStyles = {
  color: '$secondaryText',
  textTransform: 'uppercase',
  fontSize: '$small',
  fontWeight: '$semibold',
  lineHeight: '$shorter',
};

const MemberName = ({ member }: { member: QueryMember }) => {
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
      }}
    >
      <Avatar
        path={member.profile.avatar}
        name={member.profile.name}
        size="small"
        onClick={getToProfile(member.profile.address)}
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
        {member.profile.name}{' '}
      </Text>
    </Box>
  );
};

const isCircleAdmin = (member: QueryMember): boolean => {
  if (member.profile.users.find(u => isUserAdmin(u)) !== undefined) return true;
  return false;
};

export const MemberRow = ({
  onChecked,
  checked,
  member,
  currentCircleId,
}: {
  checked: boolean;
  onChecked(checked: boolean): void;
  member: QueryMember;
  currentCircleId: number;
}) => {
  const circleIds = member.profile.users.map(u => u.circle.id);
  const memberInCircle = circleIds.includes(currentCircleId);
  return (
    <TR
      key={member.id}
      css={{
        opacity: memberInCircle ? 0.3 : 1,
        pointerEvents: memberInCircle ? 'none' : 'auto',
      }}
    >
      <TD align="left">
        <CheckBox
          value={memberInCircle || checked}
          onChange={() => onChecked(!checked)}
        />
      </TD>
      <TD align="left">
        <MemberName member={member} />
      </TD>
      <TD>{shortenAddress(member.profile.address)}</TD>
    </TR>
  );
};

export const AddOrgMembersTable = ({
  currentCircleId,
  members,
  filter,
  perPage,
  save,
  welcomeLink,
}: {
  currentCircleId: number;
  members: QueryMember[];
  filter: (u: QueryMember) => boolean;
  perPage: number;
  save: (members: NewMember[]) => Promise<ChangedUser[]>;
  welcomeLink?: string;
}) => {
  const { isMobile } = useMobileDetect();
  const [view, setView] = useState<QueryMember[]>([]);
  const { showError } = useToast();

  useEffect(() => {
    const filtered = filter ? members.filter(filter) : members;
    setView(filtered);
  }, [members, perPage, filter]);

  const OrgMembersTable = makeTable<QueryMember>('OrgMembersTable');
  const [checkedAll, setCheckedAll] = useState(false);
  const [membersToAdd, setMembersToAdd] = useState<Record<string, QueryMember>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>();
  const successRef = useRef<HTMLDivElement>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedMembers = Object.values(membersToAdd);
  const onSubmit = async () => {
    try {
      setLoading(true);
      setSuccessCount(0);
      setIsSubmitting(true);
      const newMembers: NewMember[] = selectedMembers.map(m => ({
        name: m.profile.name,
        address: m.profile.address,
        entrance: 'ORGLIST',
      }));
      if (newMembers.length > 0) {
        save(newMembers);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessCount(selectedMembers.length);
      setIsSubmitting(false);
      successRef.current?.scrollIntoView();
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const checkAll = () => {
    setCheckedAll(prev => !prev);
  };
  useEffect(() => {
    if (checkedAll) {
      const m: Record<string, QueryMember> = {};
      for (const member of members) {
        m[member.profile.address] = member;
      }
      setMembersToAdd(m);
    } else {
      setMembersToAdd({});
    }
  }, [checkedAll]);
  const headers = [
    {
      title: (
        <>
          <CheckBox value={checkedAll} onChange={() => checkAll()} />
        </>
      ),
      css: headerStyles,
    },
    { title: 'Name', css: headerStyles },
    {
      title: 'ETH WALLET',
      css: headerStyles,
      isHidden: isMobile,
    },
  ];

  return (
    <>
      {loading && <LoadingModal visible={true} />}
      <OrgMembersTable
        headers={headers}
        data={view}
        startingSortIndex={1}
        perPage={perPage}
        sortByColumn={(index: number) => {
          if (index === 0)
            return (m: QueryMember) => m.profile.name.toLowerCase();
          if (index === 1)
            return (m: QueryMember) => m.profile.address.toLowerCase();
          if (index === 2) return (m: QueryMember) => isCircleAdmin(m);
          return (m: QueryMember) => m.profile.name.toLowerCase();
        }}
      >
        {member => (
          <MemberRow
            checked={membersToAdd[member.profile.address] != undefined}
            onChecked={checked => {
              if (checked) {
                setMembersToAdd(prev => ({
                  ...prev,
                  [member.profile.address]: member,
                }));
              } else {
                setMembersToAdd(prev => {
                  const members = { ...prev };
                  delete members[member.profile.address];
                  return members;
                });
              }
            }}
            key={member.id}
            member={member}
            currentCircleId={currentCircleId}
          />
        )}
      </OrgMembersTable>
      <Button
        type="submit"
        disabled={selectedMembers.length === 0 || isSubmitting}
        onClick={onSubmit}
        color="primary"
        size="large"
        fullWidth
        css={{ mt: '$md' }}
      >
        {isSubmitting
          ? 'Adding Members...'
          : selectedMembers.length <= 1
          ? 'Add Member'
          : `Add ${selectedMembers.length} Members`}
      </Button>
      <div ref={successRef}>
        {successCount > 0 && (
          <Panel
            css={{ mt: '$xl', border: '1px solid $currentEpochDescription' }}
          >
            <Flex>
              <Check
                color="currentEpochDescription"
                size="lg"
                css={{ mr: '$md' }}
              />
              <Box css={{ color: '$currentEpochDescription', flexGrow: 1 }}>
                <Text size="medium" color="inherit">
                  You have added {selectedMembers.length} member
                  {selectedMembers.length == 1 ? '' : 's'}!
                  {welcomeLink && (
                    <>
                      &nbsp;
                      <Text semibold color="inherit">
                        Share this link to get them started.
                      </Text>
                    </>
                  )}
                </Text>
                {welcomeLink && (
                  <Box css={{ mt: '$md' }}>
                    <CopyCodeTextField value={welcomeLink} />
                  </Box>
                )}
              </Box>
            </Flex>
          </Panel>
        )}
      </div>
    </>
  );
};
