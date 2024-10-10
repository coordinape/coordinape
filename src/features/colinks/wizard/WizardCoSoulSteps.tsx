import { useEffect } from 'react';

import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { useToast } from 'hooks';

import { WizardCoSoul } from './WizardCoSoul';
import { WizardName } from './WizardName';
import { WizardProgress } from './WizardProgress';

export const fullScreenStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: '-1',
  height: '100vh',
  width: '100vw',
  p: '$lg',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  aspectRatio: '1/1',
  backgroundSize: 'cover',
  '@media (min-aspect-ratio: 10.7/5)': {
    backgroundSize: 'contain',
  },
};

export const WizardCoSoulSteps = ({
  progress,
}: {
  progress: WizardProgress;
  repScore: number | undefined;
}) => {
  const { hasName } = progress;

  const { showError } = useToast();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect');

  // Show the error and remove it from the URL
  // this error comes from the twitter/github/linkedin callbacks
  useEffect(() => {
    if (error) {
      showError(error);
      setSearchParams('');
    }
  }, [error]);

  useEffect(() => {
    if (redirect) {
      navigate(redirect, {
        replace: true,
      });
    }
  }, [redirect]);

  if (!hasName) {
    return <WizardName />;
  } else {
    return <WizardCoSoul />;
  }
};
