import { ApeInfoTooltipContentForToggle } from 'components/AppInfoTooltipContent/ApeInfoTooltipContentToggle';
const ENABLE_VOUCHING_YES =
  'Members of the circle can recommend new circle members for other circle members to vouch for';
const ENABLE_VOUCHING_NO = 'Only Admin may add new users';
const DEFAULT_OPT_IN_YES =
  'All users (except those who have manually opted out) will be eligible to send and receive give without logging into Coordinape';
const DEFAULT_OPT_IN_NO =
  'All users will need to log into Coordinape and decide if they want to opt in or remain opted out';
const TEAM_SELECTION_ENABLE_YES =
  'users must select their team before going to the allocation screen and making their allocations with just their team in the allocation screen';
const TEAM_SELECTION_ENABLE_NO =
  'users will do allocations with all team members in the allocation screen';
const ONLY_GIVER_CAN_VOUCH_YES =
  'Only users who are eligible to Give can vouch in new users';
const ONLY_GIVER_CAN_VOUCH_NO =
  'Any Users in the Circle can Vouch in new Members';

export const TooltipEnableVouching = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent={ENABLE_VOUCHING_YES}
      noContent={ENABLE_VOUCHING_NO}
      documentLink="_blank"
    />
  );
};

export const TooltipDefaultOptIn = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent={DEFAULT_OPT_IN_YES}
      noContent={DEFAULT_OPT_IN_NO}
      documentLink="_blank"
    />
  );
};

export const TooltipTeamSelectionEnable = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent={TEAM_SELECTION_ENABLE_YES}
      noContent={TEAM_SELECTION_ENABLE_NO}
      documentLink="_blank"
    />
  );
};
export const TooltipOnlyGiversCanVouch = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent={ONLY_GIVER_CAN_VOUCH_YES}
      noContent={ONLY_GIVER_CAN_VOUCH_NO}
      documentLink="_blank"
    />
  );
};
