import assert from 'assert';
import React, { useState, useMemo, useEffect } from 'react';

import { QUERY_KEY_GET_ORG_MEMBERS_DATA } from 'features/orgs/getOrgMembersData';
import { isUserAdmin } from 'lib/users';
import { useQuery, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';
import { disabledStyle } from 'stitches.config';

import { NEW_CIRCLE_CREATED_PARAMS } from '../CreateCirclePage/CreateCirclePage';
import { LoadingModal } from 'components';
import { useToast, useApiAdminCircle } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useMobileDetect from 'hooks/useMobileDetect';
import { Search } from 'icons/__generated';
import { useCircleIdParam } from 'routes/hooks';
import { paths } from 'routes/paths';
import { Button, ContentHeader, Flex, Modal, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import {
  getMembersPageData,
  QueryUser,
  QUERY_KEY_GET_MEMBERS_PAGE_DATA,
} from './getMembersPageData';
import { MembersTable } from './MembersTable';
import { NomineesTable } from './NomineeTable';

export interface IDeleteUser {
  name: string;
  profileId: number;
}

const MembersPage = () => {
  const { isMobile } = useMobileDetect();
  const { showError } = useToast();

  const [keyword, setKeyword] = useState<string>('');
  const [deleteUserDialog, setDeleteUserDialog] = useState<
    IDeleteUser | undefined
  >(undefined);
  const [newCircle, setNewCircle] = useState<boolean>(false);

  const queryClient = useQueryClient();
  useEffect(() => {
    // do this initialization in useEffect because window is only available client side -g
    if (typeof window !== 'undefined') {
      setNewCircle(window.location.search === NEW_CIRCLE_CREATED_PARAMS);
    }
  }, []);

  const circleId = useCircleIdParam();

  const { error, data, refetch } = useQuery(
    [QUERY_KEY_GET_MEMBERS_PAGE_DATA, circleId],
    () => {
      assert(circleId);
      return getMembersPageData(circleId);
    },
    {
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (error instanceof Error) showError(error.message);
  }, [error]);

  const address = useConnectedAddress();
  const { deleteUser } = useApiAdminCircle(circleId);

  // User Columns
  const filterUser = useMemo(
    () => (u: QueryUser) => {
      const r = new RegExp(keyword, 'i');
      return r.test(u.profile?.name) || r.test(u.profile.address);
    },
    [keyword]
  );

  const circle = data?.circles_by_pk;
  if (!circle) return <LoadingModal visible />;

  const { nominees, users } = circle;

  const me = users?.find(
    user => user.profile.address.toLowerCase() === address?.toLocaleLowerCase()
  );

  const isCircleAdmin = isUserAdmin(me);
  const nomineeCount = nominees?.length || 0;
  const userCount = users?.length || 0;
  const cannotVouch = !me || (circle.only_giver_vouch && me.non_giver);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Circle Members</Text>
          <Text p as="p">
            Manage, nominate and vouch for members.
          </Text>
        </Flex>
        {!isMobile && (
          <Flex
            css={{
              flexGrow: 1,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: '$md',
            }}
          >
            <Text size={'small'} css={{ color: '$headingText' }}>
              <Text>
                {userCount} Member{userCount > 1 ? 's' : ''}
              </Text>
              {circle.vouching && (
                <>
                  <Text
                    css={{ whiteSpace: 'pre-wrap', color: '$secondaryText' }}
                  >
                    {' | '}
                  </Text>
                  <Text>
                    {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
                  </Text>
                </>
              )}
            </Text>
            {isCircleAdmin && (
              <Button as={NavLink} to={paths.membersAdd(circleId)} color="cta">
                Add Members
              </Button>
            )}
            {circle.vouching && (
              <Button
                as={NavLink}
                to={paths.membersNominate(circleId)}
                color="cta"
                tabIndex={cannotVouch ? -1 : 0}
                css={cannotVouch ? disabledStyle : {}}
              >
                Nominate Member
              </Button>
            )}
          </Flex>
        )}
      </ContentHeader>

      {circle.vouching && (
        <NomineesTable
          refetch={refetch}
          isNonGiverVoucher={circle?.only_giver_vouch}
          myUser={me}
          nominees={nominees}
        />
      )}
      <Panel css={{ p: '$lg' }}>
        <Flex css={{ justifyContent: 'space-between', mb: '$md' }}>
          <Text large css={{ fontWeight: '$semibold', color: '$headingText' }}>
            Members
          </Text>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Search color="neutral" />
            <TextField
              inPanel
              size="sm"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setKeyword(event.target.value)
              }
              placeholder="Search"
              value={keyword}
            />
          </Flex>
        </Flex>
        {circle && (
          <MembersTable
            users={users}
            myUser={me}
            circle={circle}
            filter={filterUser}
            perPage={15}
            setDeleteUserDialog={setDeleteUserDialog}
          />
        )}
      </Panel>
      <Modal
        open={newCircle}
        title="Congrats! You just launched a new circle."
        onOpenChange={() => setNewCircle(false)}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text p>
            {circle.organization.sample &&
            /* this length check is the only way to know that this was the prepopulated circle */
            userCount > 2 ? (
              <>
                We’ve set you up with a sample circle prepopulated with members
                and data. Feel free to add real people and experiment! Make your
                own non-sample circle when you are ready.
              </>
            ) : (
              <>
                You’ll need to add your teammates to your circle and schedule an
                epoch before you can start allocating {circle.token_name}.
              </>
            )}
          </Text>
          <Button color="primary" onClick={() => setNewCircle(false)}>
            I Understand
          </Button>
        </Flex>
      </Modal>
      <Modal
        open={!!deleteUserDialog}
        title={`Remove ${deleteUserDialog?.name} from this circle?`}
        onOpenChange={() => setDeleteUserDialog(undefined)}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Button
            color="destructive"
            onClick={
              deleteUserDialog
                ? () =>
                    deleteUser(deleteUserDialog.profileId)
                      .then(() => {
                        queryClient.invalidateQueries(
                          QUERY_KEY_GET_ORG_MEMBERS_DATA
                        );
                        setDeleteUserDialog(undefined);
                      })
                      .catch(() => setDeleteUserDialog(undefined))
                : undefined
            }
          >
            Remove
          </Button>
        </Flex>
      </Modal>
    </SingleColumnLayout>
  );
};

export default MembersPage;
