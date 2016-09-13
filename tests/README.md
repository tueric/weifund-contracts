Description of tests

JS tests using chaithereum. Solidity tests using dapple.
This initial version sets up the JS test framework based on StandardCampaign.
The tests are structured around async calls, with a mix of promises and callbacks.

Run an instance of TestRPC then run: mocha ./tests/package-test.js


Next Steps

1. Change sync calls to contract methods to async
2. Improve assert.oks to instance validation for the following ethereum types:
transaction hash, transaction receipt, address, and others

Future plans

Automatic return type validation for method calls to class instances
Assertion filters added to relevant types
