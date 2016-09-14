'use strict';

const weifund = require('../index.js');
const assert = require('assert');
//const BigNumber = require('bignumber.js');
//const jp = require('jsonpath');
const q = require('q');
const util = require('util');

const chaithereum = require('chaithereum');
const expect = chaithereum.chai.expect

// should approach
//const chai = require('chai');
//chai.use(require('chai-as-promised'));
//var should = chai.should();

// we choose chaithereum web3 instance
// NOTICE: chaithereum's reported accounts differ from that of external
// TestRPC instance even after setting a new provider
// var web3 = chaithereum.web3;
var Web3 = require('web3');
var web3 = new Web3(provider);

// create an instance of web3 using the HTTP provider.
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
web3.setProvider(provider);

// using a different web3 instance is possible, but currently auto deployment
// is only enabled on an external testrpc

//var TestRPC = require("ethereumjs-testrpc");
// programmatic testrpc
/*
var startTime = new Date("Wed Aug 24 2016 00:00:00 GMT-0700 (PDT)");
var provider = TestRPC.provider({
//    "accounts":["0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18,1000"],
"time": startTime,
"debug": true
});
*/




var accounts = [];
var balances = [];

// get the contract type from web3
var contract = function(typeinterface) {
  return web3.eth.contract(JSON.parse(typeinterface));
};

// log error
var cle = function(err) {
  console.error(util.inspect(err, { depth: null, colors: true} ));
  return err;
}

// log a big number to the console
var clb = function(bn) {
  return cl(bn.toNumber());
};

// log message m before callback
// useful for logging after an earlier promised callback completes
// (thus logging m before logging the earlier callback result)
var clm = function(m) {
  return function(res,err) {
    console.log(m);
    return cl(res,err);
  }
};

// simple passthrough logging function
var cl = function(res,err) {
  //    console.log(res);
  if (res) {
    console.log(util.inspect(res, { depth: null, colors: true} ));
  }
  if (err) {
    console.error(util.inspect(err, { depth: null, colors: true} ));
  }
  return res;
};

// non-passthrough logging function
var cl0 = function(res,err) {
  console.log(util.inspect(res, { depth: null, colors: true} ));
};

// returns a list of instances by type of contract requested
// not tested
// simplifies factory
const getInstancesByType = function(weifund) {
  var d = q.defer();
  jp.query(weifund, '');
  return d.promise;
};

// bignumber util tostring base 10
const bv = function(bignumberval) {
  return bignumberval.toString(10);
}

// transaction promise utilities

// generic promise of send transaction via instance method i
const sendTransaction = function(from, to, amount, gas, i) {

  var d = q.defer();
  var ii = i || web3.eth;
  ii.sendTransaction({
    "from": from,
    "to":to,
    "value":web3.toWei(amount,'ether'),
    "gas":2000000,
    // "gasPrice": 10,
    // "gas":web3.eth.gasPrice*100000 //web3.toWei(gas,'ether')
    // "data": web3.fromAscii("hello")
  },
  function(err, res) {
    debugger;
    if (err)
    console.error(err);
    if (res)
    console.log(res);
    d.resolve(res);
  });
  return d.promise;
};

// get promised receipt given transaction hash
const getTransactionReceipt = function(hash) {
  var d = q.defer();
  web3.eth.getTransactionReceipt(hash, function(err,res) { d.resolve(res); });
  return d.promise;
};

// campaign promise utilities

// get balance of given account
const getBalance = function(o) {
  const d = q.defer();
  // console.log("getting balance for:" + o);
  web3.eth.getBalance(o, 'latest', function(err,res) { if (err) console.error(err); d.resolve(res); } );
  return d.promise;
};

// get promised balances for list of balances
const getBalances = function(list) {
  // console.log("getBalances:",list);
  return q.allSettled(list.map(function(o) {
    return getBalance(o);
  }));
};

// get promised list of accounts from env
const getAccounts = function() {
  var d = q.defer();
  web3.eth.getAccounts(function(err,accounts) {
    d.resolve(accounts);
  });
  return d.promise;
};

// helper method that promises a method call resolves its callback result
// this is a variant of q's node-style callback helpers
var hh = function(o, cmd, ...args) {
  var ar2 = args;
  var d = q.defer();
  var cb = (err,res)=>{
    if (err) console.error(err);
    assert.ok(err === null, "Error encountered in cmd call");
    d.resolve(res);
  };
  ar2.push(cb);
  cmd.apply(o, ar2);
  return d.promise;
};

// util for low-level rpc method call, not used
// TODO check how it should be promised
function send(method, params, callback) {
  if (typeof params == "function") {
    callback = params;
    params = [];
  }

  provider.sendAsync({
    jsonrpc: "2.0",
    method: method,
    params: params || [],
    id: new Date().getTime()
  }, callback);
};

// promised evm increase time approach for time-dependent unit tests
// TODO a different method that implements a promised block number watcher
const increaseTime = function(time) {
  const deferred = q.defer()

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
  })

  return deferred.promise;
};

var icampaign = weifund.environments['testrpc'].IceCreamRunCampaign;

before(()=> {
  // another way to deploy instead of through npm
  // makes visible the deployment into the environment right in the unit test itself
  // ** does not yet work, not tested **
  // TODO need to make sure that environment file is generated before its import into this file
  //const deploy = require('../deploy.js');

  return chaithereum.promise
  .then(getAccounts)
  .then(clm('accounts:'))
  .then(res=>{
    accounts = res;
    assert.ok(accounts.length > 0, 'No accounts detected');
    return q(0);
  });

});

var campaignInstance;

beforeEach(() => {
  var c = contract(weifund.classes.StandardCampaign.interface);
  campaignInstance = c.at(icampaign.address);
});


describe('Environment tests', function() {
  it("Send a transaction from accounts[0] to accounts[1]", function(done) {
    var a0, a1;

    q()
    .then(()=>{ return getBalances(accounts)}).then(clm('balances before transaction:'))
    .then((res)=>{ a0 = res[0]; a1 = res[1]; })

    .then(()=>{ return sendTransaction(accounts[0],accounts[1],1,1) }).then(clm('transaction hash:'))
    .then((res)=>{ assert.ok(res, 'Transaction hash not generated'); return res; })

    .then(getTransactionReceipt).then(clm('transaction receipt:'))
    .then((res)=>{ assert.ok(res, 'Receipt not generated'); })

    .then(()=>{ return getBalances(accounts); }).then(clm('balances after transaction:'))
    .done((res)=>{
      for (var i = 0; i < res.length; i++) {
        assert(bv(res[i].value) >= 0, 'Balance not correct for account '+res[i]);
      }
      assert(res[0].value.lessThan(a0.value), "Balance did not decrease for account[0]");
      assert(res[1].value.greaterThan(a1.value), "Balance did not increase for account[1]");
      done();
    });
  });

});

describe('StandardCampaign tests', function() {

  it("valid campaign version", function(done) {

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
    //     assert.ok(err === null, "Error encountered in call to campaign's version"); d.resolve(res);
    //   });
    //   return d.promise;
    // })

    .then(clm('version'))
    .done((res)=>{
      assert.ok(res == "1.0.0", 'Version not correct');
      done();
    });
  });


  it("checks that a campaign's initial balance is zero", function(done) {
    q(icampaign.address).then(getBalance)
    .then(bv) // transform bignumber into a value
    .then(clm('campaign balance:'))
    .done((res)=>{
      assert.ok(res==0, 'Campaign balance not zero');
      done();
    });
  });

  it("sends a transaction from one user account to a campaign", function(done) {
    sendTransaction(accounts[0],icampaign.address,1,1)
    .then(cl)
    .thenResolve(icampaign.address).then(getBalance)
    .then(bv)
    .then(clm('campaign balance:'))
    .done((res)=>{
      assert.ok(res>0, 'Campaign balance not greater than zero');
      done();
    })
  });

  it("sends a transaction to a campaign and receives a transaction receipt", function(done) {
    var ca;

    q.nbind(campaignInstance.amountRaised, campaignInstance)()
    .then((res)=>{
      ca = res;
    })

    .then(()=>{
      return sendTransaction(accounts[0],icampaign.address,.5,.1,campaignInstance.contributeMsgValue)
    })
    .then(clm('transaction hash:'))
    .then((res)=>{
      assert.ok(res, 'Transaction hash not issued')
      return res;
    })

    .then(getTransactionReceipt)
    .then(clm('transaction receipt:'))
    .then((res)=>{
      assert.ok(res.logs !== undefined && res.logs.length > 0);
    })

    .then(()=>{ return q.nbind(campaignInstance.amountRaised, campaignInstance)() })
    .then(clm('Amount raised:'))
    .then((res)=>{
      assert.ok(res.greaterThan(ca), 'Campaign amountRaised did not increase due to contribution')
    })

    .done(()=>{
      done();
    });
  });

  it("sends two contributions to a campagin and retrieves the contribution ids", function(done) {
    sendTransaction(accounts[0],icampaign.address,.5,.1,campaignInstance.contributeMsgValue)
    .then(clm('first transaction hash:'))
    .then((res)=>{ assert.ok(res, 'First transaction hash not issued'); return res; })

    .then(getTransactionReceipt).then(clm('first transaction receipt:'))
    .then((res)=>{ assert.ok(res, 'First transaction receipt not issued')})

    .then(()=>{
      return sendTransaction(accounts[0],icampaign.address,.5,.1,campaignInstance.contributeMsgValue);
    }).then(clm('second transaction hash:'))
    .then((res)=>{
      assert.ok(res, 'Second transaction hash not issued');
      return res;
    })

    .then(getTransactionReceipt).then(clm('second transaction receipt:'))
    .then((res)=>{ assert.ok(res, 'Second transaction receipt not issued')})

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
    .then(clm('contribution ids:'))
    .then((res)=>{
      assert.ok(res.length > 0, 'At least two contribution ids not obtained from campaign for account');
      return res;
    })

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
    }).then(clm('contribution instances:'))
    .then((res)=>{
      // TODO perhaps do some stricter type checking of the contribution type
      // TODO update the environment setup to clear the vm so that we know exactly how many transactions to expect, this is resolved by using it.only instead for the test method
      assert.ok(res.length > 2, 'At least two contribution instances not obtained from campaign for account');
      return res;
    })

    .done(()=>{done()});
  });

  // TODO in progress
  // TODO see why timeout is not succeeding
  // TODO see why payout to beneficiary is not succeeding
  it("checks that a campaign can reach its funding goal and pay out", function(done) {
    this.timeout(20000);

    q()
    .then(()=>{
      console.log('campaignInstance:')
      console.log(campaignInstance);
    })
    .then(()=>{
      return q.nbind(campaignInstance.expiry, campaignInstance)();
    }).then(clm('expiry:'))

    // assert that the stage is 0 (operational)
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(clm('stage num:'))
    .then(function(res) { assert.ok(res.equals(0), 'Campaign stage is not set to operational'); })
    .fail(cle)

    .then(()=>{
      return q.nbind(campaignInstance.getNow,campaignInstance)();
    }).then(clm('now:'))

    .then(()=>{
      return q.nbind(campaignInstance.fundingGoal, campaignInstance)();
    })
    .then(clm('funding goal:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    })
    .then(clm('amount raised:'))


    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances01:'))

    // send an transaction that makes campaign reach funding goal
    .then(()=>{
      return sendTransaction(accounts[0],icampaign.address,1,.1,campaignInstance.contributeMsgValue);
    }).then(clm('transaction hash:'))

    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances02:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    }).then(clm('amount raised:'))

    // expire the campaign
    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_increaseTime', params: [2000000] })();
    })
    .then(clm('evm_increaseTime*:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_mine' })();
    })
    .then(clm('evm_mine*:'))

    .then(()=>{
      return q.nbind(campaignInstance.getStageAt,campaignInstance)();
    }).then(clm('getstageat:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })

    .then(()=>{
      return q.nbind(campaignInstance.getNow,campaignInstance)();
    }).then(clm('getNow:'))

    // assert that the stage is 0 (operational, funding goal reached)
    // it should be this way because stage is only updated on a transaction call
    // not blockchain time or block property updates
    // However, it is suggested that a function be available to update the stage independently of transaction processing
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(clm('stage:'))
    .then(res=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
    .fail(cle) // the assertion is not serious enough to stop

    // trigger the campaign stage to be updated, the only way to do that successfully right now is by being the owner and calling payout when successful

    // assert that a transaction receipt was issued

    // problems start here

    // does not work
    .then(()=>{
      var d = q.defer();
      campaignInstance.payoutToBeneficiary({},"latest",(err,res)=>{
        console.log('_try0');
        console.log(err);
        console.log(res);
        d.resolve(res);
      })
      return d.promise;
    })

    .then(()=>{
      return q.nbind(campaignInstance.payoutToBeneficiary, campaignInstance)();
    })
    .then(clm('_try1:'))


    .then(()=>{

      var d = q.defer();

      campaignInstance.payoutToBeneficiary.apply(campaignInstance,[{ "from": accounts[0], "to":icampaign.address, "value":web3.toWei(0.1,'ether'), "gas":2000000 },function(err,res) {
        console.log("try2:");
        console.log(err);
        console.log(res);
        d.resolve(res);
      }]);
      return d.promise;

    })
    .then(clm('_try2:'))

    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances11:'))

    .then(()=>{
      return sendTransaction(accounts[0], icampaign.address, 0.1, .1, icampaign.payoutToBeneficiary);
    }).then(clm('_try4:'))

    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances12:'))

    .done(()=>{done()});

/*
    q()
    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances1:'))

    .then(()=>{
      return sendTransaction(accounts[0],icampaign.address,0,.1,campaignInstance.payoutToBeneficiary);
    })
    .then(clm('payout sendtransaction tx hash:'))
    .then((res)=>{
      assert.ok(res, 'payoutToBeneficiary transaction did not issue transaction hash');
    })
    .fail(cle)

    .then(()=>{
      console.log("****************");
      console.log(accounts);
    })
    .then(()=>{
      return getBalances(accounts);
    })
    .then(clm('balances2:'))

    // make a call to the method
    // but this doesn't work
    .then(()=>{
      return q.nbind(campaignInstance.payoutToBeneficiary,campaignInstance)();
    })
    .then(clm('payout call tx hash:'))
    .then((res)=>{ assert.ok(res, 'payoutToBeneficiary call did not issue transaction hash'); })
    .fail(cle)

    .then(()=>{
      return q.nbind(campaignInstance.getStageAt,campaignInstance)();
    }).then(clm('getStageAt:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
    .fail(cle)

    // assert that the stage is 2 (not operational, funding goal reached)
    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    }).then(clm('stage last:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
    .fail(cle)



    .done(()=>{
      done()
    });
*/

  });

  // TODO in progress
  it("checks the status of the campaign after a time delay", function(done) {
    //this.timeout(40000);
    const c = contract(weifund.classes.StandardCampaign.interface);
    const con = c.at(icampaign.address);

    q()
    .then(function(res) { console.log(con.expiry()); })

    .then(function(res) { console.log(con.stage()); })
    // TODO assert that stage is 0

    // make an initial contribution
    .then(function(res) {
      return sendTransaction(accounts[0],icampaign.address,.5,.1,campaignInstance.contributeMsgValue);
    }).then(cl)

    .then(getTransactionReceipt).then(cl)

    // expire the campaign
    .then(function() { increaseTime(2000000); })

    .then(function(res) { console.log(con.stage()); })
    // TODO assert that stage is 1 (not operational, funding goal not reached), assume that configured test contract expiry is after this time

    // send a second contribution after the campaign has expired
    .then(getAccounts)
    .then(function(res) {
      return sendTransaction(res[0],icampaign.address,.5,.1,con.contributeMsgValue);
    }).then(cl)

    // assert that the contribution did not succeed
    .then(function(res) { assert.ok(res !== undefined, 'Send contribution to campaign is possible even though contract has expired'); })
    .fail(cle)

    .then(function(res) { console.log(con.stage()); })

    .then(done);

  });

  it("gets the campaign expiry", function(done) {
    q.nbind(campaignInstance.expiry, campaignInstance)()
    .then(clm('campaign expiry:'))
    .then((res)=>{
      assert.ok(res.greaterThanEqual(0), 'Campaign expiry not a proper num');
    })
    .then(done);
  });

  // TODO update this test method
  it("gets the campaign name", function(done) {
    const c = contract(weifund.classes.StandardCampaign.interface);
    const c1 = c.at(icampaign.address);
    q((function() {
      var d = q.defer();
      c1.name(function(err,res) { if (err) console.log(err); d.resolve(res); });
      return d.promise;
    })())
    .then(cl0).then(done);
  });

  // TODO update this test method
  it("gets the campaign funding goal", function(done) {
    const c = contract(weifund.classes.StandardCampaign.interface);
    const c1 = c.at(icampaign.address);
    q((function() {
      var d = q.defer();
      c1.fundingGoal(function(err,res) { if (err) console.log(err); d.resolve(res); });
      return d.promise;
    })())
    .then(cl0).then(done);

  });

  // TODO update the following test method to use nbind
  // TODO use accounts variable instead of getAccounts
  // TODO add asserts
  it("gets the campaign stage (operation/ended)", function(done) {

    q()
    .then(()=>{
      var d = q.defer();
      c1.stage(function(err,res) { if (err) console.log(err); d.resolve(res); });
      return d.promise;
    }).then(cl0)
    .then(getAccounts)
    .then(function(res) {
      return sendTransaction(res[0],icampaign.address,.5,.1,c1.contributeMsgValue);
    })
    .then(cl)
    .then(getTransactionReceipt).then(cl)
    .then(function() {
      var d = q.defer();
      c1.stage(function(err,res) { if (err) console.log(err); d.resolve(res); });
      return d.promise;
    })
    .then(cl0).then(done);

  });

  // the following test method does not work
  // the object weifund.classes.StandardCampaign.functionHashes['version()']
  // is undefined (it worked at some point)
  // TODO correct the reference to the version() function hash reference
  it.skip("returns the campaign version, version hash approach", function(done) {
    q()
    .then(()=>{
      console.log(weifund.classes.StandardCampaign);
      console.log("*****************");
      var d1 = q.defer();
      var dat = {
        "from":accounts[0],
        "to":icampaign.address,
        "gasPrice": '0x01',
        // TODO Update the following reference, the object is underfined
        "data":weifund.classes.StandardCampaign.functionHashes['version()']
      };
      console.log("dat:",dat);
      web3.eth.call(dat,
        function(err,res) {
          console.log("data");
          console.log(res);
          console.log(err);
          d1.resolve(res);
        });
        return d1.promise;
      })
      .then(cl0)
      .done(done);
    });

    // log filter approach
    it("send 2 transactions to a campaign and gets the corresponding topics using two filter approaches: watch, and get", function(done) {

      var filter;
      var topic;

      q()

      // capture logs through a filter watcher
      .then((res)=>{
        filter = web3.eth.filter();

        filter.watch(function (err, log) {
          if (err) console.error(err);
          assert.ok(err === null, 'Log watch filter reported an error');

          console.log("watch log:",log);
          //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
        });
      })

      // initiate a transaction
      .then((res)=>{
        return sendTransaction(accs[0],icampaign.address,5,.1,campaignInstance.contributeMsgValue);
      }).then(cl)
      .then(getTransactionReceipt).then(cl)

      // ensure that the topic was logged in the transaction receipt
      .then((res)=>{ topic = res.logs[0].topics[0] })
      .then((res)=>{ assert.ok(topic !== undefined, 'Did not log contribution'); })
      // .fail(cle)

      .then(()=>{
        return sendTransaction(accounts[0],icampaign.address,.5,.1,campaignInstance.contributeMsgValue);
      }).then(cl0)

      .then(getAccounts).then(cl)
      .then(function(res) {
        var d = q.defer();
        try {
          var e = campaignInstance.contributionsBySender.call(
            res[0],
            1,
            { "from": res[0] , "to": icampaign.address },
            function(err,res) { console.log("res:"+res); d.resolve(res); });
            return d.promise;
          } catch(e) {
            console.error(e);
          }
          return Q(1);
        }).then(cl0)

        // check filter.get logs, and stop the filter
        .then(function(res) {
          // get all past logs again.
          var myResults = filter.get({ "fromBlock": 0, "toBlock": "pending" },function(error, logs){ console.log("log collection:"); console.log(logs); });
          console.log("myResults",myResults);

          assert.ok(myResults.length > 0, "A log was not retrieved through filter.get");

          // stops and uninstalls the filter
          filter.stopWatching();
        })
        // TODO assert filter result content is correct

        .then(done);
      });
    });
