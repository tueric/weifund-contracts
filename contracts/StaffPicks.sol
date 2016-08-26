import "Owner.sol";

contract StaffPicks is Owner {

  function () {
    throw;
  }

  function register(address _campaign) onlyowner {
    activePicks[_campaign] = true;
    pickedCampaigns.push(_campaign);
  }

  function deactivate(address _campaign) onlyowner {
    activePicks[_campaign] = false;
    delete pickedCampaigns[_campaign];
  }

  mapping(address => bool) public activePicks;
  address[] public pickedCampaigns;
}
