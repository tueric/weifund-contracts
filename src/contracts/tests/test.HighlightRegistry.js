/* eslint-disable */

const contracts = require('../../lib/classes.json');
const chaithereum = require('chaithereum');
const Q = require ('q');

before(() => chaithereum.promise);

function initializeHighlightRegistry (arg){
    it('successfully instantiates target with blank params', () => {
        return chaithereum
            .web3.eth.contract(JSON.parse(contracts.HighlightRegistryWrapper.interface))
            .new.q({from: chaithereum.accounts[0], data: contracts.HighlightRegistryWrapper.bytecode })
            .should.eventually.be.contract.then((_highlightRegistry) => {
                arg.highlightRegistry = _highlightRegistry;
            }).should.eventually.be.fulfilled;
    });
}


function runHighlightRegistryTests (arg){
    let highlightRegistry;
    it ('get the registry from argument', () => {
        highlightRegistry = arg.highlightRegistry;
    });

    it ('register valid address', () => {
        return highlightRegistry
            .register.q(chaithereum.accounts[1], { from: chaithereum.accounts[0] }).should.eventually.be.fulfilled
            .then(() => {
                return highlightRegistry.activePicks.q(chaithereum.accounts[1]).should.eventually.be.true;
            })
        .then(() => {
            return highlightRegistry.pickedCampaigns.q(0).should.eventually.be.address.equal(chaithereum.accounts[1]);
        });
    });

    it ('unregister camapign', () => {
        return highlightRegistry.activePicks.q(chaithereum.accounts[1]).should.eventually.be.true
            .then ( () => {return highlightRegistry.pickedCampaigns.q(0).should.eventually.be.address.equal(chaithereum.accounts[1])})
            .then ( () => {return highlightRegistry.unregister.q(chaithereum.accounts[1], {from: chaithereum.accounts[0]})})
            .then ( () => {return highlightRegistry.activePicks.q(chaithereum.accounts[1]).should.eventually.be.false})
            .then ( () => {return highlightRegistry.pickedCampaigns.q(0).should.eventually.be.address.equal(chaithereum.accounts[1])});
    });
}

describe('HighlightRegistry', () => {
    let args = {};
    initializeHighlightRegistry(args);
    runHighlightRegistryTests(args);
});

