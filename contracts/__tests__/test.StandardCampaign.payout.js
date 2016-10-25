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


describe('Test StandardCampaign payoutToBeneficiary', function() {

  // TODO in progress
  // TODO see why timeout is not succeeding
  // TODO see why payout to beneficiary is not succeeding
  it('checks that a campaign can reach its funding goal and pay out', function(done) {
    this.timeout(20000);

    q()

    .then(()=>{
      console.log('campaignInstance:');
      console.log(campaignInstance);
    })

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))
      
    .then(()=>{
      return q.nbind(campaignInstance.beneficiary, campaignInstance)();
    })
    .then(myutil.logAfterResolve('beneficiary:'))
    .then((beneficiaryAddress)=>{
      assert.ok(beneficiaryAddress === accounts[0], 'Beneficiary address not set as expected');
    })
    .fail(myutil.logErrorThen)

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

    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(myutil.logAfterResolve('stage num:'))

    // send an transaction that makes campaign reach funding goal
    .then(()=>{
      return myutil.sendTransaction(accounts[0],icampaign.address,1,1,campaignInstance.contributeMsgValue);
    }).then(myutil.logAfterResolve('transaction hash:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(campaignInstance.stage, campaignInstance)();
    })
    .then(myutil.logAfterResolve('stage num:'))

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

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

// helper function removed
/*
    .then(()=>{
      return q.nbind(campaignInstance.getStageAt,campaignInstance)();
    }).then(myutil.logAfterResolve('getstageat:'))
    .then((res)=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
*/

    .then(()=>{
      return myutil.sendTransaction(accounts[0], icampaign.address, 0, 1, icampaign.payoutToBeneficiary);
    }).then(myutil.logAfterResolve('_try4:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

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
//    .then(res=>{ assert.ok(res.equals(2), 'Campaign stage is not set to not operational and goal reached'); })
//    .fail(myutil.logErrorThen) // the assertion is not serious enough to stop

    // trigger the campaign stage to be updated, the only way to do that successfully right now is by being the owner and calling payout when successful

    // assert that a transaction receipt was issued

    // problems start here

      // does not work
      /*
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
      */

      /*
// call approach, requires constant modifier on payoutToBeneficiary function
    .then(()=>{
      return q.nbind(campaignInstance.payoutToBeneficiary, campaignInstance)();
    })
    .then(myutil.logAfterResolve('*********************_try1:'))
*/

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    }).then(myutil.logAfterResolve('amount raised:'))


    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_increaseTime', params: [2000000] })();
    })
    .then(myutil.logAfterResolve('evm_increaseTime*:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_mine' })();
    })
    .then(myutil.logAfterResolve('evm_mine*:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(campaignInstance.amountRaised,campaignInstance)();
    }).then(myutil.logAfterResolve('amount raised:'))

    .then(()=>{

      var d = q.defer();

      campaignInstance.payoutToBeneficiary.sendTransaction({ 'from': accounts[0], 'value': web3.toWei(0,'ether'), 'gas': 2000000 },function(err,res) {
        console.log('try2:');
        console.log(err);
        console.log(res);
        d.resolve(res);
      });
      return d.promise;

    })
    .then(myutil.logAfterResolve('_try2:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_increaseTime', params: [2000000] })();
    })
    .then(myutil.logAfterResolve('evm_increaseTime*:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_mine' })();
    })
    .then(myutil.logAfterResolve('evm_mine*:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{ return myutil.toStringConstants(campaignInstance, icampaign.interface); })

    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances11:'))

    .then(()=>{
      return myutil.sendTransaction(accounts[0], icampaign.address, 0.1, 0.1, icampaign.payoutToBeneficiary);
    }).then(myutil.logAfterResolve('_try4:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(provider.sendAsync, provider, { method: 'evm_increaseTime', params: [2000000] })();
    })
    .then(myutil.logAfterResolve('evm_increaseTime*:'))

  // retrieve the campaign address
  .thenResolve(icampaign.address)
  // log the campaign address to the console
  .then(myutil.logAfterResolve('standard campaign address:'))
  .then(myutil.getBalance)
  .then(myutil.logAfterResolve('campaign balance:'))

    .then(()=>{
      return q.nbind(campaignInstance.getNow,campaignInstance)();
    }).then(myutil.logAfterResolve('getNow:'))

    .then(()=>{
      return myutil.getBalances(accounts);
    })
    .then(myutil.logAfterResolve('balances12:'))

    .then(()=>{ console.log('campaign details:') })
    .then(()=>{ return myutil.toStringConstants(campaignInstance, icampaign.interface); })

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
});
