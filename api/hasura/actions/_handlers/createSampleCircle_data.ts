import * as mutations from '../../../../api-lib/gql/mutations';

type CircleInput = Parameters<typeof mutations.insertCircleWithAdmin>[0];

export const sampleCircleDefaults: CircleInput = {
  user_name: 'Me',
  circle_name: 'Sample DAO Core Circle',
  organization_name: 'Sample DAO',
  sampleOrg: true,
};

export interface SampleMemberData {
  name: string;
  address: string;
  contributions: string[];
  epochStatement: string;
  index: number;
  gifts: { [key: number]: { gift: number; note?: string } };
}

export interface SampleMember extends SampleMemberData {
  user_id: number;
}

export const sampleMemberData: SampleMemberData[] = [
  {
    index: 6,
    address: '0xf205cad4799fa4953eb514334d6bff75c9641e03',
    name: 'Beth the Backend Dev',
    contributions: [
      `Implemented Hasura into our tech stack
      - Squashed bugs
      - Updated the DB names to accommodate Francines Designs`,
      `Fixed our vercel integration, saved 5 minutes per load`,
      `Added the onboarding details for new community devs to the docs`,
      `Created place for the API Keys to be stored so we can integrate with lens protocol
    Updated the typescript library in the dev kit`,
    ],
    epochStatement: `- Improved New Dev Experience
- Faster Backend
- Hasura`,
    gifts: {
      0: {
        gift: 7,
        note: `Two things
1. A moment of applause for the way you handled the conflict between Diana and Oscar.
2. I'd like to get some more pointed feedback from you when you have a chance. I feel like I go off on rabbit trails too often before you pull me back into the real world.  `,
      },
      1: { gift: 0 },
      2: { gift: 30 },
      3: { gift: 5 },
      4: { gift: 23 },
      5: { gift: 5 },
      7: { gift: 19 },
      8: { gift: 11 },
    },
  },
  {
    index: 8,
    address: '0xc4da5890d7300075c665dbe1ea199b7d4a85f43f',
    name: 'Clarence the Community Dev',
    contributions: [
      `I picked up three bug tickets
      1. User can't log in
      2. User can't change pfp
      3. User unable to see claim button`,
      `Paired with Francine to implement the animations from the allocation page to the claims page`,
      `Picked up the dark mode ticket for the allocation page`,
      `Worked on modal for updating profile picture`,
      `Provided feedback to Beth on the new dev onboarding experience`,
    ],
    epochStatement: `After getting my dev environment set up I was able to grab several tickets and I hope to be able to continue to do so! Happy to be here for my first Coordinape Epoch!`,
    gifts: {
      0: {
        gift: 10,
        note: `Thanks for welcoming me in so quickly! You were very encouraging when I was getting stuck on the dev environment bugs`,
      },
      1: { gift: 0 },
      2: { gift: 30 },
      3: { gift: 5 },
      4: { gift: 13 },
      5: { gift: 12 },
      6: { gift: 19 },
      7: { gift: 11 },
    },
  },
  {
    index: 7,
    address: '0xd22aa0c735650aa58c4c784366a61f7cada246fd',
    name: 'Diana the Designer',
    contributions: [
      `Polishing the new onboarding interface ✌`,
      `Updated the figma for the new contribution page`,
      `Designed dark mode for the mobile app`,
      `Designed integrations page`,
      `Started user research to create personas`,
    ],
    epochStatement: `Spent most of my time with Francine but also started on the New User Research, I've reached out to 47 users so far`,
    gifts: {
      0: {
        gift: 10,
        note: `Thanks for stepping in between me and Oscar. The way you handled that was very gracious`,
      },
      1: { gift: 0 },
      2: { gift: 20 },
      3: { gift: 5 },
      4: { gift: 23 },
      5: { gift: 12 },
      6: { gift: 19 },
      8: { gift: 11 },
    },
  },
  {
    index: 5,
    address: '0xff0ca13819312375171fecd98460e5fb71c7ff6f',
    name: 'Francine the Front End Dev ',
    contributions: [
      `Paired with Diana to discuss the implentation of the new animations on the home page`,
      `Added animation to the allocation page`,
      `Implemented darkmode on the mobile app`,
      `Building the integrations page the Diana designed`,
      `Updated the storybook definitions for all the colors for the rebrand`,
    ],
    epochStatement: `Lots of time spent pairing with Diana.
1. **Darkmode**
2. Mobile layout
3. New Animations`,
    gifts: {
      0: {
        gift: 9,
        note: `It's amazing how well we've been grooving this epoch, I always enjoy working with you! `,
      },
      1: { gift: 0 },
      2: { gift: 30 },
      3: { gift: 5 },
      4: { gift: 23 },
      6: { gift: 12 },
      7: { gift: 10 },
      8: { gift: 11 },
    },
  },
  {
    index: 2,
    address: '0x8f6d70b1318c6936d50f55b6f94311acc7df109c',
    name: 'Harry the Helper',
    contributions: [
      `I walked serval new users through how to use our app in the #support Channel **The Coordinape Team** has some promising stuff happening!`,
      `Met with the team from **BanklessDAO** to see if we could collaborate on the onboarding quest that Sue was talking about in the all hands`,
      `I found a small bug on the allocation page, created a github issue for it with screenshots and a video explaining it.`,
      `QA for the mobile layout with Francine **AMPED FOR DARK MODE**`,
      `Walked Oscar through how to update his settings.`,
    ],
    epochStatement: `I spent a lot of my time this epoch onboarding people and helping with QA.`,
    gifts: {
      0: {
        gift: 30,
        note: `**YO!** I am thrilled you're here. I've really enjoyed working with you this last epoch. Especially appreciated the way you handled the negativity in the Discord.`,
      },
      1: { gift: 0 },
      3: { gift: 11 },
      4: { gift: 5 },
      5: { gift: 11 },
      6: { gift: 21 },
      7: { gift: 11 },
      8: { gift: 11 },
    },
  },
  {
    index: 1,
    address: '0x4c6775916622adb8a73273325326daaceec6aa30',
    name: 'Oscar the Grouch',
    contributions: [
      `I posted 87 Messages in the Discord about how SBF is a good person`,
      `Ensured that no-one would use our competitors platform by posting a killer tweet thread`,
      `I found a bug on the home page, I posted about it on Twitter.`,
      `Told Diana that the Mobile layout doesn't work the way I think it should`,
      `Discovered the latest change made me lose my settings. I posted to the general channel in discord`,
    ],
    epochStatement: `I feel like I'm the only one doing any QA. I wish I coud code so that I could just fix this stuff myself.
- Spent a lot of time with the FTX team to figure out how we could have them run our treasury
- Researched how we could get 20% yeilds on our treasury through Luna`,
    gifts: {
      0: {
        gift: 30,
        note: `Even I, the eternal pessimist, am glad you're here. I think we'll see the benefits of your involvement for years to come... It hurts me to say that... So don't screw it up.`,
      },
      2: { gift: 1 },
      3: { gift: 1 },
      4: { gift: 1 },
      5: { gift: 1 },
      6: { gift: 1 },
      7: { gift: 1 },
      8: { gift: 1 },
    },
  },
  {
    index: 4,
    address: '0x2f8d6f7b6c393a6a5f58113c9511c263bedb6ad3',
    name: 'Sandeep the Solidity Dev',
    contributions: [
      `### Updated the testing script for the new contracts`,
      `Gas Golfed our claim contracts, saved 100 gwei`,
      `Fixed the issues that came back from the audit, they were minor so were prettty quick fixes`,
      `Working on integrating our app with Coordinape Vaults, their code is so clean 😍`,
      `Submitted new contracts for review to the auditor`,
    ],
    epochStatement: `Spent lots of time prepping the contracts for audit, and fixing their feedback.`,
    gifts: {
      0: {
        gift: 23,
        note: `thx 4 the connection to **vyper** I'll never code another way`,
      },
      1: { gift: 0 },
      2: { gift: 30 },
      3: { gift: 5 },
      5: { gift: 0 },
      6: { gift: 12 },
      7: { gift: 19 },
      8: { gift: 11 },
    },
  },
  {
    index: 3,
    address: '0x9a5c1ef950edaf10eec9c7b22899f1022041e3c1',
    name: 'Sue the Steward',
    contributions: [
      `I lead the *All hands* meeting
      - Created agenda
      - Created tickets in Github for the follow up items`,
      `Cleaned up 6 github issues that had been closed but were still showing open`,
      `Met with Harry to understand the allocation page bug`,
      `Created a github project for the new rebranding tasks`,
      `Had a meeting with the dev team to talk about lingering github issues. Closed all stale issues!`,
    ],
    epochStatement: `After a huge push to get the big objects over the line last epoch, I took the time to pair with the dev teams to clean up some issues that had cropped up while we were focused on those
- I also created the project for the next scope of work`,
    gifts: {
      0: {
        gift: 5,
        note: `You're a *life saver.* I would have never seen those issues in github without you bringing them to my attention`,
      },
      1: { gift: 0 },
      2: { gift: 30 },
      4: { gift: 5 },
      5: { gift: 12 },
      6: { gift: 18 },
      7: { gift: 19 },
      8: { gift: 11 },
    },
  },
];
