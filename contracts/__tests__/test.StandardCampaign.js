/*

This test class examines the StandardCampaign contract using a web3 client. 

A local TestRPC instance is expected.

Contracts are compiled using dapple with solc < 0.3.6.

Contracts are deployed to the environment using ethdeploy.

The following test categories are included in this file:
- environment
- StandardCampaign

The following tests are included for the environment:
- accounts are present
- accounts have a balance >= 0
- an account can send a transaction to another account and obtain a tx hash and receipt

The following test are included for the StandardCampaign:
- verify that its meta data is accessible
- verify that a contribution can be transacted to the campaign and that a tx hash and receipt is provided
- verify that contribution ids and contribution receipts can be obtained by a user
- verify that a campaign can achieve its funding goal
- verify that a campaign state is correct if it expires and does not reach its funding goal
- verify that a campaign can payout to its beneficiary if it succeeds

TODO:
- verify that a campaign can refund to its contributers if it is expired and did not reach its funding goal

*/

'use strict';

const weifund = require('../../index.js');
const assert = require('assert');
//const BigNumber = require('bignumber.js');
//const jp = require('jsonpath');
const q = require('q');
const util = require('util');


//const chaithereum = require('chaithereum');
//const expect = chaithereum.chai.expect

// should approach
//const chai = require('chai');
//chai.use(require('chai-as-promised'));
//var should = chai.should();

// we choose chaithereum web3 instance
// NOTICE: chaithereum's reported accounts differ from that of external
// TestRPC instance even after setting a new provider
// var web3 = chaithereum.web3;
var Web3 = require('web3');

// create an instance of web3 using the HTTP provider.
var provider = new Web3.providers.HttpProvider('http://localhost:8545');

var web3 = new Web3(provider);
//web3.setProvider(provider);

const myutil = require('./myutil.js');
myutil.setup(web3,q);


// using a different web3 instance is possible, but currently auto deployment
// is only enabled on an external testrpc

//var TestRPC = require('ethereumjs-testrpc');
// programmatic testrpc
/*
var startTime = new Date('Wed Aug 24 2016 00:00:00 GMT-0700 (PDT)');
var provider = TestRPC.provider({
//    "accounts":["0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18,1000"],
"time": startTime,
"debug": true
});
*/




var accounts = [];


// returns a list of instances by type of contract requested
// not tested
// simplifies factory
/*
const getInstancesByType = function(weifund) {
  var d = q.defer();
  jp.query(weifund, '');
  return d.promise;
};
*/

// helper method that promises a method call resolves its callback result
// this is a variant of q's node-style callback helpers
/*
var hh = function(o, cmd, ...args) {
  var ar2 = args;
  var d = q.defer();
  var cb = (err,res)=>{
    if (err) console.error(err);
    assert.ok(err === null, 'Error encountered in cmd call');
    d.resolve(res);
  };
  ar2.push(cb);
  cmd.apply(o, ar2);
  return d.promise;
};
*/

// util for low-level rpc method call, not used
// TODO check how it should be promised
/*
function send(method, params, callback) {
  if (typeof params == 'function') {
    callback = params;
    params = [];
  }

  provider.sendAsync({
    jsonrpc: '2.0',
    method: method,
    params: params || [],
    id: new Date().getTime()
  }, callback);
};
*/

// promised evm increase time approach for time-dependent unit tests
// TODO a different method that implements a promised block number watcher
const increaseTime = function(time) {
  const deferred = q.defer();

  provider.sendAsync({ method: 'evm_increaseTime', params: [time] }, function(res,err) {
    console.log('res');
    console.log(res);
    if (!err) {
      provider.sendAsync({ method: 'evm_mine'}, function(res1,err1) {
        console.log('res1');
        console.log(res1);
        if (!err1) {
          deferred.resolve();
        } else {
          console.error(err1);
        }
      });
    } else {
      console.error(err);
    }
  });

  return deferred.promise;
};

// TODO: is this the best way to get the campaign address? it expects to get it from a previously serialized deployment
const icampaign = weifund.environments.testrpc.StandardCampaign;

var campaignInstance; // the campaign that is to be used for each test; likely this instance is shared between parallel tests, which is okay for now

before('StandardCampaign setup', ()=> {
  console.log('StandardCampaign setup');

  // start a promise chain
  return q()
  // get accounts
  .then(myutil.getAccounts)
  // then log the accounts to the console
  .then(myutil.logAfterResolve('accounts:'))
  // then assign the accounts to a global, asserting a non-empty set is present
  .then(_accounts=>{
    accounts = _accounts;
    assert.ok(accounts.length > 0, 'No accounts detected');
  })
  // continue even if the assertion failed
  .fail(myutil.logErrorThen)

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  // and assert that it is okay
  .then(()=>{
    assert.ok(icampaign.address, 'No campaign address found, expected campaign to be deployed');
  })
  .then(()=>{
    return q();
  });

});

beforeEach(() => {
  var c = myutil.contract(weifund.classes.StandardCampaign.interface);
  campaignInstance = c.at(icampaign.address);
});

describe('StandardCampaign tests', function() {

  it('valid campaign version', function(done) {

    // q node-styled callback helper - works
    // note the trailing parentheses to actually make the call
    q.nbind(campaignInstance.version, campaignInstance)()

    // alternative 1 - custom implementation - works
    //q(campaignInstance)
    //.then((res) => { return hh(res, res.version); })

    // alternative 2 - manual (longer) version of method call - works
    // .then((i)=>{
    //   var d = q.defer();
    //   i.version((err,res)=>{
    //     if (err) console.error(err);
    //     assert.ok(err === null, 'Error encountered in call to campaign's version'); d.resolve(res);
    //   });
    //   return d.promise;
    // })

    .then(myutil.logAfterResolve('version'))
    .then((res)=>{
      assert.ok(res.includes('.'), 'Version not correct');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });


  it('checks that a campaign initial balance is zero', function(done) {
    // resolve the campaign address and then get its balance
    q(icampaign.address).then(myutil.getBalance)
    .then(myutil.logAfterResolve('campaign balance:'))
    .then((campaignBalance)=>{
      assert.ok(campaignBalance.equals(0), 'Campaign balance not zero');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  it('sends a transaction from one user account to a campaign', function(done) {
    myutil.sendTransaction(accounts[0],icampaign.address,1,1)
    .then(myutil.logThen)
    .thenResolve(icampaign.address).then(myutil.getBalance)
    .then(myutil.convertBigNumberToBase10)
    .then(myutil.logAfterResolve('campaign balance:'))
    .then((res)=>{
      assert.ok(res>0, 'Campaign balance not greater than zero');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  it('sends a transaction to a campaign and receives a transaction receipt', function(done) {
    var ca;

    q.nbind(campaignInstance.amountRaised, campaignInstance)()
    .then((res)=>{
      ca = res;
    })

    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
    })
    .then(myutil.logAfterResolve('transaction hash:'))
    .then((res)=>{
      assert.ok(res, 'Transaction hash not issued');
      return res;
    })
    .fail(myutil.logErrorThen)

    .then(myutil.getTransactionReceipt)
    .then(myutil.logAfterResolve('transaction receipt:'))
    .then((res)=>{
      assert.ok(res.logs !== undefined && res.logs.length > 0);
    })
    .fail(myutil.logErrorThen)

    .then(()=>{ return q.nbind(campaignInstance.amountRaised, campaignInstance)(); })
    .then(myutil.logAfterResolve('Amount raised:'))
    .then((res)=>{
      assert.ok(res.greaterThan(ca), 'Campaign amountRaised did not increase due to contribution');
    })
    .fail(myutil.logErrorThen)

    .done(()=>{
      done();
    });
  });

  it('sends two contributions to a campaign and retrieves the contribution ids', function(done) {
    this.timeout(5000);
    myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue)
    .then(myutil.logAfterResolve('first transaction hash:'))
    .then((res)=>{ assert.ok(res, 'First transaction hash not issued'); return res; })

    .then(myutil.getTransactionReceipt).then(myutil.logAfterResolve('first transaction receipt:'))
    .then((res)=>{ assert.ok(res, 'First transaction receipt not issued'); })
    .fail(myutil.logErrorThen)

    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address, 0.5, 0.1,campaignInstance.contributeMsgValue);
    }).then(myutil.logAfterResolve('second transaction hash:'))
    .then((res)=>{
      assert.ok(res, 'Second transaction hash not issued');
      return res;
    })
    .fail(myutil.logErrorThen)

    .then(myutil.getTransactionReceipt).then(myutil.logAfterResolve('second transaction receipt:'))
    .then((res)=>{ assert.ok(res, 'Second transaction receipt not issued'); })
    .fail(myutil.logErrorThen)

    // get the list of contribution ids for the accounts transaction's
    // TODO rewrite the call as async
    .then(()=>{
      var d = q.defer();
      var ret = [];
      for (var i = 0; i < campaignInstance.totalContributionsBySender(accounts[0]); i++) {
        var cid = campaignInstance.contributionsBySender(accounts[0],i);
        ret.push(cid);
        console.log(cid);
      }
      d.resolve(ret);
      return d.promise;
    })
    .then(myutil.logAfterResolve('contribution ids:'))
    .then((res)=>{
      assert.ok(res.length > 0, 'At least two contribution ids not obtained from campaign for account');
      return res;
    })
    .fail(myutil.logErrorThen)

    // get the contribution objects for the given contribution ids
    // TODO rewrite the call as async
    .then(function(res) {
      var d = q.defer();
      var ret = [];
      for (var i = 0; i < res.length; i++) {
        ret.push(campaignInstance.contributions(res[i]));
      }
      d.resolve(ret);
      return d.promise;
    }).then(myutil.logAfterResolve('contribution instances:'))
    .then((res)=>{
      // TODO perhaps do some stricter type checking of the contribution type
      assert.ok(res.length >= 2, 'At least two contribution instances not obtained from campaign for account');
      return res;
    })
//    .fail(myutil.logErrorThen)

    .done(()=>{done(); });
  });

  // TODO in progress
  // TODO see why timeout is not succeeding
  // TODO see why payout to beneficiary is not succeeding
  it.skip('checks that a campaign can reach its funding goal and pay out', function(done) {
    this.timeout(20000);

    q()
    .then(()=>{
      console.log('campaignInstance:');
      console.log(campaignInstance);
    })
    .then(()=>{
      return q.nbind(campaignInstance.expiry, campaignInstance)();
    }).then(myutil.logAfterResolve('expiry:'))

    // assert that the stage is 0 (operational)
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(myutil.logAfterResolve('stage num:'))
    .then(function(res) { assert.ok(res.equals(0), 'Campaign stage is not set to operational'); })
    .fail(myutil.logErrorThen)

    .then(()=>{
      return q.nbind(campaignInstance.getNow,campaignInstance)();
    }).then(myutil.logAfterResolve('now:'))

    .then(()=>{
      return q.nbind(campaignInstance.fundingGoal, campaignInstance)();
    })
    .then(myutil.logAfterResolve('funding goal:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    })
    .then(myutil.logAfterResolve('amount raised:'))


    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances01:'))

    // send an transaction that makes campaign reach funding goal
    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address,1,0.1,campaignInstance.contributeMsgValue);
    }).then(myutil.logAfterResolve('transaction hash:'))

    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances02:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    }).then(myutil.logAfterResolve('amount raised:'))

    // expire the campaign
    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_increaseTime', params: [2000000] })();
    })
    .then(myutil.logAfterResolve('evm_increaseTime*:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_mine' })();
    })
    .then(myutil.logAfterResolve('evm_mine*:'))

// helper function removed
/*
    .then(()=>{
      return q.nbind(campaignInstance.getStageAt,campaignInstance)();
    }).then(myutil.logAfterResolve('getstageat:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
*/

    .then(()=>{
      return q.nbind(campaignInstance.getNow,campaignInstance)();
    }).then(myutil.logAfterResolve('getNow:'))

    // assert that the stage is 0 (operational, funding goal reached)
    // it should be this way because stage is only updated on a transaction call
    // not blockchain time or block property updates
    // However, it is suggested that a function be available to update the stage independently of transaction processing
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(myutil.logAfterResolve('stage:'))
    .then(res=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
    .fail(myutil.logErrorThen) // the assertion is not serious enough to stop

    // trigger the campaign stage to be updated, the only way to do that successfully right now is by being the owner and calling payout when successful

    // assert that a transaction receipt was issued

    // problems start here

    // does not work
    .then(()=>{
      var d = q.defer();
      campaignInstance.payoutToBeneficiary({},'latest',(err,res)=>{
        console.log('_try0');
        console.log(err);
        console.log(res);
        d.resolve(res);
      });
      return d.promise;
    })

    .then(()=>{
      return q.nbind(campaignInstance.payoutToBeneficiary, campaignInstance)();
    })
    .then(myutil.logAfterResolve('_try1:'))


    .then(()=>{

      var d = q.defer();

      campaignInstance.payoutToBeneficiary.apply(campaignInstance,[{ 'from': accounts[0], 'to': icampaign.address, 'value': web3.toWei(0.1,'ether'), 'gas': 2000000 },function(err,res) {
        console.log('try2:');
        console.log(err);
        console.log(res);
        d.resolve(res);
      }]);
      return d.promise;

    })
    .then(myutil.logAfterResolve('_try2:'))

    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances11:'))

    .then(()=>{
      return myutil.sendTransaction(accounts[0], icampaign.address, 0.1, 0.1, icampaign.payoutToBeneficiary);
    }).then(myutil.logAfterResolve('_try4:'))

    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances12:'))

    .done(()=>{done();});

/*
    q()
    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances1:'))

    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address,0,.1,campaignInstance.payoutToBeneficiary);
    })
    .then(myutil.logAfterResolve('payout sendtransaction tx hash:'))
    .then((res)=>{
      assert.ok(res, 'payoutToBeneficiary transaction did not issue transaction hash');
    })
    .fail(myutil.logErrorThen)

    .then(()=>{
      console.log('****************');
      console.log(accounts);
    })
    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances2:'))

    // make a call to the method
    // but this doesn't work
    .then(()=>{
      return q.nbind(campaignInstance.payoutToBeneficiary,campaignInstance)();
    })
    .then(myutil.logAfterResolve('payout call tx hash:'))
    .then((res)=>{ assert.ok(res, 'payoutToBeneficiary call did not issue transaction hash'); })
    .fail(myutil.logErrorThen)

// helper function removed
//    .then(()=>{
//      return q.nbind(campaignInstance.getStageAt,campaignInstance)();
//    }).then(myutil.logAfterResolve('getStageAt:'))
//    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
//    .fail(myutil.logErrorThen)


    // assert that the stage is 2 (not operational, funding goal reached)
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    }).then(myutil.logAfterResolve('stage last:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
    .fail(myutil.logErrorThen)



    .done(()=>{
      done()
    });
*/

  });

  it('gets the campaign expiry', function(done) {
    q.nbind(campaignInstance.expiry, campaignInstance)()
    .then(myutil.logAfterResolve('campaign expiry:'))
    .then((res)=>{
      assert.ok(res.greaterThanOrEqualTo(0), 'Campaign expiry not a proper num');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  it('gets the beneficiary', function(done) {
    q()
    .then(()=>{
      return q.nbind(campaignInstance.beneficiary, campaignInstance)();
    })
    .then(myutil.logAfterResolve('beneficiary:'))
    .then((beneficiaryAddress)=>{
      assert.ok(beneficiaryAddress === accounts[0], 'Beneficiary address not set as expected');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  it('gets the owner', function(done) {
    q()
    .then(()=>{
      return q.nbind(campaignInstance.owner, campaignInstance)();
    })
    .then(myutil.logAfterResolve('owner:'))
    .then((ownerAddress)=>{
      assert.ok(ownerAddress === accounts[0], 'Owner address not set as expected');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });


  it('gets the campaign name', function(done) {
    q()
    .then(()=>{
      return q.nbind(campaignInstance.name, campaignInstance)();
    })
    .then(myutil.logAfterResolve('campaign name:'))
    .then((campaignName)=>{
      assert.ok(campaignName.length > 0, 'Campaign name has length zero');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  it('gets the campaign funding goal', function(done) {
    q()
    .then(()=>{
      return q.nbind(campaignInstance.fundingGoal, campaignInstance)();
    })
    .then(myutil.logAfterResolve('funding goal:'))
    .then((fundingGoal)=>{
      assert.ok(fundingGoal.greaterThanOrEqualTo(0), 'Campaign funding goal not valid');
    })
    .fail(myutil.logErrorThen)
    .done(()=>{
      done();
    });
  });

  // asserts not added since campaign class needs additional methods to support actual stage
  // NOTE this test has to be run before the campaign has expired (i.e., before executing a time delay)
  // TODO determine a better way to determing the campaign stage since its trigger requires a transaction
  it('gets the campaign stage (operation/ended)', function(done) {

    q()
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    }).then(myutil.logEnd)

    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
    })
    .then(myutil.logThen)
    .then(myutil.getTransactionReceipt).then(myutil.logThen)
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(myutil.logEnd)
    .done(()=>{
      done();
    });

  });


  // the following test method does not work
  // the object weifund.classes.StandardCampaign.functionHashes['version()']
  // is undefined (it worked at some point)
  // TODO correct the reference to the version() function hash reference
  it.skip('returns the campaign version, version hash approach', function(done) {
    q()
    .then(()=>{
      console.log(weifund.classes.StandardCampaign);
      console.log('*****************');
      var d1 = q.defer();
      var dat = {
        'from': accounts[0],
        'to': icampaign.address,
        'gasPrice': '0x01',
        // TODO Update the following reference, the object is underfined
        'data': weifund.classes.StandardCampaign.functionHashes['version()']
      };
      console.log('dat:',dat);
      web3.eth.call(dat,
        function(err,res) {
          console.log('data');
          console.log(res);
          console.log(err);
          d1.resolve(res);
        });
        return d1.promise;
      })
      .then(myutil.logEnd)
      .done(()=>{
        done();
      });
    });

    // log filter approach
    it('send 2 transactions to a campaign and gets the corresponding topics using two filter approaches: watch, and get', function(done) {

      var filter;
      var topic;

      q()

      // capture logs through a filter watcher
      .then(()=>{
        filter = web3.eth.filter();

        filter.watch(function (err, log) {
          if (err) console.error(err);
          assert.ok(err === null, 'Log watch filter reported an error');

          console.log('watch log:',log);
          //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
        });
      })

      // initiate a transaction
      .then(()=>{
        return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
      }).then(myutil.logThen)
      .then(myutil.getTransactionReceipt).then(myutil.logThen)

      // ensure that the topic was logged in the transaction receipt
      .then((txReceipt)=>{ topic = txReceipt.logs[0].topics[0]; })
      .then(()=>{ assert.ok(topic !== undefined, 'Did not log contribution'); })
      .fail(myutil.logErrorThen)

      .then(()=>{
        return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
      }).then(myutil.logEnd)

      .then(myutil.getAccounts).then(myutil.logThen)
      .then(function(res) {
        var d = q.defer();
        try {
          campaignInstance.contributionsBySender.call(
            res[0],
            1,
            { 'from': res[0] , 'to': icampaign.address },
            function(err,res) { console.log('res:'+res); d.resolve(res); });
            return d.promise;
          } catch(e) {
            console.error(e);
          }
          return q(1);
        }).then(myutil.logEnd)

        // check filter.get logs, and stop the filter
        .then(()=>{
          // get all past logs again.
          var myResults = filter.get({ 'fromBlock': 0, 'toBlock': 'pending' },function(error, logs){ console.log('log collection:'); console.log(logs); });
          console.log('myResults',myResults);

          assert.ok(myResults.length > 0, 'A log was not retrieved through filter.get');

          // stops and uninstalls the filter
          filter.stopWatching();
        })
            .fail(myutil.logErrorThen)
        // TODO assert filter result content is correct

            .done(()=>{
		done();
            });
    });


// TODO in progress
    it('checks the status of the campaign after a time delay that expires the campaign. This test should fail since the second contribution should not be permitted when the campaign is expired.', function(done) {
	//this.timeout(40000);

	q()
	// make an initial contribution
	    .then(()=>{
		return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
	    }).then(myutil.logThen)

	    .then(myutil.getTransactionReceipt).then(myutil.logThen)

	// expire the campaign
	    .then(()=>{ increaseTime(2000000); })

	// send a second contribution after the campaign has expired
	    .then(()=>{
		return myutil.sendTransaction(accounts[0],icampaign.address,0.5,0.1,campaignInstance.contributeMsgValue);
	    }).then(myutil.logThen)

	// assert that the contribution did not succeed
	    .then(function(res) { assert.ok(res === undefined, 'Send contribution to campaign is possible even though contract has expired'); })
	    .fail(myutil.logErrorThen)

	    .then(done);

    });

});
