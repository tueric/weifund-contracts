import "dapple/test.sol";
import "CampaignDataRegistry.sol";
import "Owner.sol";

contract User {
  function createCampaign() returns (address) {
    return address(new Owner());
  }

  function registerCampaign(address _registry, address _campaign, bytes _data) {
    CampaignDataRegistry target = CampaignDataRegistry(_registry);
    target.register(_campaign, _data);
  }
}

contract CampaignDataRegistryTest is Test {
  event CampaignDataRegistered(address _campaign);
  CampaignDataRegistry target;

  function resetTarget() {
    target = new CampaignDataRegistry();
  }

  function testEvents_campaignDataRegistry() {
    // reset registry target
    resetTarget();

    // build new user
    User user = new User();
    user.send(3000000);

    // new campaign
    address campaign = user.createCampaign();
    assertTrue(bool(campaign != address(0)));

    // expect events
    expectEventsExact(target);

    // register new campaign with bytes data
    CampaignDataRegistered(campaign);

    // register campaign
    user.registerCampaign(address(target), campaign, "");
  }
}
