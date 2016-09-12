'use strict';

const weifund = require('../index.js');
const assert = require('assert');
//const BigNumber = require('bignumber.js');
//const jp = require('jsonpath');
const q = require('q');
const util = require('util');

const chaithereum = require('chaithereum');
const expect = chaithereum.chai.expect


//var Web3 = require('web3');
//var web3 = new Web3(provider);
var web3 = chaithereum.web3;

//const chai = require('chai');
//chai.use(require('chai-as-promised'));
//var should = chai.should();

//var startTime = new Date("Wed Aug 24 2016 00:00:00 GMT-0700 (PDT)");

//var TestRPC = require("ethereumjs-testrpc");
// programmatic testrpc
/*
var provider = TestRPC.provider({
//    "accounts":["0x7dd98753d7b4394095de7d176c58128e2ed6ee600abe97c9f6d9fd65015d9b18,1000"],
"time": startTime,
"debug": true
});
*/


var provider = new web3.providers.HttpProvider("http://localhost:8545");
web3.setProvider(provider);



// create an instance of web3 using the HTTP provider.
var accounts = [];
var balances = [];

// get the contract type from web3
var contract = function(typeinterface) {
  return web3.eth.contract(JSON.parse(typeinterface));
};

var getLog = function(res) {
  var d = q.defer();
  console.log(util.inspect(res.logs, false, null));
  d.resolve(res);
  return d.promise;
};

var cle = function(err) {
  console.error(util.inspect(err, { depth: null, colors: true} ));
  return err;
}

// log a big number to the console
var clb = function(bn) {
  return cl(bn.toNumber());
};

// assign the passed parameter to the input var
var cla = function(a) {
  return function (res,err) {
    a = res;
    return a;
  };
};

// log a (header) message before logging the passed parameter
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

var cl0 = function(res,err) {
  console.log(util.inspect(res, { depth: null, colors: true} ));
};

// returns a list of instances by type of contract requested
const getInstancesByType = function(weifund) {
  var d = q.defer();
  jp.query(weifund, '');
  return d.promise;
};

const getTransactionReceipt = function(hash) {
  var d = q.defer();
  web3.eth.getTransactionReceipt(hash, function(err,res) { d.resolve(res); });
  return d.promise;
};

const bv = function(bignumberval) {
  return bignumberval.toString(10);
}

const sendTransaction = function(from, to, amount, gas, i) {
  var d = q.defer();
  var ii = i || web3.eth;
  ii.sendTransaction(
    {
      "from": from,
      "to":to,
      "value":web3.toWei(amount,'ether'),
      "gas":2000000,
      // "gasPrice": 10,
      // "gas":web3.eth.gasPrice*100000 //web3.toWei(gas,'ether')
      // "data": web3.fromAscii("hello")
    },
    function(err, res) {
      if (err)
      console.error(err);
      if (res)
      console.log(res);
      d.resolve(res);
    });
    return d.promise;
  };

  const getBalance = function(o) {
    var dd = q.defer();
    console.log("getting balance for:" + o);
    web3.eth.getBalance(o, 'latest', function(err,res) { if (err) console.error(err); dd.resolve(res); } );
    return dd.promise;
  };

  const getAccounts = function() {
    var d = q.defer();
    web3.eth.getAccounts(function(err,accounts) {
      d.resolve(accounts);
    });
    return d.promise;
  };

  const getBalances = function(list) {
    return q.allSettled(list.map(function(o) {
      return getBalance(o);
    }));
  };

  const simpleCallback = function(res,err) {
    var d = q.defer();
    if (err) console.error(err);
    else d.resolve(res);
    return d.promise;
  };

  var timestampBeforeJump;
  var secondsToJump = 5 * 60 * 60;

  var increaseTime = function(time) {
    console.log("in func");
    const deferred = q.defer()

    provider.sendAsync({ method: 'evm_increaseTime', params: [time] }, function(res,err) {
      if (!err) {
        console.log("in increaseTime");
        provider.sendAsync({ method: 'evm_mine'}, function(res1,err1) {
          if (!err1) {
            console.log("in min");
            deferred.resolve();
          } else {
            console.error(err1);
          }
        });
      } else {
        console.error(err);
      }
    })

    return deferred.promise
  }

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

  var icampaign = weifund.environments['testrpc'].IceCreamRunCampaign;

  before(() => {
    //const deploy = require('../deploy.js');
    return chaithereum.promise
  });

  describe('user story tests', function() {
    it('gets the balances of all accounts', function(done) {
      //this.timeout(200000);
      //    getAccountBalances().done(function(res,err) { if (err) { console.log('err'); console.log(err); } console.log("hhhh"); console.log(res); console.log(accounts); console.log(balances); done();});

      //console.log("Accounts:");

      // Definition: method vs function
      // method - function defined as a property of an object
      // function - function defined as function alone

      // working single function promise - retrieve all accounts from web3 with whatever provider has been supplied
      //getAccounts().then(function(res,err) { accounts = res; } ).done(function(res,err) { console.log(accounts); done(); });

      // working chained promises - retrieve all accounts and get the balance of the first one
      //getAccounts().then(function(res,err) { console.log(res); console.log(res[0]); return getBalance(res[0]); }).then(function(res,err) { console.log(res); });

      // shorter version of immediate above
      //getAccounts().then(function(res,err) { return getBalance(res[0]); }).then(cl);

      // long version of getbalances
      //getAccounts().then(function(res,err) { return getBalances(res); }).then(cl).then(done);

      // shortest version of getbalances
      getAccounts().then(getBalances).then(cl).then(o=>o[0]).should.eventually.be.ok.notify(done);

    });

    it("sends a transaction from one user account to another", function(done) {
      // turn this into a real test
      getAccounts().then(getBalances).then(cl).then(getAccounts)
      .then(function(res,err) { return sendTransaction(res[0],res[1],1,1); }).then(cl)
      .then(getTransactionReceipt).then(cl)
      .then(getAccounts).then(getBalances).then(cl0)
      .done(done);

      //console.log(util.inspect(weifund, false, null))

    });

    it("checks that a campaign's balance is zero", function(done) {
      // using regular asserts
      //    q(icampaign.address).then(getBalance).then(function(o) { return o.toString(10); }).then(cl).then(function(res) { console.log(res); try { assert.ok(res>0); } catch(e) { console.log(e); } return res; }).then(function(res,err) { console.log(res); console.log(err); }).then(done);
      // using chai-as-promised
      //    q(icampaign.address).then(getBalance).then(function(o) { return o.toString(10); }).then(cl).should.eventually.equal('0').notify(done);
      // worked
      q(icampaign.address).then(getBalance).then(cl).then(bv).should.eventually.be.bignumber.equal(0).notify(done);

    });

    it("sends a transaction from one user account to a campaign", function(done) {
      q(icampaign.address).then(cl).then(getBalance).then(cl0)
      .then(getAccounts).then(cl).then(function(res) {
        return sendTransaction(res[0],icampaign.address,1,1);
      }).then(cl)
      .thenResolve(icampaign.address).then(cl).then(getBalance).then(cl).then(bv)
      .should.eventually.be.bignumber.above(0).notify(done);
    });

    it("sends a transaction to a campaign and receives a transaction receipt", function(done) {
      getAccounts().then(function(res) {
        const c = contract(weifund.classes.StandardCampaign.interface);
        const c1 = c.at(icampaign.address);
        return sendTransaction(res[0],icampaign.address,.5,.1,c1.contributeMsgValue);
      }).then(cl)
      .then(getTransactionReceipt).then(cl)
      .should.eventually.be.ok.notify(done);
    });

    it("tests how promises work with strings", function(done) {
      q("hello").then(cl0).thenResolve(q("boo")).then(cl0).then(done);
    });

    it("chaithereum tests of different accounts from web3 provider", function(done) {
      // turn this into a real test
      var v = {};
      //q(v.v1 = chaithereum.accounts).then(cl).then(getAccounts).then(cl).then(r=>{ (v.v2 = r) }).thenResolve(v).then(cl).then(assert.deepEqual(v.v1,v.v2)).then(done);
      //q(v.v1 = chaithereum.accounts).then(cl).then(getAccounts).then(cl).then(r=>{ (v.v2 = r) }).thenResolve(v).then(cl).then(o=>{ console.log(v.v1); console.log(v.v2); try {expect(v.v1).to.deep.equal(v.v2); } catch(e) {console.error(e);} done(); }).then(cl0);
      q(v.v1 = chaithereum.accounts).then(cl).then(getAccounts).then(cl).then(r=>{ (v.v2 = r) }).thenResolve(v).then(cl).then(q.try(()=>{ assert.deepEqual(v.v1,v.v2); }).catch(function(err) {console.error(err);})).then(cl0).then(done);

      //	    expect(chaithereum.accounts).to.be.an('array')
      //    expect(chaithereum.accounts).to.have.length(10);
      //done();

    });

    it("sends two contributions to a campagin and retrieves the contribution ids", function(done) {
      this.timeout(2000000);
      const c = contract(weifund.classes.StandardCampaign.interface);
      const con = c.at(icampaign.address);
      var acc;
      getAccounts().then(function(res) {
        return sendTransaction(res[0],icampaign.address,.5,.1,con.contributeMsgValue);
      }).then(cl)
      .then(getTransactionReceipt).then(cl0)
      .then(getAccounts)
      .then(function(res) {
        console.log("second transaction:", res);
        return sendTransaction(res[0],icampaign.address,.5,.1,con.contributeMsgValue);
      }).then(cl)
      .then(getTransactionReceipt).then(cl0)
      .then(getAccounts)
      .then(function(res) {
        var d = q.defer();
        var ret = [];
        for (var i = 0; i < con.totalContributionsBySender(res[0]); i++) {
          var cid = con.contributionsBySender(res[0],i);
          ret.push(cid);
          console.log(cid);
        }
        d.resolve(ret);
        return d.promise;
      })
      .then(function(res) {
        var d = q.defer();
        var ret = [];
        for (var i = 0; i < res.length; i++) {
          ret.push(con.contributions(res[i]));
        }
        d.resolve(ret);
        return d.promise;
      }).then(cl0).then(done);
    });

    // good
    it("checks that a campaign can reach its funding goal", function(done) {
      const c = contract(weifund.classes.StandardCampaign.interface);
      const con = c.at(icampaign.address);

      q()
      .then(function(res) { console.log("expiry:"+con.expiry()); })

      // .then(o=>{ console.log("getstageat:" + con.getStageAt().toNumber()); })

      // assert that the stage is 0 (operational)
      .then(o=>{ console.log(con.stage().toNumber()); return con.stage().toNumber() })
      .then(cl)
      .then(function(res) { assert.ok(res == 0, 'Campaign stage is not set to operational'); })
      .fail(cle)

      .then(o=>{ console.log("now:" + con.getNow().toNumber()); })
      .then(o=>{ console.log("funding goal:"+con.fundingGoal().toNumber()); })
      .then(o=>{ console.log("amount raised:"+con.amountRaised().toNumber()); })

      // send an transaction that makes campaign reach funding goal
      .then(getAccounts)
      .then(cl)
      .then(res=>{return sendTransaction(res[0],icampaign.address,1,.1,con.contributeMsgValue);})
      .then(cl)

      .then(o=>{ console.log("amount raised:"+con.amountRaised().toNumber()); })

      // expire the campaign
      //    .then(function() { try{ return increaseTime(2000000); } catch(e) {console.error(e); return 0;}})

      .then(o=>{ console.log("getstageat:" + con.getStageAt().toNumber()); })
      .then(o=>{ console.log("now:" + con.getNow().toNumber()); })

      // assert that the stage is 0 (operational, funding goal reached)
      // it should be this way because stage is only updated on a transaction call
      // not blockchain time or block property updates
      // However, it is suggested that a function be available to update the stage independently of transaction processing
      // i.e.,
      .then(o=>{ console.log(con.stage().toNumber()); return con.stage().toNumber() })
      .then(cl)
      .then(res=>{ assert.ok(res == 0, 'Campaign stage is not set to not operational and goal reached'); })
      .fail(cle)

      // trigger the campaign stage to be updated, the only way to do that successfully right now is by being the owner and calling payout when successful
      // assert that a transaction receipt was issued
      .then(getAccounts)
      .then(res=>{ sendTransaction(res[0],icampaign.address,1,.1,con.payoutToBeneficiary); })
      .then(cl)
      .then(function(res) { assert.ok(res !== undefined, 'payout to beneficiary did not succeed with a transaction receipt'); })
      .fail(cle)

      .then(o=>{ console.log("getstageat:" + con.getStageAt().toNumber()); })

      // assert that the stage is 2 (not operational, funding goal reached)
      .then(o=>{ return con.stage() })
      .then(function(res) { assert.ok(res.value == 2, 'Campaign stage is not set to not operational and goal reached'); })
      .fail(cle)

      .then(done);

    });

    // good
    it("checks the status of the campaign after a time delay", function(done) {
      //this.timeout(40000);
      const c = contract(weifund.classes.StandardCampaign.interface);
      const con = c.at(icampaign.address);

      q()
      .then(function(res) { console.log(con.expiry()); })

      .then(function(res) { console.log(con.stage()); })
      // TODO assert that stage is 0

      // make an initial contribution
      .then(getAccounts)
      .then(function(res) {
        return sendTransaction(res[0],icampaign.address,.5,.1,con.contributeMsgValue);
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
      const c = contract(weifund.classes.StandardCampaign.interface);
      const c1 = c.at(icampaign.address);
      q((function() {
        var d = q.defer();
        c1.expiry(function(err,res) { if (err) console.log(err); d.resolve(res); });
        return d.promise;
      })()).then(cl0).then(done);

    });

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

    it("gets the campaign stage (operation/ended)", function(done) {
      const c = contract(weifund.classes.StandardCampaign.interface);
      const c1 = c.at(icampaign.address);
      q((function() {
        var d = q.defer();
        c1.stage(function(err,res) { if (err) console.log(err); d.resolve(res); });
        return d.promise;
      })())
      .then(cl0)
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



    // working test that returns a campaign version
    it("returns the version, easy", function(done) {
      const c = contract(weifund.classes.StandardCampaign.interface);
      const c1 = c.at(icampaign.address);
      q((function() {
        var d = q.defer();
        c1.version(function(err,res) { if (err) console.log(err); d.resolve(res); });
        return d.promise;
      })()).then(cl).should.eventually.equal("1.0.0").notify(done);

    });

    it("returns the campaign version, complex", function(done) {
      this.timeout(50000);
      var accounts;
      var con;
      q((function() {
        var d = q.defer();
        const c = contract(weifund.classes.StandardCampaign.interface);
        const c1 = c.at(icampaign.address);
        con = c1;
        d.resolve(c1);
        return d.promise;
      })())
      .then(getAccounts)
      .then(function(res) {
        var d2 = q.defer();
        accounts = res;
        d2.resolve(res);
        return d2.promise;
      })
      .then(function() {
        // console.log(util.inspect(weifund.classes.StandardCampaign.functionHashes['version()'],null));
        console.log("here");
        var d1 = q.defer();
        //	    d1.resolve("1");
        var dat = {
          "from":accounts[0],
          "to":icampaign.address,
          "gasPrice": '0x01',
          "data":weifund.classes.StandardCampaign.functionHashes['version()']
        };
        console.log("dat:",dat);
        web3.eth.call(
          dat
          , function(err,res) {
            console.log("data");
            console.log(res);
            console.log(err);
            d1.resolve(res);
          });

          /*
          c.version.call(function(err,res){
          console.log("here1",res);
          d1.resolve(res);
        });
        */
        return d1.promise;
      })
      .then(cl0).then(done);
    });

    it.only("send 2 transactions to a campaign and gets the corresponding contribtion ids", function(done) {

      const c = contract(weifund.classes.StandardCampaign.interface);
      const con = c.at(icampaign.address);
      var accs;
      var filter;
      var topic;

      q(icampaign.address).then(clm('campaign address:'))

      .then(getAccounts)//.then(cla(accs)).then(clm('accounts:'))
      .then(function(res) { accs=res; clm('accounts:')(res); return res; })

      // capture logs
      .then(function(res) {
        filter = web3.eth.filter();

        filter.watch(function (err, log) {
          if (err) console.error(err);

          console.log("watch log:",log);
          //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
        });
      })

      .then(function(res) {
        return sendTransaction(accs[0],icampaign.address,5,.1,con.contributeMsgValue);
      }).then(cl)
      .then(getTransactionReceipt).then(cl)

      // verify that the topic was logged in the transaction receipt
      .then(function(res) { topic = res.logs[0].topics[0] })
      .then(function(res) { assert.ok(topic !== undefined, 'Did not log contribution'); })
      .fail(cle)

      .then(getAccounts)
      .then(function(res) {
        return sendTransaction(res[0],icampaign.address,.5,.1,con.contributeMsgValue);
      }).then(cl0)

      .then(getAccounts).then(cl)
      .then(function(res) {
        var d = q.defer();
        try {
          var e = con.contributionsBySender.call(
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

        .then(done);
        //	    .should.eventually.be.ok.notify(done);
      });
    });



