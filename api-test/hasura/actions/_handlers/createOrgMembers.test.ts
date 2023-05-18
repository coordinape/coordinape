/* eslint-disable @typescript-eslint/no-unused-vars */
import faker from 'faker';

const { mockLog } = jest.requireMock('../../../../src/common-lib/log');
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createOrganization,
  createProfile,
  createOrgMember,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

jest.setTimeout(10000);

let address, profile, user, circle, org, org_member;

beforeEach(async () => {
  address = await getUniqueAddress();
  org = await createOrganization(adminClient);
  circle = await createCircle(adminClient, {
    name: 'test org',
    organization_id: org.id,
  });
  profile = await createProfile(adminClient, {
    address,
    name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
  });
  user = await createUser(adminClient, {
    address,
    circle_id: circle.id,
  });
  org_member = await createOrgMember(adminClient, {
    org_id: org.id,
    profile_id: profile.id,
  });
});

describe('provided invalid input', () => {
  test('errors if user list contains duplicates', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    await expect(() =>
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: '0x1d3bf13f8f7a83390d03db5e23a950778e1d1309',
                    name: 'tester',
                    entrance: 'manual-address-entry',
                  },
                  {
                    address: '0x1d3bf13f8f7a83390d03db5e23a950778e1d1309',
                    name: 'tester2',
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            { __typename: true },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '422',
              },
              message:
                'Users list contains duplicate addresses: 0x1d3bf13f8f7a83390d03db5e23a950778e1d1309',
            },
          ],
        },
        null,
        2
      )
    );
  });

  test('errors if user list contains invalid ENS', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    await expect(() =>
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: '0x1d3bf13f8f7a83390d03db5e23a950778e1d1309',
                    name: 'vitalik.eth',
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            { __typename: true },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '422',
              },
              message:
                'ENS vitalik.eth does not resolve to the entered address.',
            },
          ],
        },
        null,
        2
      )
    );
  });

  test('it undeletes deleted members users', async () => {
    // create a deleted org member
    const deleted_profile = await createProfile(adminClient);
    await createOrgMember(adminClient, {
      org_id: org.id,
      profile_id: deleted_profile.id,
      deleted_at: new Date().toISOString(),
    });

    const client = mockUserClient({ profileId: profile.id, address });
    await expect(
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: deleted_profile.address,
                    name: deleted_profile.name,
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            {
              new: true,
              OrgMemberResponse: { profile_id: true },
            },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).resolves.toEqual({
      createOrgMembers: [
        {
          OrgMemberResponse: { profile_id: deleted_profile.id },
          new: true,
        },
      ],
    });
  });

  test('it no-ops on existing users', async () => {
    // create a deleted org member
    const existing_profile = await createProfile(adminClient);
    await createOrgMember(adminClient, {
      org_id: org.id,
      profile_id: existing_profile.id,
    });

    const client = mockUserClient({ profileId: profile.id, address });
    await expect(
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: existing_profile.address,
                    name: existing_profile.name,
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            {
              new: true,
            },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).resolves.toEqual({
      createOrgMembers: [
        {
          new: false,
        },
      ],
    });
  });
  test('it creates new users', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    await expect(
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: await getUniqueAddress(),
                    name: `${faker.name.firstName()} ${faker.datatype.number(
                      10000
                    )}`,
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            {
              new: true,
            },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).resolves.toEqual({
      createOrgMembers: [
        {
          new: true,
        },
      ],
    });
  });
  test('it nicely handles profile name conflicts', async () => {
    const client = mockUserClient({ profileId: profile.id, address });

    const conflictingName = `${faker.name.firstName()} ${faker.datatype.number(
      10000
    )}`;

    await expect(
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: await getUniqueAddress(),
                    name: conflictingName,
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            {
              new: true,
            },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).resolves.toEqual({
      createOrgMembers: [
        {
          new: true,
        },
      ],
    });

    // create a new org member with the same name
    await expect(
      client.mutate(
        {
          createOrgMembers: [
            {
              payload: {
                org_id: org.id,
                users: [
                  {
                    address: await getUniqueAddress(),
                    name: conflictingName,
                    entrance: 'manual-address-entry',
                  },
                ],
              },
            },
            {
              new: true,
            },
          ],
        },
        { operationName: 'test_createOrgMembers' }
      )
    ).rejects.toThrowError(
      `Members list contains a name already in use: ${conflictingName}`
    );
  });
});
