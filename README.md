# weifund-contracts
A repository for the WeiFund Ethereum smart-contracts.

## Install
```
npm install weifund-contracts
```

## About
WeiFund has a series of smart-contracts we use to power our crowdfunding platform.

## Critical Contracts
WeiFund is build on multiple interconnected smart-contracts. The main peices are: the core (which contains all crowdfunding logic and extensible hooks), the token dispersal controller (which contains all the token dispersal logic), and the campaign account (a contribution endpoint for the campaign).

### The Core
`WeiFund.sol` --- This is our core crowdfunding contract that contains all the core crowdfunding logic and extensible hooks.

#### Contract Interface:
```
contract WeiFundInterface {
  function newCampaign(string _name, address _beneficiary, uint _fundingGoal, uint _expiry, address _config) returns (uint campaignID) {}
  function contribute(uint _campaignID, address _beneficiary) returns (uint _contributionID) {}
  function refund(uint _campaignID, uint _contribution) {}
  function payout(uint _campaignID) {}
  function operatorCampaignID(address _operator, uint _campaignIndex) constant returns (uint campaignID) {}
  function totalCampaignsBy(address _operator) constant returns (uint numCampaigns) {}
  function totalContributionsBy(uint _campaignID, address _contributor) constant returns (uint) {}
  function totalCampaigns() constant returns (uint numCampaigns) {}
  function contributionAt(uint _campaignID, uint _contributionID) constant returns (address contributor,
                                                                                          address beneficiary,
                                                                                          uint amountContributed,
                                                                                          bool refunded,
                                                                                          uint created) {}
  function createdAt(uint _campaignID) public constant returns (uint) {}
  function contributionID(uint _campaignID, address _contributor, uint _contributionIndex) constant returns (uint) {}
  function ownerOf(uint _campaignID) constant returns (address) {}
  function beneficiaryOf(uint _campaignID) constant returns (address) {}
  function configOf(uint _campaignID) constant returns (address) {}
  function amountRaisedBy(uint _campaignID) constant returns (uint) {}
  function fundingGoalOf(uint _campaignID) constant returns (uint) {}
  function expiryOf(uint _campaignID) constant returns (uint) {}
  function totalContributors(uint _campaignID) constant returns (uint) {}
  function isContributor(uint _campaignID, address _contributor) constant returns (bool) {}
  function isOwner(uint _campaignID, address _owner) constant returns (bool) {}
  function hasFailed(uint _campaignID) constant returns (bool) {}
  function isSuccess(uint _campaignID) constant returns (bool) {}
  function isPaidOut(uint _campaignID) constant returns (bool) {}
  function totalRefunded(uint _campaignID) constant returns (uint) {}
  function isRefunded(uint _campaignID) constant returns (bool) {}

  event CampaignCreated(uint indexed _campaignID, address indexed _owner);
  event Contributed(uint indexed _campaignID, address indexed _contributor, uint _amountContributed);
  event Refunded(uint indexed _campaignID, address indexed _contributor, uint _amountRefunded);
  event PaidOut(uint indexed _campaignID, address indexed _beneficiary, uint _amountPaid);
}
```

### WeiFund Campaign Hook Configuration
`WeiFundConfig.sol` --- This is the main campaign config contract that provides outward facing hooks to connect WeiFund campaigns to things like token dispersal controllers.

#### Contract Interface:
```
contract WeiFundConfig {
  function newCampaign(uint _campaignID, address _owner, uint _fundingGoal) {}
  function contribute(uint _campaignID, address _contributor, address _beneficiary, uint _amountContributed) {}
  function refund(uint _campaignID, address _contributor, uint _amountRefunded) {}
  function payout(uint _campaignID, uint _amountPaid) {}
}
```

### Token Dispersal Controller (WeiController)
`WeiController.sol` --- This contains all the core token dispersal logic for a single campaign. Tokens are issued to the controller to be dispersed to crowdfund contributors.

The token dispersal controller allows for "auto" token dispersal (which automatically sends tokens to campaign contributors), and "claim" token dispersal (which allows campaign contributors to claim their tokens once the campaign has completed).

#### Contract Interface:
```
contract WeiController is WeiFundConfig {
  function WeiController (address _weifund, address _owner, address _token, uint _tokenValue, bool _autoDisperse) {}
  function newCampaign(uint _campaignID, address _owner, uint _fundingGoal) isWeiFund {}
  function contribute(uint _campaignID, address _contributor, address _beneficiary, uint _amountContributed) isWeiFund validCampaign(_campaignID) {}
  function claimTokens() {}
  function refund(uint _campaignID, address _contributor, uint _amountRefunded) isWeiFund validCampaign(_campaignID) {}
  function payout(uint _campaignID, uint _amountPaid) isWeiFund validCampaign(_campaignID)  {}
}
```

### CampaignAccount
`CampaignAccount.sol` --- This is a contribution endpoint for the campaign, that merely forwards transactions through the core WeiFund contract (and potentially into a token dispersal controller). This contract is mainly to utilize solidities fallback method, and redirect funds from a single address to a campaign hosted on the WeiFund core contract.

#### Contract Interface:
```
contract CampaignAccount {
  function CampaignAccount (address _weifund, uint _campaignID) {}
  function () {}
  function amountContributed(address _contributor) public constant returns (uint) {}
}
```

## Feature Contracts
WeiFund has a set of external feature contracts that enable campaigns with certain features like IPFS integration, multi-beneficiaries and prediction market evaluation.

 1. `WeiHash` -- ipfs hash registry for weifund campaigns
 2. `MultiService` -- multi-beneficiaries contract
 3. `StaffPicks` -- a simple staff picks contract
 4. `WeiFundTokenFactory` -- an opinionated token factory for creating tokens for Weifund token dispersal controllers
 5. `CampaignRegistry` -- a registry for third-party crowdfunding campaigns

 ### CampaignRegistry
 `CampaignRegistry.sol` ---  This allows WeiFund campaign operators to register their third-party crowdfund with the WeiFund platform.

 #### Contract Interface:
 ```
 contract CampaignRegistry {
   function register(address campaignAddress, bytes ipfsHash) returns (uint _campaignID) {}
   event CampaignRegistered(address _campaignAddress, uint _campaignID);
 }
 ```

## Future Designs
The future design of the WeiFund contracts is to have WeiFund as a verified registry of crowdfunding campaigns. Where campaigns can be produced by anyone on any contract, and the verification of these campaigns is done by and through the WeiFund platform. This means that we will have a registry of valid campaign factories that we trust to disperse and reward crowdfunding beneficiaries and contributors with the correct amounts of ether and digital assets.

This means the future designs will make WeiFund into a skinned campaign registry and factory mechanism. Virtually making token dispersal and crowdfunding into menial tasks both contractually and by investor experience.

## Prediction Market Integration
We believe a critical aspect of determining campaign success will be to use prediction markets to field if the campaign is a good idea or not (one that will success or surpass it's goals). These mechanisms will not only help campaigns field if their idea is good or bad, but also reward those who believed in the camapign from the first place (or those who rightfully believed it was not a good idea).
