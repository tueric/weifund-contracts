import "StandardCampaign.sol";

contract ExampleStandardCampaign is StandardCampaign {
  function contributeMsgValue() {
    contributions[msg.sender] += msg.value;
    ContributionMade(msg.sender);
  }

  mapping(address => uint256) public contributions;
}
