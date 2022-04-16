import { z } from 'zod';

import { CircleMember } from '../hooks/gql/useCircleMembers';
import { ICircle } from '../types';
import { USER_ROLE_ADMIN } from 'config/constants';

import { createForm } from './createForm';
import { zEthAddress, zBooleanToNumber } from './formHelpers';

interface MemberAndCircle {
  member?: CircleMember;
  circle: ICircle;
}

const schema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    address: zEthAddress,
    non_giver: z.boolean(),
    fixed_non_receiver: z.boolean(),
    non_receiver: z.boolean(),
    role: zBooleanToNumber,
    starting_tokens: z.number(),
  })
  .strict();

const AdminUserForm = createForm({
  name: 'adminUserForm',
  getInstanceKey: (cm: MemberAndCircle) =>
    cm.member ? String(cm.member.id) : `new`,
  getZodParser: () => schema,
  load: (mac: MemberAndCircle) => ({
    name: mac.member?.name ?? '',
    address: mac.member?.profile.address ?? '',
    non_giver: mac.member?.non_giver ?? false,
    fixed_non_receiver: !!mac.member?.fixed_non_receiver ?? false,
    non_receiver:
      !!mac.member?.fixed_non_receiver || !!mac.member?.non_receiver,
    role: mac.member?.role === USER_ROLE_ADMIN ?? false,
    starting_tokens: mac.member?.starting_tokens ?? 100,
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default AdminUserForm;
