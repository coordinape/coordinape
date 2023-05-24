/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulArt } from './art/CoSoulArt';
import { CoSoulArtContainer } from './CoSoulArtContainer';
import { CoSoulComposition } from './CoSoulComposition';
import { CoSoulDetails } from './CoSoulDetails';
export const ViewPage = () => {
  const { address } = useParams();

  const [cosoulDataError, setCosoulDataError] = useState<string | undefined>();
  const [cosoulData, setCosoulData] = useState<CosoulData | undefined>();

  useEffect(() => {
    try {
      fetch('/api/cosoul/' + address).then(res => {
        if (!res.ok) {
          setCosoulDataError(
            "Error fetching cosoul data, cosoul for this address doesn't exist"
          );
          return;
        }
        res.json().then((data: CosoulData) => {
          setCosoulData(data);
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        setCosoulDataError(e.message ?? 'unknown error');
      } else {
        setCosoulDataError('Invalid address or network error');
      }
    }
  }, []);

  useEffect(() => {
    if (cosoulData) {
      console.log({ cosoulData });
    }
  }, [cosoulData]);

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }

  // Waiting to validate the token
  if (!cosoulDataError && !cosoulData) {
    return <LoadingModal visible={true} note="cosoul-lookup" />;
  }

  return (
    <>
      {cosoulData && (
        <SingleColumnLayout
          css={{
            m: 'auto',
            alignItems: 'center',
            gap: '$1xl',
            maxWidth: '1200px',
          }}
        >
          <CoSoulComposition cosoul_data={cosoulData}>
            <CoSoulArtContainer>
              <CoSoulArt pGive={cosoulData.totalPgive} address={address} />
            </CoSoulArtContainer>
          </CoSoulComposition>
          <CoSoulDetails cosoul_data={cosoulData} />
        </SingleColumnLayout>
      )}
    </>
  );
};
