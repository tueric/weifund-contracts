import WeiFundContracts from '../index.js';
import Web3 from 'web3';
import { assert } from 'chai';

describe('WeiFundContracts', () => {
  describe('constructor functions properly', () => {
    it('should construct object with contracts and classes', () => {
      const contracts = new WeiFundContracts({
        provider: new Web3.providers.HttpProvider('https://morden.infura.io:8545'),
        network: 'testnet',
      });

      assert.equal(typeof contracts.classes, 'object');
      assert.equal(typeof contracts.CampaignRegistry, 'object');
      assert.equal(typeof contracts.CampaignRegistry.instance, 'function');
      assert.equal(typeof contracts.CampaignRegistry.instance(), 'object');
    });
  });
});
