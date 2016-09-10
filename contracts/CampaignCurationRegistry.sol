contract CampaignCurationRegistryInterface {
  /// @notice approve a specific campaign contract
  /// @param _campaign The contract address of the campaign approved
  function approve(address _campaign) {}
}

contract CampaignCurationRegistry {
  function approve(address _campaign) {
    // check to see if the curator is added
    // if not add the curator
    if (curators[ids[msg.sender]] != msg.sender) {
      uint curatorID = curators.length++;
      curators[curatorID] = msg.sender;
      ids[msg.sender] = curatorID;
    }

    // if the campaign is not already approved, approve the campaign address
    if (approvals[msg.sender][_campaign] == false) {
      approved[msg.sender].push(_campaign);
      approvals[msg.sender][_campaign] = true;
    }

    // fire the campaign approved event
    CampaignApproved(msg.sender, _campaign);
  }

  address[] public curators;
  mapping(address => uint256) public ids;
  mapping(address => address[]) public approved;
  mapping(address => mapping(address => bool)) public approvals;

  event CampaignApproved(address _curator, address _campaign);
}
