import "dapple/test.sol";
import "PrivateServiceRegistry.sol";

contract User {
}

contract PublicServiceRegistry is PrivateServiceRegistry {
  function registerService(address _service) public {
    register(_service);
  }
}

contract BalanceClaimTest is Test {
  PublicServiceRegistry target;
  User user;

  function setupUser() returns (address) {
    user = new User();
    return address(user);
  }

  function resetTarget() {
    target = new PublicServiceRegistry();
  }

  function test_register() {
    setupUser();
    resetTarget();
  }
}
