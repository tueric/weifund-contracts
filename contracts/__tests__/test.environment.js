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
//const util = require('util');

const q = require('q');

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider('http://localhost:8545');
var web3 = new Web3(provider);

const util = require('./myutil.js');
util.setup(web3, q);

var accounts = [];

before('Environment setup', ()=> {
  console.log('Environment test setup');

  // start a promise chain
  return q()
  // get accounts
  .then(util.getAccounts)
  // then log the accounts to the console
  .then(util.logAfterResolve('accounts:'))
  // then assign the accounts to a global, asserting a non-empty set is present
  .then(_accounts=>{
    accounts = _accounts;
    assert.ok(accounts.length > 0, 'No accounts detected');
  })
  // continue even if the assertion failed
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
    .then((res)=>{ account_0 = res[0]; account_1 = res[1]; })

    .then(()=>{ return util.sendTransaction(accounts[0],accounts[1],1,1); }).then(util.logAfterResolve('transaction hash:'))
    .then((txHash)=>{ assert.ok(txHash, 'Transaction hash not generated'); return txHash; })

    .then(util.getTransactionReceipt).then(util.logAfterResolve('transaction receipt:'))
    .then((rxHash)=>{ assert.ok(rxHash, 'Receipt not generated'); })

    .then(()=>{ return util.getBalances(accounts); }).then(util.logAfterResolve('balances after transaction:'))
    .done((balanceList)=>{
      for (var i = 0; i < balanceList.length; i++) {
        assert(util.convertBigNumberToBase10(balanceList[i].value) >= 0, 'Balance not correct for account '+balanceList[i]);
      }
      assert(balanceList[0].value.lessThan(account_0.value), 'Balance did not decrease for account[0]');
      assert(balanceList[1].value.greaterThan(account_1.value), 'Balance did not increase for account[1]');
      done();
    });
  });

});
