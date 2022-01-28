import { build } from 'esbuild';
import { execaNode } from 'execa';
import tmp from 'tmp';

tmp.setGracefulCleanup();
const { name: tmpFile } = tmp.fileSync({
  postfix: '.mjs',
  tmpdir: process.cwd(),
});
//
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

  try {
    console.log(`» esbuild ${filePath}`);

    const plugins = [];
    plugins.push({
      name: 'make-all-packages-external',
      setup: build => {
        const filter = /^[^./~$@]|^@[^/]/; // Must not start with "/", ".", "~", "$" or "@/"
        build.onResolve({ filter }, args => {
          return {
            path: args.path,
            external: true,
          };
        });
      },
    });

    await build({
      entryPoints: [filePath],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: tmpFile,
      plugins,
      tsconfig: CUSTOM_TSCONFIG_FILE,
    });
    console.log(`» node ${tmpFile}`);
    const result = await execaNode(tmpFile);
    console.info(result.stdout);
    process.exit(result.exitCode);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
