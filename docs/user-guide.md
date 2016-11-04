# User Guide

All information for developers using weifund-contracts should consult this document.

## Install

```
npm install --save weifund-contracts
```

## Usage

```js
// require the WeiFund contracts repo and instantiate it
const WeiFundContracts = require('weifund-contracts');
const contracts = new WeifundContracts({
  provider: web3.currentProvider,
  network: 'testnet',
});

// util helpers
const unixDay = 24 * 24 * 60;
const currentUnixTime = ((new Date()).getTime() / 1000);
const oneEther = 1000000000000000000;
const myAddress = '0xd89b8a74c153f0626497bc4a531f702c6a4b285f';

// setup the registry
const campaignRegistry = contracts.CampaignRegistry.instance();

// StanardCampaign Contract Instance
const someCampaign = contracts.StandardCampaign.at('0x00...');

// New StandardCampaign
contracts.StandardCampaign.new("My Campaign Name", // name
  currentUnixTime + (60 * unixDay), // expiry
  50 * oneEther, // fundingGoal
  myAddress, // beneficiary
  myAddress, // owner
  {from: myAddress, gas: 3000000}, function(err, result){});
```

## WeiFund Contracts Object

```js
{
  StandardCampaign: {...},
  Campaign: {...},
  Token: {...},
  Owned: {...},
  HighlightRegistry: {...}, // instance() available
  CampaignRegistry: {...}, // instance() available
  CampaignDataRegistry: {...}, // instance() available
  StandardCampaignFactory: {...}, // instance() available
}
```
