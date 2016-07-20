import "HumanStandardCampaign.sol";

contract ExampleHumanStandardCampaign is HumanStandardCampaign {
  function contributeMsgValue() {
    contributions[msg.sender] += msg.value;
    ContributionMade(msg.sender);
  }

  mapping(address => uint256) public contributions;
}
