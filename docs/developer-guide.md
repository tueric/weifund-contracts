# Developer Guide

All information regarding contributing to and progressing weifund-contracts module can be found in this document.

## Install
```
npm install --save weifund-contracts
```

## Install from Source

```
git clone http://github.com/weifund/weifund-contracts
npm install
```

## Build

This will create a browserified es2015 build of the module to `dist/weifund-contracts.js`;

```
npm run build
```

## Test
```
npm test
```

## Folder Structure

All module source code is found in the `src` directory. All module helper scripts can be found in the `scripts` folder. These will not need to be touched, and are purely configuration for this repository.

```
./weifund-contracts
  ./.github
  ./docs
  ./assets
  ./dist
  ./internals
    ./scripts
    ./ethdeploy
  ./src
    ./.dapple
    ./contracts
    ./lib
    ./tests
```

## Browserify

The `weifund-contracts` module is fully browserifiable. Simple run `npm run build` to browserify the module, then check `dist/weifund-contracts.js` for the final build.

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard. Please read more about contributing to `weifund-contracts` in the `CONTRIBUTING.md`.

## Campaign Interface

All WeiFund registered campaigns must follow the `Campaign.sol` interface. If a crowdsale does not follow this interface, you can subsequently register an interface contract, which will interpret the campaign contract data into the `Campaign.sol` interface structure.

The Campaign.sol interface is as follows:

```
pragma solidity ^0.4.3;


contract Campaign {
  /// @notice the owner or campaign operator of the campaign
  /// @return the Ethereum standard account address of the owner specified
  function owner() constant public returns(address) {}

  /// @notice the campaign interface version
  /// @return the version metadata
  function version() constant public returns(string) {}

  /// @notice the campaign name
  /// @return contractual metadata which specifies the campaign name as a string
  function name() constant public returns(string) {}

  /// @notice use to determine the contribution method abi/structure
  /// @return will return a string that is the exact contributeMethodABI
  function contributeMethodABI() constant public returns(string) {}

  /// @notice use to determine the contribution method abi
  /// @return will return a string that is the exact contributeMethodABI
  function refundMethodABI() constant public returns(string) {}

  /// @notice use to determine the contribution method abi
  /// @return will return a string that is the exact contributeMethodABI
  function payoutMethodABI() constant public returns(string) {}

  /// @notice use to determine the beneficiary destination for the campaign
  /// @return the beneficiary address that will receive the campaign payout
  function beneficiary() constant public returns(address) {}

  /// @notice the time at which the campaign fails or succeeds
  /// @return the uint unix timestamp at which time the campaign expires
  function expiry() constant public returns(uint256 timestamp) {}

  /// @notice the goal the campaign must reach in order for it to succeed
  /// @return the campaign funding goal specified in wei as a uint256
  function fundingGoal() constant returns(uint256 amount) {}

  /// @notice the goal the campaign must reach in order for it to succeed
  /// @return the campaign funding goal specified in wei as a uint256
  function amountRaised() constant public returns(uint256 amount) {}

  // Campaign events
  event ContributionMade (address _contributor);
  event RefundPayoutClaimed(address _payoutDestination, uint256 _payoutAmount);
  event BeneficiaryPayoutClaimed (address _payoutDestination, uint256 _payoutAmount);
}
```

See the `Campaign.sol` contract here: [Campaign.sol](../../../blob/master/src/contracts/Campaign.sol)

## StandardCampaign Philosophy

<img src="../assets/weifund-contract-diagram.jpg" />

The WeiFund crowdfunding contract design philosophy asserts that funds for crowdsales should be moved through secure contracts that do not change often, and are constantly overviewed and tested.

All third-party modules that operate activities such as token issuance or membership issuance, should be constructued in outside claim contracts that cannot alter or modify the campaign contract design.

This way, all funds from the time they leave the contributor account to when they either enter the beneficiary or are returned to the contributer are handled in contracts that are secure.

The StandardCampaign contract can be found here: [StandardCampaign.sol](../../../blob/master/src/contracts/StandardCampaign.sol)

## BalanceClaim Mechanism

For further re-entrancy prevention, the WeiFund StandardCampaign contract will not send ether directly to a third-party account. All refunds to third-party contributors are sent to a newly created BalanceClaim contract, where the refund claimant can receive the funds by calling `claimBalance()`.

```
pragma solidity ^0.4.3;


contract BalanceClaimInterface {
  /// @notice use `claimBalance` to selfdestruct this contract and claim all balance to the owner address
  function claimBalance();
}
```

The BalanceClaim contract can be found here: [BalanceClaim.sol](../../../blob/master/src/contracts/BalanceClaim.sol)

## Contract Deployment

All essential WeiFund factory and registry contracts can be deployed easily by running the ethdeploy scripts, found in the [ethdeploy](../../../blob/master/internals/ethdeploy/).

You must have an `account.json` file directly outside this repo, with your account `{"address": "0x00..", "privateKey": "000..."}` specified.

```
npm run deploy:testnet
```

This will generate or modify an [`environments.json`](../../../blob/master/src/lib/environments.json) file.

** Currently, the WeiFund `testnet` contract addresses are being manually asserted by hand in the `index.js` module.

## Registry Contracts

<img src="../assets/weifund-registry-diagram.jpg" />

WeiFund uses several registries which are open simple modules. The registry contracts are:

  1. [CampaignDataRegistry.sol](../../../blob/master/src/contracts/CampaignDataRegistry.sol) - Storing IPFS Hashes against registered campaigns
  2. [CurationRegistry.sol](../../../blob/master/src/contracts/CurationRegistry.sol) - Allows anyone to curate any campaign list
  3. [CampaignRegistry.sol](../../../blob/master/src/contracts/CampaignRegistry.sol) - Registering campaigns in the main registry

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 weifund. For more information see LICENSE.
