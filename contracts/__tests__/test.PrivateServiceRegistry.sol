import "dapple/test.sol";
import "PrivateServiceRegistry.sol";
import "__tests__/MyTestFramework.sol";

contract TestablePrivateServiceRegistry is PrivateServiceRegistry {
  // super.register is internal so this override makes it available for testing
  function testableRegister(address _service) isNotRegisteredService(_service) returns (uint serviceId) {
    return super.register(_service);
  }


}


contract TestPrivateServiceRegistry is MyTestFramework, PrivateServiceRegistryEvents {
  TestablePrivateServiceRegistry ps;
  PrivateServiceRegistry psreal;

  function test_generatedIds() {
    ps = new TestablePrivateServiceRegistry();
    expectEventsExact(ps);
    
    assert(ps.testableRegister(0x01) == 0, "First registration did not return a registration id of zero");
    ServiceRegistered(0x01);
    
    assert(ps.testableRegister(0x02) == 1, "Second registration did not return a registration id of one");
    ServiceRegistered(0x02);
  }

  function test_registerAgain() {
    test_generatedIds();
    assert(ps.testableRegister(0x01) != 3, "Expected registration id was not obtained, new id given instead");
    assert(ps.testableRegister(0x02) != 0, "The returned serviceid of registering an existing service with id one should not be zero");
    assert(ps.testableRegister(0x03) == ps.testableRegister(0x03), "The re-registration of a service should not return different ids for each invocation, it should idempotent");

    ServiceRegistered(0x03);

    assert(ps.testableRegister(0x03) != ps.testableRegister(0x02), "The registration of two already-registered services should not return equal ids");

  }
  
}
