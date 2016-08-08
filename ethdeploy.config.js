const Tx = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');

// make sure you create a JSON file for your account and private key
// {"address": "0x000", "privateKey": "00000"}

module.exports = {
  environment: 'all',
  deploymentModule: function(deploy, contracts, web3){
    // deploy registries
    deploy(contracts.CampaignDataRegistry);
    deploy(contracts.CampaignRegistry);

    // get accounts
    web3.eth.getAccounts(function(accountsError, accountsResult){
      // handle errors
      if (accountsError || accountsResult.length == 0) {
        throw `Accounts error or no accounts: ${accountsError}`;
      }

      // deploy two campaigns for reference
      deploy(contracts.CoffeeRunCampaign, 'Coffee Run Campaign', Math.floor(Date.now() / 1000) + 30000, 5000, accountsResult[0]);

      deploy(contracts.IceCreamRunCampign, 'Ice Cream Run Campaign', Math.floor(Date.now() / 1000) + 22000, 2300, accountsResult[0]);
    });
  },
  deploymentConfig: {
    'defaultBuildProperties': [
      'from',
      'transactionHash',
      'gas',
      'interface',
      'bytecode',
    ],
    'defaultAccount': 0,
    'defaultGas': 3135000,
    'environments': {
      'testrpc': {
        'provider': {
          'type': 'http',
          'host': 'http://localhost',
          'port': 8545,
        },
        'objects': {
          'CoffeeRunCampaign': {
            'class': 'StandardCampaign',
            'from': 0, // a custom account
            'gas': 3135000, // some custom gas
          },
          'IceCreamRunCampign': {
            'class': 'StandardCampaign',
            'from': 0, // a custom account
            'gas': 3135000, // some custom gas
          },
        },
      },
      'morden': {
        'provider': {
          'type': 'zero-client',
          getAccounts: function(cb) {
            // dont include keys anywhere inside or around repo
            cb(null, [require('../account.json').address]);
          },
          signTransaction: function(rawTx, cb) {
            // dont include private key info anywhere around repo
            const privateKey = new Buffer(require('../account.json').privateKey, 'hex');

            const tx = new Tx(rawTx);
            tx.sign(privateKey);

            cb(null, ethUtil.bufferToHex(tx.serialize()));
          },
          'host': 'https://morden.infura.io',
          'port': 8545,
        },
        'objects': {
          'CoffeeRunCampaign': {
            'class': 'StandardCampaign',
            'from': 0, // a custom account
            'gas': 3135000, // some custom gas
          },
          'IceCreamRunCampign': {
            'class': 'StandardCampaign',
            'from': 0, // a custom account
            'gas': 3135000, // some custom gas
          },
        },
      },
    },
  },
  outputContracts: require('./lib/classes.json'),
};
