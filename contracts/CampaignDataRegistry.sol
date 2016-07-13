import "Owned.sol";

contract CampaignDataRegistryInterface {
  /// @notice call `register` to register your campaign with a specified data store
  /// @param _campaign the address of the crowdfunding campaign
  /// @param _data the data store of that campaign, potentially an ipfs hash
  function register(address _campaign, bytes _data);

  /// @notice call `storedDate` to retrieve data specified for a campaign address
  /// @param _campaign the address of the crowdfunding campaign
  /// @return the data stored in bytes
  function storedDate(address _campaign) constant returns (bytes data);

  /// @notice call `_campaignID` to retrieve specified campaign address for that ID
  /// @param _campaignID the campaign ID in question
  /// @return the address of the campaign stored
  function campaignById(uint _campaignID) constant returns (address campaign);

  event CampaignDataRegistered(address _campaign);
}

contract CampaignDataRegistry is CampaignDataRegistryInterface {

  modifier isSenderCampaignOwner(address _campaign) {
    if(Owned(_campaign).owner() == msg.sender) {
      _
    }
  }

  function register(address _campaign, bytes _data) isSenderCampaignOwner(_campaign) {
    data[_campaign] = _data;
    campaigns.push(_campaign);
    CampaignDataRegistered(_campaign);
  }

  function storedDate(address _campaign) constant returns (bytes dataStored) {
    return data[_campaign];
  }

  function campaignById(uint _campaignID) constant returns (address campaign) {
    return campaigns[_campaignID];
  }

  mapping(address => bytes) data;
  address[] campaigns;
}
