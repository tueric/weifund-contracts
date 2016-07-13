import "Owned.sol";

contract StaffPicks is Owned {

  function register(address _campaign) onlyowner {
    activePicks[_campaign] = true;
    pickedCampaigns.push(_campaign);
  }

  function deactivate(address _campaign) onlyowner {
    activePicks[_campaign] = false;
  }

  mapping(address => bool) public activePicks;
  address[] public pickedCampaigns;
}
