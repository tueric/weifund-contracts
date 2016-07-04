## Synopsis
The WeiFund Ethereum Solidity smart-contracts.

## Installation

### NodeJS
```
npm install --save weifund-contracts
```

### Browserify
```
npm run browserify
```

## Testing
```
npm test
```

## Contract Design
There are two supported WeiFund campaign contract designs: a `StandardCampaign` (for conventional crowdfunding) and a `StandardTokenCampaign` (for crowdfunding with token dispersal). There are three general contract factory designs: a `StandardCampaignFactory`, `StandardTokenCampaignFactory`, and a  `DispersalCalculatorFactory` (for creating dispersal calculators that determine how much token a contributor should receive given the value contributed).

### (Standard)Campaign API
```
contract Campaign {
  function contributeMsgValue() public returns (bool contributionMade);
  function payoutToBeneficiary() public returns (address claimProxyAddress);
  function claimRefundOwed() public returns (address claimProxyAddress);

  function numContributors() constant public returns (uint);
  function expiry() constant returns (uint);
  function created() constant returns (uint);
  function amountRaised() constant returns (uint);
  function fundingGoal() constant returns (uint);
  function paidOut() constant returns (bool);
  function beneficiary() constant returns (address);
  function contributors(uint) constant returns (address);
  function contributions(address) constant returns (uint);
  function contributorMadeClaim(address) constant returns (bool);
}
```

### Standard Token Campaign API
```
contract StandardTokenCampaign is Campaign {
  function claimTokensOwed() public returns (uint tokenAmountClaimed);
  function token() public returns (address);
  function dispersal() public returns (address);
}
```

### Dispersal Calculator API
```
contract DispersalCalculator {
  function amount(uint _contributionValue, uint _contributionCreated) constant returns (uint dispersalAmount);
}
```

### Claim Proxy API
```
contract ClaimProxy {
  function claimBalance();
}
```

## Campaign Contract Deployment Staging
### Standard Campaign
1. Deploy a `StandardCampaign` contract

###Standard Token Campaign
 1. Deploy `StandardToken`
 2. Deploy `DispersalCalculator`
 3. Deploy `StandardTokenCampaign`
 4. `transfer` tokens to the campaign contract

## Custom Token Dispersal Algorithms
Many campaigns will want a custom token dispersal algorithm. This can be accomplished by creating your own DispersalCalculator contract and using it for your campaigns. However, this does present many different attack vectors for contributors. See the `Known Attack Vectors, Pitfalls and Solutions` section for more details. WeiFund hopes to present a variety of DispersalCalculator algorithms to meet design demand for most token crowdsales on Ethereum.

## Campaign Success
WeiFund campaigns generally defines campaign success as: campaign `X` reaching funding goal `Y` before expiry `Z`. However, some campaigns may choose to do an open crowdsale, where a campaign defines an expiry for token claims but no funding goal.

## Options for Token Campaign Contributors
Campaign contributors can either claim their token reward (if the campaign is a success) or, in the event of campaign failure, reclaim their contribution amount. The process for these options is as follows:

### Under A Campaign Success
 1. Contributor `C` sends ether to campaign `A` (by calling `contributeMsgValue`)
 2. Campaign `A` reaches its funding goal before `A`'s expiry
 3. Contributor `C` now claims their owed tokens from `A`  (by calling  `claimTokensOwed`) and can no longer claim any refund (as no refunds are owed)

### Under A Campaign Failure
 1. Contributor `C` sends ether to campaign `B` (by calling `contributeMsgValue`)
 2. Campaign `B` does not reach its funding goal by the alloted time, campaign `B` expires
 3. Contributor `C` creates `ClaimProxy` refund for their contribution to campaign `B` (by calling `claimRefundOwed`)
 4. Contributor `C` retrieves address of `ClaimProxy` refund contract
 5. Contributor `C` retrieves contributed funds to campaign `B` (by calling `claimBalance`)

## Known Attack Vectors, Pitfalls and Solutions
### Pitfall: Fallback Function Gas Limitations
While WeiFund campaigns do not force campaigns to use contract fallback functions, campaigns do support the use of fallback functions. The issue is that simply sending ether to these contracts from wallets or contracts may not work due to gas limits. To address this, WeiFund will inform all contributors that using wallets to donate to campaigns requires them to gas up their transactions. Not doing so, may result in contribution failure.

### Attack Vector: Re-Entrancy
WeiFund standard and standard token campaign contracts handle all critical state changes before sending any `ether` to beneficiaries or contributors. WeiFund also uses a `ClaimProxy` contract to further distance itself from re-entrancy. This can be explained as follows: instead of sending funds to the beneficiary or a contributor (as a refund), WeiFund creates a Claim contract that only the intended fund recipient can acquire funds from. In doing so, WeiFund campaigns do not send any funds directly to potentially suspect accounts or contracts. You can think of this like each campaign creating contractual lock-box's that only the intended recipients can open. This way, campaign payout or refund calls only interact with accounts and contracts it has created, and not accounts that are potentially suspect.

### Attack Vector: Non-Standard Dispersal Calculator Mechanisms
If a project uses a non-standard dispersal mechanism, this may present potential attack vectors as non-vetted code can interact with the main campaign mechanisms. Dispersal calculation is done at the time of contribution, to prevent calculation spoofing (calculating a different amount from the initial calculation).

## Attack Vector: Not enough tokens to disperse
A token campaign may not have enough token balance to disperse to contributors in order for the campaign to succeed. Enough tokens must be issued to the campaign before hand, in order to ensure contributors can claim the tokens received. Campaign contributions are halted if, given the dispersal calculation, there are not enough tokens to disperse to contributors (`campaign token balance` >= (`total tokens to be dispersed` + `tokens to be dispersed to contributor`)).

## Attack Vector: Malicious (non-standard) Token Contracts
Using custom or non-standard token contracts that follow the `StandardToken` API, may present several attack vectors on campaign contracts that disperse such tokens. In order to prevent this, we must ensure that tokens are created by verifiable token factories and that the  token code is vetted before starting and contributing to campaigns.

## Attack Vector: Unforeseen Contract or Compiler Bugs
It may be the case that campaigns are created with contract or compiler bugs we simply do not know about currently. In order to limit the damage of such bugs, we must inform contributors and projects of the risks of using these contracts, and attempt to enforce (either by community engagement or the UI) reasonable campaign goals and limitations on WeiFund created campaigns. This way, if things go wrong, the damage can be minimized by virtue of limiting fund raising ceilings. Naturally, we respect any campaign that wants to exceed reasonable limitations, but we will attempt to inform contributors of the risks.

## Attack Vector: Malicious Third-Party Contract Interaction
The `StandardTokenCampaign` interacts with two, potentially malicious contracts: the campaign's token `DispersalCalculator` and its `StandardToken`. Either of these contracts could be created with malicious code inside. The best way to prevent contributors from potentially malicous attacks are:
  1. inform them on the origin, design and bytecode of these contracts
  2. inform the user on contract factory information
  3. inform the user if these contract designs have been vetted (and who they have been vetted by)
  4. provide standardized and vetted contract factory options for both these concerns (e.g. `HumanStandardTokenFactory`)
  5. warn users on non-vetted, potentially insecure campaigns
  6. inform users on personal contract inspection techniques
  7. create a community to oversee campaign deployment, development, staging and vetting
  8. inform users on the risks of using non-standard calculators and tokens
  9. design UI's that aid in informing projects and contributors on these particulars
  10. limit damage by recommending campaign funding ceilings

## Future Designs
### Standard Registry Campaigns
Some projects may want to create campaigns that register campaign contributors (instead of say, issuing them tokens). This is entirely possible, and will be prototyped in future designs.
