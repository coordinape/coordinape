import { circleApiPermissionsSelector } from './useCircleApiKeys';

export const API_PERMISSION_LABELS: Record<
  keyof typeof circleApiPermissionsSelector,
  string
> = {
  read_circle: 'Read Circle Info',
  read_nominees: 'Read Nominees',
  read_pending_token_gifts: 'Read Allocations',
  read_member_profiles: 'Read Member Profiles',
  read_epochs: 'Read Epochs',
  update_circle: 'Update Circle',
  update_pending_token_gifts: 'Update Allocations',
  create_vouches: 'Create Vouches',
};
