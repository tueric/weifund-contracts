'use strict';

const Tx = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');
const contracts = require('./lib/classes.json');
const util = require('util');

// make sure you create a JSON file for your account and private key
// {"address": "0x000", "privateKey": "00000"}

module.exports = {
  output: {
    environment: 'testrpc',
  },
  entry: {
    testrpc: contracts,
  },
//  environment: 'testrpc',
  module: function(deploy, contracts, web3){
//console.log('deploy:'+deploy);
//console.log('contracts:'+contracts);
//console.log('web3:'+util.inspect(web3, {depth:null}));
    // deploy registriesMyContract.at([address]);MyContract.at([address]);

    // deploy(contracts.CampaignDataRegistry);
    // deploy(contracts.CampaignRegistry);

    // get accounts
    web3.web3.eth.getAccounts(function(accountsError, accountsResult){
      // handle errors
      if (accountsError || accountsResult.length === 0) {
        throw `Accounts error or no accounts: ${accountsError}`;
      }

      // deploy two campaigns for reference
//      deploy(contracts.CoffeeRunCampaign, 'Coffee Run Campaign', Math.floor(Date.now() / 1000) + 30000, 5000, accountsResult[0]);
      deploy(contracts.StandardCampaign, 'Ice Cream Run Campaign', Math.floor(Date.now() / 1000) + 22000, 2300, accountsResult[0], accountsResult[0]);
    });
  },
  config: {
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
          'IceCreamRunCampaign': {
            'class': 'StandardCampaign',
            'from': 0, // a custom account
            'gas': 3135000, // some custom gas
            'expiry':100,
            'name' : 'Icecreamrun',
          },
        },
      },
      'morden1': {
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
