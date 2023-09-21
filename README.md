# My Blockchain Learnings

## What is Blockchain?

- Blockchain is like a shared database or a ledger that stores transactions. It's a network of computers/servers/nodes working together, making it descentralized.
- Security and decentrality is the core of blockchain. The purpose of blockchain is to maintain anonimity of a user and keep the transactions publically so no frauds could occur.

## Blockchain Structure

- Blockchain is made of blocks which are chained together. Blockchain is a peer-to-peer network.
- Block contains 3 things 1. Hash of previous block 2. Data of the block 3. Hash of itself
- The first block of any Blockchain is called Genesis Block.
- A node is a person running an advance computer that solves the puzzle of cryptography to add the block to the chain.

## What is Consensus?

- Consesus is a method for coming to agreement over a shared state. It is way by which the network of nodes stay in sync with each other.
- There are many ways for Consensus mechanism of Blockchain but here there will be the two most used:- `Proof of Work` and `Proof of Stake`

## Proof of Work

- In this, the nodes compete against each other to solve the complex puzzle of cryptograph which on gets the chance to validate the data by checking the copy of other nodes in the network and on success leads to adding of block and on faliure removal of the block.
- It is costly yet secure way of adding a trusted block to the chain. The cost of adding a block is incentivised by paying some block reward to the node.

## Proof of Stake

- In this, the nodes try to compete by staking some digital currency, the node is randomly chosen and the who wins gets the chance to validate the block & gets the reward.
- Unlike in POW, where miners are are incentivise by block rewards and in POS miners get transaction fees.

## Layers of Blockchain

- `Layer-1` : Layer 1 is the basic fundamental network of blockchain. This layer is the foundation of blockchain based on which the transaction occurs. It is the public ledger. Example :- Ethereum, Bitcoin.
- `Layer-2` : Layer 2 is build on the Layer 1. It is the more advance, easy to use and lightweight version of the Layer 1. It is build to do more advance stuff. Example :- Polygon, Solana.

## Asymetric Cryptography

- An account contains two keys Public key and Private key. When a tranction occur between two parties (1 Person - A and 2 Person - B), the transaction is signed by the private key of A and send it to B then B tries to decode it by the public key of A. 

## Details about Transaction

- 

## Building my first Smart Contract on Remix

## Setting up Blockchain ENV locally and learning Ethers.js

## Setting up Hardhat locally and deploying it to sepolia network
