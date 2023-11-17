import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';

const PROMPTS = [
  'What’s a challenge you faced?',
  'What’s an excitement you’re noticing?',
  'What’s a skill you’re learning?',
  'What’s a success you’ve had?',
  'What are you working on today?',
  'What’s a cool tool that you’ve been loving?',
  'What is something you did today you are proud of?',
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
      placeholder={
        // use current mintute module PROMPTS.length to choose which prompt to use
        PROMPTS[new Date().getMinutes() % PROMPTS.length]
      }
      itemNounName={'Post'}
      showToolTip={false}
      onSave={onSave}
      onSuccess={onSuccess}
    />
  );
};
