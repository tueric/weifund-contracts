import "Owner.sol";

contract Blacklist is Owner {

  function () {
    throw;
  }

  function blacklist(address _campaign) onlyowner {
    blacklisted[_campaign] = true;
    blacklistedCampaigns.push(_campaign);
  }

  function whitelist(address _campaign) onlyowner {
    blacklisted[_campaign] = false;
  }

  mapping(address => bool) public blacklisted;
  address[] public blacklistedCampaigns;
}
