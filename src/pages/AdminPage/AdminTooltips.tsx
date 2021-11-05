import { ApeInfoTooltipContentForToggle } from 'components/AppInfoTooltipContent/ApeInfoTooltipContentToggle';

export const TooltipEnableVouching = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent="Members of the circle can recommend new circle members for other circle members to vouch for"
      noContent="Only Admin may add new users"
      documentLink="https://docs.coordinape.com/welcome/admin_info"
    />
  );
};

export const TooltipDefaultOptIn = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent="All users (except those who have manually opted out) will be eligible to send and receive give without logging into Coordinape"
      noContent="All users will need to log into Coordinape and decide if they want to opt in or remain opted out"
      documentLink="https://docs.coordinape.com/welcome/admin_info"
    />
  );
};

export const TooltipTeamSelectionEnable = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent="users must select their team before going to the allocation screen and making their allocations with just their team in the allocation screen"
      noContent="users will do allocations with all team members in the allocation screen"
      documentLink="https://docs.coordinape.com/welcome/admin_info"
    />
  );
};
export const TooltipOnlyGiversCanVouch = () => {
  return (
    <ApeInfoTooltipContentForToggle
      yesContent="Only users who are eligible to Give can vouch in new users"
      noContent="Any Users in the Circle can Vouch in new Members"
      documentLink="https://docs.coordinape.com/welcome/admin_info"
    />
  );
};
