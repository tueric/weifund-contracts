import "Owner.sol";

contract CampaignRegistryInterface {
  function register(address _campaign, address _interface) returns (uint256 campaignID);
  function idOf(address _campaign) constant returns (uint256 campaignID);
  function interfaceOf(uint256 _campaignID) constant returns (address interface);
  function registeredAt(uint256 _campaignID) constant returns (uint256 registered);
  function addressOf(uint256 _campaignID) constant returns (address campaign);
  function numCampaigns() constant returns (uint256 count);
}

contract CampaignRegistry is CampaignRegistryInterface {
  modifier validRegistration(address _campaign) {
    // campaign owner is sender
    if (Owner(_campaign).owner() != msg.sender) {
      throw;
    }

    // prevent double registrations
    if (campaigns.length > 0) {
      if (campaigns[ids[_campaign]].addr == _campaign) {
        throw;
      }
    }
    _
  }

  function () {
    throw;
  }

  function register(address _campaign, address _interface) validRegistration(_campaign) returns (uint256 campaignID) {
    campaignID = campaigns.length++;
    ids[_campaign] = campaignID;
    campaigns[campaignID] = Campaign({
        addr: _campaign,
        interface: _interface,
        registered: now
    });
    CampaignRegistered(_campaign, _interface, campaignID);
  }

  function idOf(address _campaign) constant returns (uint256 campaignID) {
    return ids[_campaign];
  }

  function interfaceOf(uint256 _campaignID) constant returns (address interface) {
    return campaigns[_campaignID].interface;
  }

  function registeredAt(uint256 _campaignID) constant returns (uint256 registered) {
    return campaigns[_campaignID].registered;
  }

  function addressOf(uint256 _campaignID) constant returns (address campaign) {
    return campaigns[_campaignID].addr;
  }

  function numCampaigns() constant returns (uint256 count) {
    return campaigns.length;
  }

  struct Campaign {
    address addr;
    address interface;
    uint256 registered;
  }

  mapping(address => uint) public ids;
  Campaign[] public campaigns;
  event CampaignRegistered(address _campaign, address _interface, uint256 _campaignID);
}
