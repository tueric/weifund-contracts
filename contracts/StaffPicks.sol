import "Owner.sol";

contract StaffPicksInterface {
  /// @notice register the campaign
  /// @param _campaign the address of the campaign contract
  function register(address _campaign) {}

  /// @notice unregister the campaign
  /// @param _campaign the address of the campaign contract
  function unregister(address _campaign) {}
}

contract StaffPicks is Owner, StaffPicksInterface {

  /// @notice inavalidate fallback method support
  function () {
    throw;
  }

  function register(address _campaign) onlyowner {
    activePicks[_campaign] = true;
    pickedCampaigns.push(_campaign);
  }

  function unregister(address _campaign) onlyowner {
    activePicks[_campaign] = false;
  }

  mapping(address => bool) public activePicks;
  address[] public pickedCampaigns;
}
