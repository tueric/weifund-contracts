contract CampaignCurationRegistry {
  function approve(address _campaignAddress) {
    if (isCurator[msg.sender] == false) {
      isCurator[msg.sender] = true;
      curators.push(msg.sender);
    }

    if (approvals[msg.sender][_campaignAddress] == false) {
      approvedAddresses[msg.sender].push(_campaignAddress);
      approvals[msg.sender][_campaignAddress] = true;
    }
  }

  address[] public curators;
  mapping(address => bool) public isCurator;
  mapping(address => address[]) public approvedAddresses;
  mapping(address => mapping(address => bool)) public approvals;
}
