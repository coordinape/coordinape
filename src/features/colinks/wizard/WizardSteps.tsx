import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../auth';
import { useToast } from 'hooks';

import { WizardBuyOtherLinks } from './WizardBuyOtherLinks';
import { WizardComplete } from './WizardComplete';
import { WizardCoSoul } from './WizardCoSoul';
import { WizardName } from './WizardName';
import { WizardOwnLink } from './WizardOwnLink';
import { WizardProgress } from './WizardProgress';
import { WizardRep } from './WizardRep';
import { WizardSwitchToOptimism } from './WizardSwitchToOptimism';
import { WizardTerms } from './WizardTerms';

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

export const WizardSteps = ({
  progress,
  repScore,
}: {
  progress: WizardProgress;
  repScore: number | undefined;
}) => {
  const {
    // address,
    onCorrectChain,
    hasName,
    // hasRep,
    hasCoSoul,
    hasOwnKey,
    // hasOtherKey,
  } = progress;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showStepRep, setShowStepRep] = useState(true);
  const [showStepBuyOther, setShowStepBuyOther] = useState(true);

  const [showStepCoSoul, setShowStepCoSoul] = useState(true);
  const { showError } = useToast();

  const profileId = useAuthStore(state => state.profileId);

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

  if (onCorrectChain && redirect) {
    navigate(redirect, {
      replace: true,
    });
    return null;
  }

  if (!onCorrectChain) {
    return <WizardSwitchToOptimism />;
  } else if (!hasName) {
    return <WizardName />;
  } else if (profileId && !termsAccepted) {
    return <WizardTerms setTermsAccepted={setTermsAccepted} />;
  } else if (!hasCoSoul && showStepCoSoul) {
    return <WizardCoSoul setShowStepCoSoul={setShowStepCoSoul} />;
  } else if (!hasOwnKey) {
    return <WizardOwnLink address={progress.address} />;
  } else if (showStepRep) {
    return (
      <WizardRep repScore={repScore} skipStep={() => setShowStepRep(false)} />
    );
  } else if (showStepBuyOther) {
    return (
      <WizardBuyOtherLinks
        skipStep={() => setShowStepBuyOther(false)}
        address={progress.address}
      />
    );
  } else {
    return <WizardComplete />;
  }
};
