import { useEffect, useState } from 'react';

import { client } from 'lib/gql/client';
import { isUserAdmin, Role } from 'lib/users';
import { useQueryClient } from 'react-query';
import { styled } from 'stitches.config';

import { makeTable } from 'components';
import { useNavigation } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { Check, X } from 'icons/__generated';
import { Avatar, Box, Button, Flex, Link, Modal, Text, Tooltip } from 'ui';
import { shortenAddress } from 'utils';

import {
  QueryMember,
  QUERY_KEY_GET_ORG_MEMBERS_DATA,
} from './getOrgMembersData';

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
        pl: '$md',
        ml: '-$md',
      }}
    >
      <Avatar
        path={member.profile.avatar}
        name={member.profile.name}
        address={member.profile.address}
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

const DisplayedCircles = ({ member }: { member: QueryMember }) => {
  const circles = member.profile.users.map(
    u => `${u.circle.name}${u.role === Role.ADMIN ? ' (A)' : ''}`
  );

  return (
    <Text css={{ display: 'inline' }}>
      {circles.slice(0, 2).join(', ')}
      {circles.length > 2 && (
        <Tooltip content={circles.join(', ')}>
          <Link inlineLink target="_blank" rel="noreferrer">
            , see more
          </Link>{' '}
        </Tooltip>
      )}
    </Text>
  );
};

export const MemberRow = ({
  member,
  isAdmin,
}: {
  member: QueryMember;
  isAdmin: boolean;
}) => {
  const [showRemove, setShowRemove] = useState(false);
  const queryClient = useQueryClient();

  const removeUser = async () => {
    await client.mutate(
      { deleteOrgMember: [{ payload: { id: member.id } }, { success: true }] },
      { operationName: 'removeOrgMember' }
    );
    setShowRemove(false);
    queryClient.invalidateQueries(QUERY_KEY_GET_ORG_MEMBERS_DATA);
  };

  return (
    <TR key={member.id}>
      <TD css={{ width: '20%' }} align="left">
        <MemberName member={member} />
      </TD>
      <TD>{shortenAddress(member.profile.address)}</TD>
      <TD css={{ textAlign: 'right !important', minWidth: '$3xl' }}>
        {isCircleAdmin(member) ? (
          <Check size="lg" color="complete" />
        ) : (
          <X size="lg" color="neutral" />
        )}
      </TD>
      <TD css={{ textAlign: 'right !important', minWidth: '$3xl' }}>
        {isAdmin && member.profile.users.length === 0 ? (
          <Button
            inline
            size="xs"
            color="secondary"
            onClick={() => setShowRemove(true)}
          >
            Remove
          </Button>
        ) : (
          <DisplayedCircles member={member} />
        )}
      </TD>
      {showRemove && (
        <Modal
          open
          title={`Remove ${member.profile.name} from this organization?`}
          onOpenChange={() => setShowRemove(false)}
        >
          <Flex column alignItems="start" css={{ gap: '$md' }}>
            <Button color="destructive" onClick={removeUser}>
              Remove
            </Button>
          </Flex>
        </Modal>
      )}
    </TR>
  );
};

export const OrgMembersTable = ({
  members,
  filter,
  perPage,
  isAdmin,
}: {
  members: QueryMember[];
  filter: (u: QueryMember) => boolean;
  perPage: number;
  isAdmin: boolean;
}) => {
  const { isMobile } = useMobileDetect();
  const [view, setView] = useState<QueryMember[]>([]);

  useEffect(() => {
    const filtered = filter ? members.filter(filter) : members;
    setView(filtered);
  }, [members, perPage, filter]);

  const OrgMembersTable = makeTable<QueryMember>('OrgMembersTable');

  const headers = [
    { title: 'Name', css: headerStyles },
    {
      title: 'ETH WALLET',
      css: headerStyles,
      isHidden: isMobile,
    },
    {
      title: 'Admin',
      css: {
        ...headerStyles,
        textAlign: 'right !important',
      },
    },
    {
      title: 'Circles',
      css: { ...headerStyles, textAlign: 'right' },
    },
  ];

  return (
    <OrgMembersTable
      headers={headers}
      data={view}
      startingSortIndex={0}
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
        <MemberRow key={member.id} member={member} isAdmin={isAdmin} />
      )}
    </OrgMembersTable>
  );
};
