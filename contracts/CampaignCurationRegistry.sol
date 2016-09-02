contract CampaignCurationRegistry {
  function approve(address _campaignAddress) {
    if (curators[ids[msg.sender]] != msg.sender) {
      uint curatorID = curators.length++;
      curators[curatorID] = msg.sender;
      ids[msg.sender] = curatorID;
    }

    if (approvals[msg.sender][_campaignAddress] == false) {
      approvedAddresses[msg.sender].push(_campaignAddress);
      approvals[msg.sender][_campaignAddress] = true;
    }
  }

  address[] public curators;
  mapping(address => uint256) public ids;
  mapping(address => address[]) public approvedAddresses;
  mapping(address => mapping(address => bool)) public approvals;
}
