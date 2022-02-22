import assert from 'assert';
import { gql } from './Gql';

export const getUserFromProfileIdWithCircle = async (
    profileId: number,
    circleId: number
) => {
    const { profiles_by_pk } = await gql.q('query')({
        profiles_by_pk: [
            {
                id: profileId,
            },
            {
                users: [
                    {
                        where: {
                            circle_id: { _eq: circleId },
                        },
                    },
                    {
                        circle: {
                          nomination_days_limit: true,
                          min_vouches: true
                        },
                        id: true,
                    },
                ],
            },
        ],
    });
    assert(profiles_by_pk, 'Profile cannot be found');
    const user = profiles_by_pk.users.pop();
    assert(user, `user for circle_id ${circleId} not found`);
    return user;
};

export const insertNominee = async (
    nominatedByUserId: number,
    circleId: number,
    address: string,
    name: string,
    description: string,
    nominationDaysLimit: number,
    vouchesRequired: number
) => {
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(today.getDate() + nominationDaysLimit);
    const { insert_nominees_one } = await gql.q('mutation')({
        insert_nominees_one: [
            {
                object: {
                    address: address,
                    circle_id: circleId,
                    name: name,
                    description: description,
                    nominated_by_user_id: nominatedByUserId,
                    nominated_date: today,
                    expiry_date: expiry,
                    vouches_required: vouchesRequired
                }
            },
            {
                id: true
            },
        ],
    });

    return insert_nominees_one;
};