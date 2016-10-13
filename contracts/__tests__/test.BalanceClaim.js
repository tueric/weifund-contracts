/*

This file performs a JS-oriented unit test of the BalanceClaim.sol contract.

The following are tested:
- construction
- ownership
- pull based funding
- push based funding

*/

'use strict';

const weifund = require('../../index.js');
const assert = require('assert');

const q = require('q');
//const util = require('util');
var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider('http://localhost:8545');
var web3 = new Web3(provider);

const util = require('./myutil.js');
util.setup(web3, q);

const chaithereum = require('chaithereum');

var accounts = [];
//var balances = [];

before(()=> {
  // another way to deploy instead of through npm
  // makes visible the deployment into the environment right in the unit test itself
  // ** does not yet work, not tested **
  // TODO need to make sure that environment file is generated before its import into this file
  //const deploy = require('../deploy.js');

  return chaithereum.promise
  .then(util.getAccounts)
  .then(util.logAfterResolve('accounts:'))
  .then((_accounts)=>{
    accounts = _accounts;
    assert.ok(accounts.length > 0, 'No accounts detected');
  })
  .fail(util.logErrorThen)
  .then(()=>{
    return q();
  });

});

describe('Environment tests', function() {
  it('Send a transaction from accounts[0] to accounts[1]', function(done) {
    var account_0, account_1;

    q()
    .then(()=>{ return util.getBalances(accounts); }).then(util.logAfterResolve('balances before transaction:'))
    .then((res)=>{ a0 = res[0]; a1 = res[1]; })

    .then(()=>{ return util.sendTransaction(accounts[0],accounts[1],1,1); }).then(util.logAfterResolve('transaction hash:'))
    .then((txHash)=>{ assert.ok(txHash, 'Transaction hash not generated'); return txHash; })

    .then(util.getTransactionReceipt).then(util.logAfterResolve('transaction receipt:'))
    .then((rxHash)=>{ assert.ok(rxHash, 'Receipt not generated'); })

    .then(()=>{ return getBalances(accounts); }).then(util.logAfterResolve('balances after transaction:'))
    .done((balanceList)=>{
      for (var i = 0; i < balanceList.length; i++) {
        assert(convertBigNumberToBase10(res[i].value) >= 0, 'Balance not correct for account '+balanceList[i]);
      }
      assert(balanceList[0].value.lessThan(a0.value), 'Balance did not decrease for account[0]');
      assert(balanceList[1].value.greaterThan(a1.value), 'Balance did not increase for account[1]');
      done();
    });
  });

});
