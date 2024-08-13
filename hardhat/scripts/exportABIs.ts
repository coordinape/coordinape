import fs from 'fs';
import path from 'path';

// List of contracts to export ABIs from
const CONTRACTS_TO_EXPORT = ['CoLinks', 'CoSoul'];

const rootDir = path.join(__dirname, '..');
const artifactsDir = path.join(
  rootDir,
  'artifacts/contracts/coordinape-protocol/contracts'
);

const abiDir = path.join(__dirname, '../../contracts/abis');

// Ensure the ABI directory exists
if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

CONTRACTS_TO_EXPORT.forEach(contractName => {
  const jsonPath = path.join(
    artifactsDir,
    contractName.toLowerCase(),
    `${contractName}.sol`,
    `${contractName}.json`
  );

  if (!fs.existsSync(jsonPath)) {
    console.warn(
      `Warning: JSON file not found for contract ${contractName} at path ${jsonPath}`
    );
    return;
  }

  const artifact = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // Extract ABI
  const abi = artifact.abi;

  // Save ABI as a separate file
  const abiPath = path.join(abiDir, `${contractName}ABI.ts`);
  fs.writeFileSync(
    abiPath,
    `export const ${contractName}ABI = ${JSON.stringify(
      abi,
      null,
      2
    )} as const;`
  );

  console.log(`Exported ABI for ${contractName}`);
});

// Generate index file
const indexPath = path.join(abiDir, 'index.ts');
const exportStatements = fs
  .readdirSync(abiDir)
  .filter(file => file.endsWith('ABI.ts'))
  .map(file => {
    const name = path.parse(file).name;
    return `export { ${name} } from './${name}';`;
  });

fs.writeFileSync(indexPath, exportStatements.join('\n'));

console.log('ABIs exported successfully!');
