import { useEffect, useState } from 'react';

import { isUserAdmin, Role } from 'lib/users';
import { styled } from 'stitches.config';

import { makeTable } from 'components';
import { useNavigation } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { Check, X } from 'icons/__generated';
import { Avatar, Box, Link, Text, Tooltip } from 'ui';
import { shortenAddress } from 'utils';

import { QueryMember } from './getOrgMembersData';

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

const DisplayedCircles = ({ member }: { member: QueryMember }) => {
  if (member.profile.users.length <= 2) {
    return (
      <Text css={{ display: 'inline' }}>
        {member.profile.users
          .map(u => `${u.circle.name}${u.role === Role.ADMIN ? ' (A)' : ''}`)
          .join(', ')}
      </Text>
    );
  } else {
    const circles = () => (
      <Text>
        {member.profile.users
          .map(u => `${u.circle.name}${u.role === Role.ADMIN ? ' (A)' : ''}`)
          .join(', ')}
        .
      </Text>
    );
    return (
      <Text css={{ display: 'inline' }}>
        {member.profile.users
          .slice(0, 2)
          .map(u => `${u.circle.name}${u.role === Role.ADMIN ? ' (A)' : ''}`)
          .join(', ')}
        <Tooltip content={circles()}>
          <Link inlineLink target="_blank" rel="noreferrer">
            , see more
          </Link>{' '}
        </Tooltip>
      </Text>
    );
  }
};
export const MemberRow = ({ member }: { member: QueryMember }) => {
  return (
    <TR key={member.id}>
      <TD css={{ width: '20%' }} align="left">
        <MemberName member={member} />
      </TD>
      <TD>{shortenAddress(member.profile.address)}</TD>
      <TD
        css={{
          textAlign: 'right !important',
          minWidth: '$3xl',
        }}
      >
        {isCircleAdmin(member) ? (
          <Check size="lg" color="complete" />
        ) : (
          <X size="lg" color="neutral" />
        )}
      </TD>
      <TD
        css={{
          textAlign: 'right !important',
          minWidth: '$3xl',
        }}
      >
        <DisplayedCircles member={member} />
      </TD>
    </TR>
  );
};

export const OrgMembersTable = ({
  members,
  filter,
  perPage,
}: {
  members: QueryMember[];
  filter: (u: QueryMember) => boolean;
  perPage: number;
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
      {member => <MemberRow key={member.id} member={member} />}
    </OrgMembersTable>
  );
};
