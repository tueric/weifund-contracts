import "Named.sol";
import "StandardCampaign.sol";

contract HumanStandardCampaign is Named, StandardCampaign {
  function HumanStandardCampaign(string _name,
    address _beneficiary,
    uint256 _fundingGoal,
    uint256 _expiry) {
    name = _name;
    beneficiary = _beneficiary;
    fundingGoal = _fundingGoal;
    expiry = _expiry;
    owner = msg.sender;
  }
}
