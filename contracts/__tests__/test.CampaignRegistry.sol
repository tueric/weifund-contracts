import "dapple/test.sol";
import "CampaignRegistry.sol";
import "Owner.sol";
import "__tests__/MyTestFramework.sol";

contract Ownable is Owner {
  function Ownable() {
    owner = msg.sender;
  }
}

contract User {
  function deployCampaign() returns (address) {
    return address(new Ownable());
  }

  function deployInterface() returns (address) {
    return address(new Owner());
  }

  function registerCampaign(address _registry, address _campaign, address _interface) returns (uint256) {
    CampaignRegistry target = CampaignRegistry(_registry);
    return target.register(_campaign, _interface);
  }
}

contract CampaignRegistryTest is MyTestFramework, CampaignRegistryEvents {
  CampaignRegistry target;

  function resetTarget() {
    target = new CampaignRegistry();
  }

  function test_deployment() {
    resetTarget();
    assert(uint256(target.numCampaigns()) == uint256(0), "Campaign registry does not have empty campaign list");
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

    // deploy fake campaign
    address campaign = address(user.deployCampaign());
    address _interface = address(user.deployInterface());


    // test base registry details
    assert(address(campaign) != 0x0, "Campaign does not have address different from 0x0");
    assert(Owner(campaign).owner() == address(user), "Campaign owner not as expected");
    assert(_interface != address(0), "Campaign interface is not set to a real contract address");
    assert(uint256(target.numCampaigns()) == uint256(0), "Campaign registry has non-empty campaign list");

    expectEventsExact(target);

    // test first registration
    assert(uint256(user.registerCampaign(address(target), campaign, _interface)) == uint256(0), "Campaign registration should return id zero");

    CampaignRegistered(campaign, _interface, 0);
    
    assert(uint256(target.numCampaigns()) == uint256(1), "Campaign registry should have one campaign in list");
    assert(target.addressOf(0) == campaign, "Getting campaign with registration id zero from registry should return expected campaign");
    assert(target.interfaceOf(0) == _interface, "Getting campaign interface with registration id zero from zero should return expected interface");
    assert(target.idOf(campaign) == uint256(0), "Campaign should have expected registration id zero");
    assert(target.registeredAt(0) > uint256(0), "Campaign with registration id zero should have a non-zero registration time");

    // test second registration
    User user2 = User(setupUser());

    address campaign2 = address(user2.deployCampaign());
    address interface2 = address(user2.deployInterface());

    assert(uint256(user2.registerCampaign(address(target), campaign2, interface2)) == uint256(1), "Second campaign registration should return registration id one");

    CampaignRegistered(campaign2, interface2, 1);
    
    assert(uint256(target.numCampaigns()) == uint256(2), "second campaign registration should show registry has two campaigns");
    assert(target.addressOf(1) == campaign2, "second registration's address should be the second campaign's address");
    assert(target.interfaceOf(1) == interface2, "second registration's interface should be the second campaign's interface");
    assert(target.idOf(campaign2) == uint256(1), "second campaign should have registration id one");
    assert(target.registeredAt(1) > uint256(0), "second campaign's registration time should be non-zero");

    // test third registration
    User user3 = User(setupUser());

    address campaign3 = address(user3.deployCampaign());
    address interface3 = address(user3.deployInterface());

    assert(uint256(user3.registerCampaign(address(target), campaign3, interface3)) == uint256(2), "Third campaign registration should return registration id two");

    CampaignRegistered(campaign3, interface3, 2);
    
    assert(uint256(target.numCampaigns()) == uint256(3), "third campaign registration should show registry has three campaigns");
    assert(target.addressOf(2) == campaign3, "third registration's address should be the third campaign's address");
    assert(target.interfaceOf(2) == interface3, "third registration's interface should be the third campaign's interface");
    assert(target.idOf(campaign3) == uint256(2), "third campaign should have registration id of two");
    assert(target.registeredAt(2) > uint256(0), "third campaign's registration time should be non-zero");
  }

  function testThrow_doubleRegistration() {
    resetTarget();

    // setup first user, check nominals
    User user = User(setupUser());

    address campaign = address(user.deployCampaign());
    address _interface = address(user.deployInterface());

    // test first registration
    assert(uint256(user.registerCampaign(address(target), campaign, _interface)) == uint256(0), "First registration attempt with campaign should have registration id zero");
    // test second registration
    assert(uint256(user.registerCampaign(address(target), campaign, _interface)) == uint256(0), "Second registration attempt with same campaign should have same registration id as before, registration id zero");
  }

}
