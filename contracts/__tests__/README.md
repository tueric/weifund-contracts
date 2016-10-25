Description of tests

JS tests using mocha and promises. Solidity tests using dapple.
The tests are structured around async calls, with a mix of promises and callbacks.

JS tests require a running instance of TestRPC.

Next Steps

1. Change sync calls to contract methods to async
2. Improve assert.oks to instance validation for the following ethereum types:
transaction hash, transaction receipt, address, and others

Solidity test approaches:
- modifiers
- test extensions
- mutable contracts
- state management
- edge cases
- events

Solidity contract suggestions:
- modifiers should throw if the condition is not satisfied
- address 0x0 should be checked by default
- Owner does not have a default ownerifier function, it has to be built into the subcontract constructor manually
- events should be put into their own contract
- getNow() function should be enabled on now-dependent contracts so that their validity can be introspected and internal timeline can be interacted with


Future plans

Automatic return type validation for method calls to class instances
Assertion filters added to relevant types
