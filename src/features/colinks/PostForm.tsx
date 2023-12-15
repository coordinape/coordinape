import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';

export const PROMPTS = [
  'What is your ideal organizational culture?',
  'What’s the craziest idea you’ve heard this week?',
  'What’s the biggest win you’ve had this week?',
  'What’s an exciting idea you wish was more widely understood?',
  'What’s the most exciting tech you have come across lately?',
  "What's your spirit animal?",
  'What is the best professional advice you ever received?',
  'What’s new and emerging that no one really is talking about enough?',
  'What are three things you can’t work without?',
  "Share a valuable lesson you've learned in your career.",
  'What’s a new skill you’ve learned?',
  'What’s being slept on?',
  'What famous landmark would you shrink to fit on your desk?',
  'Pose a question about a specific skill or technique in your industry.',
  'How many jobs have you had in your life?',
  'What’s the skill you feel most proud of?',
  'Share an anniversary or milestone in your career.',
  'If you could have any job in the world for one week, what would it be?',
  'GM',
  "What's a big professional win you've had?",
  'Alpha leak please.',
  'If you were a ghost, where would you haunt?',
  "What's the strangest job you've had?",
  'What mythical creature do you wish existed?',
  'What inanimate object would you like to have a conversation with?',
  'Tell us something that concerns you greatly.',
  "What's a memorable professional blunder?",
  'What historical figure would you have dinner with, and why?',
  'What’s an exciting idea you wish was more widely understood?',
  'Tell us something you’ve noticed on the horizon.',
  'What gives you tons of energy right now?',
  'Discuss a current trend in your field.',
  'What are you hopeful about?',
  "Highlight an awesome project you've been a part of.",
  'Celebrate a colleague.',
  'What are you thinking about building?',
  'What’s the skill you feel most proud of?',
  "What's the best productivity hack you've found for yourself?",
  "What is commonly accepted in your industry that shouldn't be?",
  "What's the best book about leadership you've read?",
  'What is most important development in your industry in the past 6 months?',
  'What are you building that you are psyched about?',
  'What’s the skill you feel most proud of?',
  'What gives you tons of energy right now?',
  'Where do you want to go next in your career?',
  'What’s the worst idea that you’ve seen in your field?',
  'If you could replace your hands with objects, what would they be?',
  "What's the best professional advice you ever recieved?",
  "What's a movie you love?",
  'If you could meet any fictional character, who would it be?',
  'What was your first job?',
  'What’s the biggest miss you’ve had in the last few years?',
  'Who has inspired your work?',
  'What was your worst job?',
  'What is the best professional advice you ever recieved?',
  'What’s a goal or aspiration you have for the next year?',
  'Share a surprising skill or hobby that most people don’t know you have.',
  'What’s a goal or aspiration you have for the next year?',
  'If you could master any skill instantly, what would it be and how would you use it?',
  'What will revolutionize the world in the next decade?',
];

export const PostForm = ({
  showLoading,
  onSave,
  onSuccess,
}: {
  showLoading?: boolean;
  onSave?: () => void;
  onSuccess?: () => void;
}) => {
  return (
    <ContributionForm
      showLoading={showLoading}
      privateStream={true}
      placeholder={currentPrompt()}
      itemNounName={'Post'}
      showToolTip={false}
      onSave={onSave}
      onSuccess={onSuccess}
    />
  );
};

export const currentPrompt = () => {
  return PROMPTS[new Date().getTime() % PROMPTS.length];
};
