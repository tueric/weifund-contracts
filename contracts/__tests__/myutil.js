/*

This utility class contains logging and blockchain rpc methods

This utility class is dependent on web3, util, and 
*/

const util = require('util');

// get the contract type from web3
// TODO determine whether this function needs to be in this utility class
const contract = function(typeinterface) {
  return web3.eth.contract(JSON.parse(typeinterface));
};

// log error
const logErrorThen = function(err) {
  console.error(util.inspect(err, { depth: null, colors: true} ));
  return err;
};

// log a big number to the console
/*
var clb = function(bn) {
  return cl(bn.toNumber());
};
*/


// simple passthrough logging function
const logThen = function(res,err) {
  //    console.log(res);
  if (res) {
    console.log(util.inspect(res, { depth: null, colors: true} ));
  }
  if (err) {
    console.error(util.inspect(err, { depth: null, colors: true} ));
  }
  return res;
};

// log message m before callback
// useful for logging after an earlier promised callback resolves/completes
// (thus logging m before logging the earlier callback result)
const logAfterResolve = function(m) {
  return function(res,err) {
    console.log(m);
    return logThen(res,err);
  };
};

// non-passthrough logging function
const logEnd = function(res) {
  console.log(util.inspect(res, { depth: null, colors: true} ));
};

// bignumber util tostring base 10
const convertBigNumberToBase10 = function(bignumberval) {
  return bignumberval.toString(10);
};

// transaction promise utilities

// generic promise of send transaction via instance method i
const sendTransaction = function(from, to, amount, gas, i) {

  var d = q.defer();
  var ii = i || web3.eth;
  ii.sendTransaction({
    'from': from,
    'to': to,
    'value': web3.toWei(amount,'ether'),
    'gas': 2000000,
    // 'gasPrice': 10,
    // 'gas':web3.eth.gasPrice*100000 //web3.toWei(gas,'ether')
    // 'data': web3.fromAscii('hello')
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
  // console.log('getting balance for:' + o);
  web3.eth.getBalance(o, 'latest', function(err,res) { if (err) console.error(err); d.resolve(res); } );
  return d.promise;
};

// get promised balances for list of balances
const getBalances = function(list) {
  // console.log('getBalances:',list);
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

var web3, q;

const setup = function(_web3, _q) {
  web3 = _web3;
  q = _q;
};

module.exports = {
  setup: setup,
  web3: web3,
  q: q,
  contract: contract,
  getAccounts: getAccounts,
  getBalances: getBalances,
  getBalance: getBalance,
  getTransactionReceipt: getTransactionReceipt,
  sendTransaction: sendTransaction,

  convertBigNumberToBase10: convertBigNumberToBase10,
  logEnd: logEnd,
  logAfterResolve: logAfterResolve,
  logThen: logThen,
  logErrorThen: logErrorThen  

};
