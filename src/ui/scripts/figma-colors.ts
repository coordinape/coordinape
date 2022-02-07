import dotenv from 'dotenv';
import * as Figma from 'figma-api';
dotenv.config();

// const FILL = 'FILL';

// const getStylesFromFile = (data: any) => {
//   const { styles } = data;
//   return Object.entries(styles)
//     .filter(([, entry ]) => { const { styleType } = entry; return styleType === FILL; })
//     .map(([id, { name }]) => ({ name, id }));
// };
// this file is the Ape App 1.5
const COORDINAPE_FIGMA_FILE_KEY = 'L4oZwYVUdpgacZtwipGaYe';
async function main() {
  const api = new Figma.Api({
    personalAccessToken: process.env.FIGMA_ACCESS_TOKEN || 'token',
  });

  // const { meta } = await api.getFileStyles(COORDINAPE_FIGMA_FILE_KEY);
  // // eslint-disable-next-line no-console
  // //const style = meta?.styles.filter(item => item.style_type === FILL)[0];

  const file = await api.getFile(COORDINAPE_FIGMA_FILE_KEY);

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(file));
}

(async function () {
  await main()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
})();
