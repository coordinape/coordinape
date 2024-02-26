/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, ChangeEvent } from 'react';

import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options,
} from 'qr-code-styling';

import CopyCodeTextField from 'components/CopyCodeTextField';
import { webAppURL } from 'config/webAppURL';
import { coLinksPaths } from 'routes/paths';
import { Flex, Text } from 'ui';

export const QRCode = ({ token }: { token: string }) => {
  const authUrl = webAppURL('colinks') + coLinksPaths.authenticate(token);
  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: authUrl,
    image: 'imgs/logo/colinks-mark-grey8.png',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'H' as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      // color: '#222222',
      gradient: {
        type: 'linear', // 'radial'
        rotation: 1,
        colorStops: [
          { offset: 0, color: '#6c47d7' },
          { offset: 1, color: '#0e9f6e' },
        ],
      },
      type: 'extra-rounded' as DotType,
    },
    backgroundOptions: {
      // color: '#5FD4F3',
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [
      //     { offset: 0, color: '#ededff' },
      //     { offset: 1, color: '#e6e7ff' },
      //   ],
      // },
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'dot' as CornerSquareType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot' as CornerDotType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
      // },
    },
  });
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  return (
    <Flex column css={{ gap: '$md', flexBasis: '$lg' }}>
      <Flex css={{ justifyContent: 'center' }}>
        <div ref={ref} />
      </Flex>
      <Flex column css={{ justifyContent: 'center', gap: '$sm' }}>
        <Text css={{ justifyContent: 'center' }} variant={'label'}>
          Or use this one-time link
        </Text>
        <CopyCodeTextField value={authUrl} />
      </Flex>
    </Flex>
  );
};
