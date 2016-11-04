pragma solidity ^0.4.3;

import "dapple/test.sol";
import "BalanceClaim.sol";

contract User {
  function claimBalance(address claim) {
    BalanceClaim(claim).claimBalance();
  }
}

contract BalanceClaimTest is Test {
  BalanceClaim target;

  function setupUser() returns (address) {
    User user = new User();

    return address(user);
  }

  function resetTarget(address _owner) {
    target = new BalanceClaim(_owner);
  }

  function test_user() {
    User user = User(setupUser());
    assertEq(uint256(user.balance), uint256(0));
  }

  /// @notice non owner claim attempt during send
  function test_claimAttemptDuringSend() {
  }

  /// @notice non owner claim attempt after send
  function test_invalidClaimAttempt() {}

  /// @notice test balance claim functions
  function test_balanceClaim() {
    // setup user
    User user = User(setupUser());

    // test base
    assertEq(uint256(user.balance), uint256(0));

    // reset claim balance target
    resetTarget(address(user));

    // test base
    assertEq(uint256(target.balance), uint256(0));

    // send funds to balance claim
    if (target.send(60000)) {
    }
    assertEq(uint256(target.balance), uint256(60000));

    // user claim balance
    user.claimBalance(address(target));
    assertEq(uint256(target.balance), uint256(0));
    assertEq(uint256(user.balance), uint256(60000));
  }
}
