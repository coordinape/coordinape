// import React from 'react';

import type { VercelRequest, VercelResponse } from '@vercel/node';

// import { ImageResponse } from '@vercel/og';
import { getBigQuestionInfo } from '../getBigQuestionInfo.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('URL!', req.url);
    let urlPath = req.url as string;
    if (!urlPath.startsWith('http')) {
      urlPath = `https://www.bigquestions.app${urlPath}`;
    }
    const originalUrl = new URL(urlPath);

    console.log(
      'originalUrl',
      originalUrl,
      urlPath,
      urlPath,
      originalUrl.pathname
    );
    const parts = originalUrl.pathname.split('/');
    const id = parts[parts.length - 1] ?? 'IDK';

    console.log('id', id, 'parts', parts);

    const bq = await getBigQuestionInfo(id);

    if (!bq) {
      return res.status(404).send({
        message: 'big question not found',
      });
    }

    return res.status(404).send({
      message: 'derp',
    });
    // const ir = new ImageResponse(
    //   (
    //     <div
    //       style={{
    //         backgroundRepeat: 'no-repeat',
    //         backgroundPosition: `${bq.css_background_position ?? 'center'}`,
    //         backgroundSize: 'cover',
    //         backgroundImage: `url('${bq.cover_image_url}')`,
    //         height: '100%',
    //         width: '100%',
    //         display: 'flex',
    //         alignItems: 'flex-start',
    //         justifyContent: 'flex-end',
    //         flexDirection: 'column',
    //         flexWrap: 'nowrap',
    //         padding: '72px 32px',
    //       }}
    //     >
    //       <div
    //         style={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'flex-start',
    //         }}
    //       >
    //         <div
    //           style={{
    //             fontSize: '32px',
    //             alignItems: 'flex-start',
    //             color: '#ffffffee',
    //             fontStyle: 'italic',
    //             background: 'rgba(0,0,0,0.8)',
    //             paddingLeft: 8,
    //             paddingRight: 8,
    //             width: 'auto',
    //             display: 'flex',
    //           }}
    //         >
    //           The Big Question
    //         </div>
    //         <div
    //           style={{
    //             display: 'flex',
    //             alignItems: 'flex-start',
    //             textAlign: 'left',
    //             fontWeight: 'bold',
    //             fontSize: '72px',
    //             color: 'white',
    //             width: '100%',
    //             textShadow: 'rgb(0 0 0 / 64%) 1px 1px 8px',
    //           }}
    //         >
    //           {bq.prompt}
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   {
    //     width: 1200,
    //     height: 630,
    //   }
    // );
    // const ab = await ir.arrayBuffer();
    // const buf = Buffer.from(ab);
    // res.setHeader('Content-Type', 'image/png');
    // return res.send(buf);
    // return res.send('WHATUP');
  } catch (e: any) {
    console.error(`ERROR ${e.message}`);
    return res.status(500).send(`Failed to generate the image`);
  } finally {
    console.error('FINALMENTE!');
  }
}
