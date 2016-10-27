import "dapple/test.sol";
import "BalanceClaim.sol";
import "__tests__/MyTestFramework.sol";

contract User {
  function claimBalance(address claim) {
    BalanceClaim(claim).claimBalance();
  }
}

contract BalanceClaimTest is MyTestFramework {
  BalanceClaim target;
  User user;

  function testPass_user() returns (address) {
    user = new User();
    
    // test user balance
    assert(uint256(user.balance) == uint256(0), "User does not have zero balance upon creation");

    return address(user);
  }

  function resetTarget(address _owner) {
    target = new BalanceClaim(_owner);
  }

  function test_claimFromBalanceClaim() {
    testPass_user();

    // reset claim balance target
    resetTarget(address(user));

    assert(uint256(target.balance) == uint256(0), "Claim balance was just created but does not have zero balance");

    // send funds to balance claim
    target.send(60000);
    assert(uint256(target.balance) == uint256(60000), "BalanceClaim does not have expected balance after sending it funds");

    // user claim balance
    user.claimBalance(address(target));
    assert(uint256(target.balance) == uint256(0), "Claiming balance from BalanceClaim instance does not empty its funds");
    assert(uint256(user.balance) == uint256(60000), "Claiming balance from BalanceClaim instance does not send its funds to the user");
  }

  // ensure that the BalanceClaim cannot be reused after claiming its funds
  function testThrow_balanceClaimShouldThrow() {
    test_claimFromBalanceClaim();

    // try to send funds to the already-claimed BalanceClaim instance
    target.send(1);
    assert(uint256(target.balance) == uint256(0), "Could not send funds to ClaimBalance after claiming funds (as expected)");
    
  }

}
