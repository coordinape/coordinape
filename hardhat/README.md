# Getting started

See [the top-level README](../README.md#hardhat).

# Contract Deployments and Verification

Deployments use mnemonics in the env vars to deploy from. It expects a mnemonic to be used for the deployer account to be available in your environment. You can run `source ~/.env` if running inside the hardhat/ dir since that doesn't auto source .env

For verifying contracts, we use https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify

It requires both the contract address and the constructor arguments that were used to deploy it.

## Deploy

First, deploy the contracts and collect the deploy output which includes required args for verifying the SoulProxy, for example:

`❯ yarn deploy:optimismgoerli`

```
❯ yarn deploy:optimismgoerli
yarn run v1.22.19
$ hardhat deploy --network optimismGoerli
Nothing to compile
No need to generate any newer typings.
reusing "CoSoul" at 0xb5Cbf625ee6b7f034E242372886621d59c6D8017
reusing "SoulProxy" at 0xea6CE4a91Aa21988467165b85c40AB459553bB64
deployed SoulProxy at:  0xea6CE4a91Aa21988467165b85c40AB459553bB64 with args: 0xb5Cbf625ee6b7f034E242372886621d59c6D8017 0x2402ef3b1498fa666CB7a9BA1b63EEC97599cCA3 0x077f224a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e757e0397e699589bfbf8dc90b2baa210b80b06b0000000000000000000000000000000000000000000000000000000000000006436f536f756c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004736f756c00000000000000000000000000000000000000000000000000000000
cosoul.setCallers set to 0x71048302A16E645acAE6CdB2cb41773daeE1729c via tx:  0xc91b19d7f81c71d58d71f3489aded38061acd7635c60bf97d47edaaef546efd0
cosoul.setBaseURI set to https://api.coordinape.com/nft/ via tx:  0x312f85f018bf467e74d3f27266841b236bd7eab3811188ea59301fcc9cfd3dd9
✨  Done in 22.05s.
```

## Verification

To verify the contract on Etherscan, run the verify task with the proper arguments

## Verify CoSoul using deployed address

❯ yarn verify:optimismgoerli 0xb5Cbf625ee6b7f034E242372886621d59c6D8017

## Verify SoulProxy using deployed address and arguments

❯ yarn verify:optimismgoerli 0xea6CE4a91Aa21988467165b85c40AB459553bB64 --contract contracts/coordinape-protocol/contracts/cosoul/SoulProxy.sol:SoulProxy 0xb5Cbf625ee6b7f034E242372886621d59c6D8017 0x2402ef3b1498fa666CB7a9BA1b63EEC97599cCA3 0x077f224a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e757e0397e699589bfbf8dc90b2baa210b80b06b0000000000000000000000000000000000000000000000000000000000000006436f536f756c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004736f756c00000000000000000000000000000000000000000000000000000000
