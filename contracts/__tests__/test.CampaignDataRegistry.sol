import "dapple/test.sol";
import "CampaignDataRegistry.sol";
import "Owner.sol";
import "__tests__/MyTestFramework.sol";

contract FakeCampaign is Owner {
  function FakeCampaign() {
    owner = msg.sender;
  }
}

contract User {
  function createCampaign() returns (address) {
    return address(new FakeCampaign());
  }

  function registerCampaign(address _registry, address _campaign, bytes _data) {
    CampaignDataRegistry target = CampaignDataRegistry(_registry);
    target.register(_campaign, _data);
  }
}

contract CampaignDataRegistryTest is MyTestFramework, CampaignDataRegistryEvents {
  CampaignDataRegistry target;

  function resetTarget() {
    target = new CampaignDataRegistry();
  }

  function testEvents_campaignDataRegistry() {
    // reset registry target
    resetTarget();

    // build new user
    User user = new User();
    

    // new (fake) campaign
    address campaign = user.createCampaign();
    assert(bool(campaign != address(0)), "Campaign address 0x0");

    // expect events
    expectEventsExact(target);

    // register new campaign with bytes data
    CampaignDataRegistered(campaign);

    // register campaign
    user.registerCampaign(address(target), campaign, "");
  }
}
