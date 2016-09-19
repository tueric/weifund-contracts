/*

This test class simulates an Owner and checks that owned items can be get and set appropriately.
The test class also simulates an attempt to hide information through custom getters, including 
custom owned getters.

*/

import "dapple/test.sol";
import "Owner.sol";

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

contract OwnerTester is Test {
  OwnedItem o;

  function test_init() {
    o = new OwnedItem();
    assertTrue(o.owner() == address(this));
    assertEq(o.val(), false);
    assertEq(o.getNonOwned(), false);
  }

  function rotateVal() {
    o.setNonOwned(false);
    assertEq(o.val(), false);
    assertEq(o.getNonOwned(), false);

    o.setNonOwned(true);
    assertEq(o.val(), true);
    assertEq(o.getNonOwned(), true);
  }

  // rotates the value to ensure that the value has changed between tests
  // values ends up as true
  // also tests getNonOwned and setNonOwned
  function test_nonOwned() {
    test_init();
    rotateVal();
  }

  // tests owned getter and setter as owner
  function test_owned() {
    test_nonOwned();
    assertTrue(o.owner() == address(this));

    o.setOwned(false);
    assertEq(o.val(), false);
    assertEq(o.getOwned(), false);

    o.setOwned(true);
    assertEq(o.val(), true);
    assertEq(o.getOwned(), true);
  }

  // tests owned getter as non-owner
  function test_getOwnedExpectFailure() {
    test_owned();
    test_nonOwned();
    o.setOwner(0x0);
    assertFalse(o.owner() == address(this));

    // the following should fail
    assertEq(o.val(), true);
    assertEq(o.getOwned(), true);    
  }

  function test_setOwnedExpectFailure() {
    test_owned();
    o.setOwner(0x0);
    assertFalse(o.owner() == address(this));

    rotateVal();

    assertEq(o.val(), true);
    assertFalse(o.setNonOwned(false));
    assertFalse(o.val());

    // the following should fail loudly
    // but it doesn't because if the owner calls the func it returns the default val of the return type
    // this means that for onlyowner funcs that return false, if false is expected then it will always be the case
    // this also means that onlyoner funcs are ever only allowed to return non-default values as guarantees that the owner
    // obtained a valid result
    // it might be better to throw in 'onlyowner' modifier in order to ensure better val and error handling
    assertTrue(o.setOwned(true));    
  }

  function test_setOwnedShouldBeFailure() {
    test_owned();

    test_owned();
    o.setOwner(0x0);
    assertFalse(o.owner() == address(this));

    rotateVal();

    o.setNonOwned(false);
    // the following line correctly tests that val is false
    assertFalse(o.val());
    // the following line correctly tests that val is false
    assertFalse(o.getNonOwned());

    // **incorrect** test that val is false (the actual var value is not returned, only the default bool val - which is false)
    assertFalse(o.getOwned());

    logs("This test does not fail doesn't because onlyowner modifier does not throw");

  }

}