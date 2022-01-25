import { Runner } from '@digitak/esrun';

// Compile and run a ts script.
// We like our esnext, so this file was needed to
// set a custom tsconfig, CUSTOM_TSCONFIG_FILE.
//
// https://github.com/digital-loukoum/esrun/issues/10

const { argv } = process;
const FILE_ARG_IDX = 2;
const CUSTOM_TSCONFIG_FILE = 'tsconfig.esrun.json';

async function run() {
  const filePath = argv[FILE_ARG_IDX];

  const runner = new Runner(filePath, {
    args: argv.slice(FILE_ARG_IDX + 1),
  });

  try {
    console.log(`» esbuild ${filePath}`);
    await runner.build({
      tsconfig: CUSTOM_TSCONFIG_FILE,
    });

    console.log(
      `» node --input-type=module --eval ${runner.outputCode
        .substring(0, 50)
        .replace('\n', ' ')}…`
    );
    const status = await runner.execute();
    process.exit(status);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

(async function () {
  await run();
})();
