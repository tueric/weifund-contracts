/*

This test class simulates an Owner and checks that owned items can be get and set appropriately.
The test class also simulates an attempt to hide information through custom getters, including 
custom owned getters.

*/

import "dapple/test.sol";
import "Owner.sol";
import "__tests__/MyTestFramework.sol";

contract OwnedItem is Owner {
  function OwnedItem() {
    owner = msg.sender;
  }
  function setOwner(address _owner) {
    owner = _owner;
  }

  bool public val = false;

  // getter methods

  // getter for nonowned objects
  function getNonOwned() returns (bool innerVal) {
    innerVal = val;
  }

  // getter for owned objects
  function getOwned() onlyowner returns (bool innerVal) {
    innerVal = getNonOwned();
  }

  // setter methods

  // setter for nonowned objects
  function setNonOwned(bool _val) returns (bool newval) {
    val = _val;
    newval = val;
  }

  // setter for owned objects
  function setOwned(bool _val) onlyowner returns (bool newval) {
    newval = setNonOwned(_val);
  }

}

contract OwnerTester is MyTestFramework {
  OwnedItem o;

  function testPass_init() {
    o = new OwnedItem();
    assert(o.owner() == address(this), "Newly created OwnedItem does not have the correct owner");
    assert(o.val() == false, "OwnedItem's initial val should be false");
    assert(o.getNonOwned() == false, "OwnedItem's intial val's getter should return false");
  }

  // rotates val to false then to true to ensure that the value has changed between tests
  function rotateVal() {
    o.setNonOwned(false);
    assert(o.val() == false, "OwnedItem's val should be false after setting to false");
    assert(o.getNonOwned() == false, "OwnedItem's val getter should return false");

    o.setNonOwned(true);
    assert(o.val() == true, "OwnedItem's val should be true after setting to true");
    assert(o.getNonOwned() == true, "OwnedItem's val getter should return true");
  }


  // also tests getNonOwned and setNonOwned
  function testPass_nonOwned() {
    testPass_init();
    rotateVal();
  }

  // tests owned getter and setter as owner
  function testPass_owned() {
    testPass_nonOwned();
    assert(o.owner() == address(this), "OwnedItem should have this as owner");

    o.setOwned(false);
    assert(o.val() == false, "'this' should be able to set OwnedItem's val to false, but its val is not false");
    assert(o.getOwned() == false, "'this' should be able to get OwnedItem's val");

    o.setOwned(true);
    assert(o.val() == true, "'this' should be able to set owned val to true");
    assert(o.getOwned() == true, "'this' should be able to get owned val as true");
  }

  // tests owned getter as non-owner
  function testThrow_getOwnedExpectFailure() {
    testPass_nonOwned();
    testPass_owned();
    o.setOwner(0x0);
    assert(o.owner() == 0x0, "Testable OwnedItem owner was not able to be set to 0x0");

    // the following should fail
    assert(o.val() == true, "Testable OwnedItem's val is not true as expected");
    assert(o.getOwned() == true, "Testable OwnedItem's val getter cannot be used since the owner is not 'this', as expected");    
  }

  function testThrow_setOwnedExpectFailure() {
    testPass_owned();
    o.setOwner(0x0);
    assert(o.owner() != address(this), "OwnedItem's owner could not be set to 0x0");

    rotateVal();

    assert(o.setNonOwned(false) == false, "Was not able to set non-owned val");
    assert(o.val() == false, "Non-owned val could not be set to false");

    // the following should fail loudly
    // but it doesn't because if the owner calls the func it returns the default val of the return type
    // this means that for onlyowner funcs that return false, if false is expected then it will always be the case
    // this also means that onlyoner funcs are ever only allowed to return non-default values as guarantees that the owner
    // obtained a valid result
    // it might be better to throw in 'onlyowner' modifier in order to ensure better val and error handling
    assert(o.setOwned(true) == true, "OwnedItem should throw when setting an owned val since the owner is not correct, but doesn't since 'onlyowner' modifier does not throw (it should)");    
  }

  function testThrow_setOwnedWhenNotOwnerOnlyownerModifierShouldFailButDoesntInsteadItFailsCuzItFailsToThrow() {
    testPass_owned();

    o.setOwner(0x0);
    assert(o.owner() != address(this), "Could not set owner to 0x0");

    rotateVal();

    assert(o.setNonOwned(false) == false, "Could not set non-owned val to false");
    // the following line correctly tests that val is false
    assert(o.val() == false, "val getter reports val is not set to false");
    // the following line correctly tests that val is false
    assert(o.getNonOwned() == false, "Non-owned val getter does not report that val is set to false");

    // test that val is false (the actual var value is not returned, only the default bool val - which is false)
    // IMPORTANT: this test highlights that since 'onlyowner' modifier does not throw, the value returned is not actually 'val' but false since the function could not actually set the method's return value
    assert(o.getOwned() == false, "The owned val getter did not return false as expected");

    logs("This test is set to fail manually, and the failure isn't triggered by the 'onlyowner' modifier since the modifier does not throw - it should, otherwise getters that are accessed by non-owners don't get a correct return value and hides errors in logic expected by owners");

  }

}