import type { Location } from 'react-router-dom';

export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_BLOG = 'https://coordinape.com/blog';
export const START_A_PARTY_INTENT =
  'https://warpcast.com/~/compose?text=https://give.party/type-a-skill-here';
export const EXTERNAL_URL_DOCS_GIVE =
  'https://docs.coordinape.com/colinks/give';
export const EXTERNAL_URL_DOCS_SOCIAL_ORACLE =
  'https://docs.coordinape.com/social-oracle-tm-give';
export const EXTERNAL_URL_SOCIAL_ORACLE_SCHEMA =
  'https://base.easscan.org/schema/view/0x82c2ec8ec89cf1d13022ff0867744f1cecf932faa4fe334aa1bb443edbfee3fa';
export const EXTERNAL_URL_DOCS_COLINKS =
  'https://docs.coordinape.com/colinks/what-is-colinks';
export const EXTERNAL_URL_DOCS_CONTRIBUTIONS =
  'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/record-contributions#contributions';
export const EXTERNAL_URL_DOCS_INTEGRATIONS =
  'https://docs.coordinape.com/info/integrations';
export const EXTERNAL_URL_TOS = 'https://coordinape.com/terms';
export const EXTERNAL_URL_DOCS_ORG_MEMBERSHIP =
  'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/managing-organization-membership';
export const EXTERNAL_URL_SCHEDULE_WALKTHROUGH =
  'https://coordinape.com/schedule-a-walkthrough?utm_medium=helpbutton&utm_campaign=onboarding';
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_DISCORD = 'https://discord.coordinape.com';
export const EXTERNAL_URL_GET_STARTED =
  'https://docs.coordinape.com/get-started/get-started';
export const EXTERNAL_URL_GET_STARTED_MEMBER =
  'https://docs.coordinape.com/get-started/get-started/new-coordinape-members';
export const EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO =
  'https://www.youtube.com/watch?v=j2ixf0Isuuo';
export const EXTERNAL_URL_DISCORD_SUPPORT =
  'https://discord.coordinape.com/support';
export const EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE =
  'https://coordinape.com/post/why-is-coordinape-in-my-circle?utm_source=coordinape-app&utm_medium=tooltip&utm_campaign=coordinapeincircle';
export const EXTERNAL_URL_MAILTO_SUPPORT = 'mailto:support@coordinape.com';
export const EXTERNAL_URL_MAILTO_COLINKS_SUPPORT =
  'mailto:colinks@coordinape.com';
export const EXTERNAL_URL_REPORT_ABUSE_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLScqdAJtxv8eKGQJ35RyWLYOIuwO4NsmLa78rS3jKq6k6dsLNw/viewform?usp=pp_url';

const toSearchString = (params: Record<string, string | number>) =>
  Object.entries(params)
    .reduce<URLSearchParams>((p, [key, val]) => {
      p.set(key, val.toString());
      return p;
    }, new URLSearchParams())
    .toString();

const withSearchParams = (
  path: string,
  params?: Record<string, string | number>
) =>
  params && Object.keys(params).length > 0
    ? `${path}?${toSearchString(params)}`
    : path;

const circlePath = (suffix: string) => (circleId: number) =>
  `/circles/${circleId}/${suffix}`;

const orgPath = (suffix: string) => (orgId: number) =>
  `/organizations/${orgId}/${suffix}`;

export const coLinksPaths = {
  account: '/account',
  authenticate: (token: string) => `/authdevice/${token}`,
  bigQuestion: (id: string) => `/bigquestion/${id}`,
  bigQuestions: '/bigquestions',
  casts: '/casts',
  explore: '/explore',
  exploreHoldingMost: `/explore/holdingmost`,
  exploreMostLinks: `/explore/mostlinks`,
  exploreNewest: `/explore/newest`,
  exploreMostGive: `/explore/mostgive`,
  exploreMostGiven: `/explore/mostgiven`,
  exploreOld: '/exploreold',
  exploreRepScore: `/explore/repscore`,
  exploreSkill: (skill: string) => `/explore/interests/${skill}`,
  exploreSkills: `/explore/interests`,
  give: '/give',
  giveSkill: (skill: string) => `/give/leaderboard/${skill}`,
  giveSkillMap: (skill: string) => `/give/map/${skill}`,
  deprecated_giveParty: `/giveparty`,
  deprecated_givePartyAddress: (address: string) => `/giveparty/${address}`,
  deprecated_givePartyBoard: `/giveboard`,
  deprecated_giveBoardSkill: (skill: string) => `/giveboard/${skill}`,
  highlights: '/highlights',
  history: (address: string) => `/${address}/history`,
  holders: (address: string) => `/${address}/holders`,
  holdings: (address: string) => `/${address}/holdings`,
  home: '/home',
  linksmap: '/linksmap',
  info: '/info',
  inviteCode: (code: string) => `/invite/${code}`,
  invites: '/invites',
  launch: '/launch',
  leaderboard: '/leaderboard',
  linking: '/linking',
  notifications: '/notifications',
  post: (id: string) => `/post/${id}`,
  profilePosts: (address: string) => `/${address}/posts`,
  profileGive: (address: string) => `/${address}`,
  profileGiveMap: (address: string) => `/${address}/givemap`,
  skillGiveMap: (skill: string) => `/give/map/${skill}`,
  profileNetwork: (address: string) => `/${address}/network`,
  profileReputation: (address: string) => `/${address}/reputation`,
  root: '/',
  score: (address: string) => `/${address}/score`,
  search: `/search`,
  searchResult: (query: string, model: string) => `/search/${model}/${query}`,
  unsubscribe: (unsubscribeToken: string) =>
    `/email/unsubscribe/${unsubscribeToken}`,
  verify: (uuid: string) => `/email/verify/${uuid}`,
  verifyWaitList: (uuid: string) => `/email/verifywaitlist/${uuid}`,
  wizard: '/wizard',
  wizardStart: '/start',
};

export const coSoulPaths = {
  cosoul: '/cosoul',
  mint: '/cosoul/mint',
  cosoulView: (address: string) => `/cosoul/${address}`,
  cosoulArt: (tokenId: string) => `/cosoul/art/${tokenId}`,
  cosoulImage: (tokenId: string) => `/cosoul/image/${tokenId}`,
  cosoulGallery: '/cosoul/gallery',
  cosoulExplore: '/cosoul/explore',
};

export const givePaths = {
  // circle-specific
  circleAdmin: circlePath('admin'),
  circleAdminApi: circlePath('admin/api'),
  connectIntegration: circlePath('admin/connect-integration'),
  contributions: circlePath('contributions'),
  give: circlePath('give'),
  circle: (circleId: number) => `/circles/${circleId}`,
  epochs: circlePath('epochs'),
  members: circlePath('members'),
  membersAdd: circlePath('members/add'),
  membersNominate: circlePath('members/nominate'),
  vouching: circlePath('vouching'),
  distributions: (circleId: number, epochId: number | string) =>
    `/circles/${circleId}/distributions/${epochId}`,
  map: (circleId: number, params?: { highlight?: string; epochId?: number }) =>
    withSearchParams(`/circles/${circleId}/map`, params),

  // other
  account: '/account',
  createCircle: `/new-circle`,
  developers: '/developers',
  discordLink: '/discord/link',
  home: '/',
  profile: (address: string) => `/profile/${address}`,

  organization: (orgId: string) => `/organizations/${orgId}`,
  orgActivity: orgPath('activity'),
  organizationSettings: orgPath(`settings`),
  orgMembers: orgPath(`members`),
  orgMembersAdd: orgPath(`members/add`),

  // for circle links
  welcome: (token: string) => `/welcome/${token}`,
  join: (token: string) => `/join/${token}`,

  // email verification
  verify: (uuid: string) => `/email/verify/${uuid}`,
  unsubscribe: (unsubscribeToken: string) =>
    `/email/unsubscribe/${unsubscribeToken}`,
};

export const isCircleSpecificPath = (location: Location) =>
  /\/circles\/\d+/.test(location.pathname);

export const isOrgSpecificPath = (location: Location) =>
  /\/organizations\/\d+/.test(location.pathname);

export const getCircleFromPath = (location: Location) =>
  location.pathname.match(/\/circles\/(\d+)/)?.[1];

export const getOrgFromPath = (location: Location) =>
  location.pathname.match(/\/organizations\/(\d+)/)?.[1] ??
  location.search.match(/org=(\d+)/)?.[1];
