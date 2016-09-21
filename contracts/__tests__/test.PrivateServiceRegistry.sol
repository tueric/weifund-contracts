import "dapple/test.sol";
import "PrivateServiceRegistry.sol";

contract TestablePrivateServiceRegistry is PrivateServiceRegistry {
  function testableRegister(address _service) isNotRegisteredService(_service) returns (uint serviceId) {
    return super.register(_service);
  }


}


contract TestPrivateServiceRegistry is Test {
  TestablePrivateServiceRegistry ps;

  function test_generatedIds() {
    ps = new TestablePrivateServiceRegistry();
    assertTrue(ps.testableRegister(0x01) == 0);
    assertTrue(ps.testableRegister(0x02) == 1);
  }

  function test_registerAgain() {
    test_generatedIds();
    assertFalse(ps.testableRegister(0x01) == 3);
  }

  function test_registerAgainShouldFail() {
    test_registerAgain();
    assertTrue(ps.testableRegister(0x02) == 0);
    logs("The returned serviceid of registering an existing service with id 1 should not be 0");
  }
}
