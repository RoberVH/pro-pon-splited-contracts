# Split-Contracts-Propon

## About The Project

Split-Contracts-Propon is created to split into Data and Logic contracts the former Pro-pon App contract [smartcontract-propon](https://github.com/RoberVH/smartcontract-propon) 

The objectives of this restructuring are:

- Save space in Logic contract as validations are getting bigger.
- Detach logic from data so future versions can be made easily.
- Provide a historical reference for data that survives Logic changes.

The contract stores validated Data from Companies and the RFPs/Licitations they post to blockchain (Polygon and Arweave), its metaData and Files to coordinate issuing contests and receiving answers from bidders.
The companion Web App to access this contract is Pro-pon D'app [pro-pon-nextjs](https://github.com/RoberVH/pro-pon-nextjs)

### Built With

The contract is created on Solidity for Polygon Blockchain and Arweave Blockchain. It uses HardHat for compilation, testing and deployment with Javascript and ethers.

## Version

2

## Authors

- Roberto Vicuna

## Created

May 24, 2023

## Notice

This project is created to split into Data and Logic contracts the former Pro-pon App contract.
