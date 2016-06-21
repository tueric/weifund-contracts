import "Campaign.sol";

contract CampaignDataRegistry {

  function register(address _campaignAddress, bytes _data) public {
    if(Campaign(_campaignAddress).owner() == msg.sender) {
      data[_campaignAddress] = _data;
      CampaignDataRegistered(_campaignAddress);
    }
  }

  CampaignDataRegistered(address _campaignAddress);
  mapping(address => bytes) public data;
}
