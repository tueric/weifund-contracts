/* eslint-disable */

const contracts = require('../../lib/classes.json');
const chaithereum = require('chaithereum');

before(() => chaithereum.promise);

describe('BalanceClaim', () => {
  let balanceClaim;
  let accountTarget;

  it('successfully instantiates target with blank params', () => {
    return chaithereum
    .web3.eth.contract(JSON.parse(contracts.BalanceClaim.interface))
    .new.q(chaithereum.account, { data: contracts.BalanceClaim.bytecode })
    .should.eventually.be.contract.then((_balanceClaim) => {
      balanceClaim = _balanceClaim;
    }).should.eventually.be.fulfilled;
  });

  it ('should have owner', () => {
  });

  it ('has a balance of zero', () => {
    chaithereum.web3.eth.getBalance.q(balanceClaim.address).should.eventually.be.bignumber.equal(0);
  });

  it ('has a balance of 5000', () => {
    chaithereum.web3.eth.sendTransaction.q({from: chaithereum.account, to: balanceClaim.address, value: 5000}).should.be.fulfilled;
  });

  it ('successfully claims balance of 5000 to rightful owner', () => {
  });

  it ('has a balance of zero', () => {
  });
});
