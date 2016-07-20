import "StandardCampaign.sol";

contract ExampleStandardCampaign is StandardCampaign {
  function contributeMsgValue() {
    contributionBalances[msg.sender] += msg.value;
    ContributionMade(msg.sender);
  }

  function ExampleStandardCampaign(uint _expiry, address _beneficiary) {
    expiry = _expiry;
    beneficiary = _beneficiary;
  }

  mapping(address => uint256) public contributionBalances;
}
