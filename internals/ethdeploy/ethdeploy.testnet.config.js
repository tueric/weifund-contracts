/* eslint-disable */

const contracts = require('../../src/lib/classes.json');
const account = require('../../../account.json');
const Tx = require('ethereumjs-tx');
const ethUtil = require('ethereumjs-util');

module.exports = {
  output: {
    environment: 'testnet',
    path: './src/lib/environments.json',
  },
  entry: {
    testnet: contracts,
  },
  module: function(deploy, contracts, environment){
    deploy(contracts.CampaignRegistry);
    deploy(contracts.CampaignDataRegistry);
    deploy(contracts.CurationRegistry);
    deploy(contracts.HighlightRegistry);
    deploy(contracts.StandardCampaignFactory);
  },
  config: {
    defaultAccount: 0,
    defaultGas: 3000000,
    environments: {
      testnet: {
        provider: {
          type: 'zero-client',
          getAccounts: function(cb) {
            // dont include keys anywhere inside or around repo
            cb(null, [account.address]);
          },
          signTransaction: function(rawTx, cb) {
            // dont include private key info anywhere around repo
            const privateKey = new Buffer(account.privateKey, 'hex');

            // tx construction
            const tx = new Tx(rawTx);
            tx.sign(privateKey);

            // callback with buffered serilized signed tx
            cb(null, ethUtil.bufferToHex(tx.serialize()));
          },
          'host': 'https://morden.infura.io',
          'port': 8545,
        },
        objects: {
        },
      },
    },
  },
};
