contract CampaignRegistry {
  event CampaignRegistered(address _campaignAddress, uint _campaignID);
  uint public numCampaigns;
  mapping(address => bytes) public campaigns;
  mapping(uint => address) public toCampaign;
  mapping(address => uint) public toID;

  function register(address campaignAddress, bytes ipfsHash) returns (uint _campaignID) {
    if(toCampaign[toID[campaignAddress]] != address(0))
      _campaignID = numCampaigns++;
    else
      _campaignID = toID[campaignAddress];

    campaigns[campaignAddress] = ipfsHash;
    toID[campaignAddress] = _campaignID;
    CampaignRegistered(campaignAddress, _campaignID);
  }
}
