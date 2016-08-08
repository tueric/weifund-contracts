import "Owner.sol";

contract CampaignDataRegistryInterface {
  /// @notice call `register` to register your campaign with a specified data store
  /// @param _campaign the address of the crowdfunding campaign
  /// @param _data the data store of that campaign, potentially an ipfs hash
  function register(address _campaign, bytes _data);

  /// @notice call `storedDate` to retrieve data specified for a campaign address
  /// @param _campaign the address of the crowdfunding campaign
  /// @return the data stored in bytes
  function storedData(address _campaign) constant returns (bytes dataStored);

  event CampaignDataRegistered(address _campaign);
}

contract CampaignDataRegistry is CampaignDataRegistryInterface {

  function () {
    throw;
  }

  modifier senderIsCampaignOwner(address _campaign) {
    if(Owner(_campaign).owner() != msg.sender) {
      throw;
    }
    _
  }

  function register(address _campaign, bytes _data) senderIsCampaignOwner(_campaign) {
    data[_campaign] = _data;
    CampaignDataRegistered(_campaign);
  }

  function storedData(address _campaign) constant returns (bytes dataStored) {
    return data[_campaign];
  }

  mapping(address => bytes) data;
}
