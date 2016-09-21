import "dapple/test.sol";
import "CampaignRegistry.sol";
import "Owner.sol";

contract User {
  function deployCampaign() returns (address) {
    return address(new Owner());
  }

  function deployInterface() returns (address) {
    return address(new Owner());
  }

  function registerCampaign(address _registry, address _campaign, address _interface) returns (uint256) {
    CampaignRegistry target = CampaignRegistry(_registry);
    return target.register(_campaign, _interface);
  }
}

contract CampaignRegistryTest is Test {
  CampaignRegistry target;

  function resetTarget() {
    target = new CampaignRegistry();
  }

  function test_deployment() {
    resetTarget();
    assertEq(uint256(target.numCampaigns()), uint256(0));
  }

  function setupUser() returns (address) {
    User user = new User();
    user.send(2);
    return address(user);
  }

  function test_threeCampaignRegistrations() {
    resetTarget();

    // setup first user, check nominals
    User user = User(setupUser());

    address campaign = address(user.deployCampaign());
    address interface = address(user.deployInterface());


    // test base registry details
    assertTrue(address(campaign) != 0x0);
    return;
    assertTrue(Owner(campaign).owner() == address(user));
    assertTrue(bool(interface != address(0)));
    assertEq(uint256(target.numCampaigns()), uint256(0));

    // test first registration
    assertEq(uint256(user.registerCampaign(address(target), campaign, interface)), uint256(0));
    assertEq(uint256(target.numCampaigns()), uint256(1));
    assertEq(target.addressOf(0), campaign);
    assertEq(target.interfaceOf(0), interface);
    assertEq(target.idOf(campaign), uint256(0));
    assertTrue(bool(target.registeredAt(0) > uint256(0)));

    // test second registration
    User user2 = User(setupUser());

    address campaign2 = address(user2.deployCampaign());
    address interface2 = address(user2.deployInterface());

    assertEq(uint256(user2.registerCampaign(address(target), campaign2, interface2)), uint256(1));
    assertEq(uint256(target.numCampaigns()), uint256(2));
    assertEq(target.addressOf(1), campaign2);
    assertEq(target.interfaceOf(1), interface2);
    assertEq(target.idOf(campaign2), uint256(1));
    assertTrue(bool(target.registeredAt(1) > uint256(0)));

    // test second registration
    User user3 = User(setupUser());

    address campaign3 = address(user3.deployCampaign());
    address interface3 = address(user3.deployInterface());

    assertEq(uint256(user3.registerCampaign(address(target), campaign3, interface3)), uint256(2));
    assertEq(uint256(target.numCampaigns()), uint256(3));
    assertEq(target.addressOf(2), campaign3);
    assertEq(target.interfaceOf(2), interface3);
    assertEq(target.idOf(campaign3), uint256(2));
    assertTrue(bool(target.registeredAt(2) > uint256(0)));
  }

  function testThrow_doubleRegistration() {
    resetTarget();

    // setup first user, check nominals
    User user = User(setupUser());

    address campaign = address(user.deployCampaign());
    address interface = address(user.deployInterface());

    // test first registration
    assertEq(uint256(user.registerCampaign(address(target), campaign, interface)), uint256(0));
    assertEq(uint256(user.registerCampaign(address(target), campaign, interface)), uint256(0));
  }
}
